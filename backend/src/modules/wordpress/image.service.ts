/**
 * Image download + Sharp processing service for WordPress import.
 * Downloads remote images, converts to WebP in 3 sizes, saves to disk, upserts Media record.
 */

import path from 'path';
import fs from 'fs/promises';
import sharp from 'sharp';
import prisma from '../../config/database';

const UPLOAD_BASE = path.join(process.cwd(), 'uploads', 'media');
const DIRS = {
  thumb: path.join(UPLOAD_BASE, 'thumb'),
  medium: path.join(UPLOAD_BASE, 'medium'),
  full: path.join(UPLOAD_BASE, 'full'),
};

const SIZES = {
  thumb:  { width: 150,  quality: 75 },
  medium: { width: 500,  quality: 78 },
  full:   { width: 1200, quality: 80 },
};

async function ensureDirs() {
  for (const dir of Object.values(DIRS)) {
    await fs.mkdir(dir, { recursive: true });
  }
}

function generateBaseName(): string {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
}

/**
 * Download a remote image URL and save it as WebP (3 sizes) into the media library.
 * Returns the DB Media record URL (full path, e.g. /uploads/media/full/xxx-full.webp).
 * Deduplicates by checking originalName (derived from URL basename).
 */
export async function downloadAndSaveImage(imageUrl: string, altText = ''): Promise<string> {
  await ensureDirs();

  const urlPath = new URL(imageUrl).pathname;
  const originalName = path.basename(urlPath);

  const existing = await prisma.media.findFirst({
    where: { originalName },
    select: { urlFull: true },
  });
  if (existing) return existing.urlFull;

  console.log(`[Image] Downloading: ${imageUrl}`);
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 60000); 
  
  try {
    const resp = await fetch(imageUrl, {
      headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/120.0.0.0 Safari/537.36' },
      signal: controller.signal
    });
    clearTimeout(timeoutId);
    if (!resp.ok) throw new Error(`Image download failed (${resp.status}): ${imageUrl}`);
    const buffer = Buffer.from(await resp.arrayBuffer());
    console.log(`[Image] Downloaded: ${imageUrl} (${buffer.length} bytes)`);
    return await saveImageBuffer(buffer, originalName, altText);
  } catch (err: any) {
    clearTimeout(timeoutId);
    if (err.name === 'AbortError') throw new Error(`Image download timed out: ${imageUrl}`);
    throw err;
  }
}

async function saveImageBuffer(buffer: Buffer, originalName: string, altText: string): Promise<string> {
  // Process with sharp
  const metadata = await sharp(buffer).metadata();
  const origWidth  = metadata.width  ?? 1200;
  const origHeight = metadata.height ?? 800;

  const baseName = generateBaseName();
  const results: Record<string, { path: string; size: number }> = {};

  for (const [sizeName, cfg] of Object.entries(SIZES)) {
    const targetWidth = Math.min(cfg.width, origWidth);
    const fileName = `${baseName}-${sizeName}.webp`;
    const filePath = path.join(DIRS[sizeName as keyof typeof DIRS], fileName);

    const processed = await sharp(buffer)
      .resize(targetWidth, null, { withoutEnlargement: true })
      .webp({ quality: cfg.quality })
      .toBuffer();

    await fs.writeFile(filePath, processed);
    results[sizeName] = { path: `/uploads/media/${sizeName}/${fileName}`, size: processed.length };
  }

  const titleFromFile = path.parse(originalName).name.replace(/[-_]/g, ' ');

  await prisma.media.create({
    data: {
      fileName: `${baseName}.webp`,
      originalName,
      fileType: 'image/webp',
      fileSize: results.full.size,
      title: titleFromFile,
      altText: altText || titleFromFile,
      width: origWidth,
      height: origHeight,
      urlThumbnail: results.thumb.path,
      urlMedium: results.medium.path,
      urlFull: results.full.path,
    },
  });

  return results.full.path;
}
