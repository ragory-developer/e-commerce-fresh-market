import { Request, Response } from 'express';
import path from 'path';
import fs from 'fs/promises';
import sharp from 'sharp';
import prisma from '../../config/database';
import { asyncHandler, parsePagination } from '../../utils/helpers';
import { NotFoundError } from '../../utils/errors';
import { AuthRequest } from '../../middleware/auth';

// --- Directory Setup ---
const UPLOAD_BASE = path.join(process.cwd(), 'uploads', 'media');
const DIRS = {
  thumb: path.join(UPLOAD_BASE, 'thumb'),
  medium: path.join(UPLOAD_BASE, 'medium'),
  full: path.join(UPLOAD_BASE, 'full'),
};

// Ensure directories exist
const ensureDirs = async () => {
  for (const dir of Object.values(DIRS)) {
    await fs.mkdir(dir, { recursive: true });
  }
};
ensureDirs();

// --- Size configs ---
const SIZES = {
  thumb: { width: 150, quality: 75 },
  medium: { width: 500, quality: 78 },
  full: { width: 1200, quality: 80 },
};

export class MediaController {
  /**
   * Upload & process an image into 3 WebP sizes
   */
  upload = asyncHandler(async (req: AuthRequest, res: Response) => {
    const file = (req as any).file as Express.Multer.File;
    if (!file) {
      res.status(400).json({ success: false, message: 'No file uploaded' });
      return;
    }

    const cuid = require('@prisma/client').Prisma?.raw
      ? Date.now().toString(36) + Math.random().toString(36).slice(2, 8)
      : Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
    const baseName = `${cuid}`;

    // Get original image metadata
    const metadata = await sharp(file.buffer).metadata();
    const origWidth = metadata.width || 1200;
    const origHeight = metadata.height || 800;

    // Process each size
    const results: Record<string, { path: string; size: number }> = {};

    for (const [sizeName, config] of Object.entries(SIZES)) {
      const targetWidth = Math.min(config.width, origWidth);
      const fileName = `${baseName}-${sizeName}.webp`;
      const filePath = path.join(DIRS[sizeName as keyof typeof DIRS], fileName);

      const processed = await sharp(file.buffer)
        .resize(targetWidth, null, { withoutEnlargement: true })
        .webp({ quality: config.quality })
        .toBuffer();

      await fs.writeFile(filePath, processed);

      results[sizeName] = {
        path: `/uploads/media/${sizeName}/${fileName}`,
        size: processed.length,
      };
    }

    // Extract title from original filename
    const originalName = file.originalname;
    const titleFromFile = path.parse(originalName).name.replace(/[-_]/g, ' ');

    // Create database record
    const media = await prisma.media.create({
      data: {
        fileName: `${baseName}.webp`,
        originalName,
        fileType: 'image/webp',
        fileSize: results.full.size,
        title: titleFromFile,
        altText: titleFromFile,
        width: origWidth,
        height: origHeight,
        urlThumbnail: results.thumb.path,
        urlMedium: results.medium.path,
        urlFull: results.full.path,
      },
    });

    res.status(201).json({ success: true, data: media });
  });

  /**
   * Get all media with pagination and search
   */
  getAll = asyncHandler(async (req: Request, res: Response) => {
    const { page, limit, skip } = parsePagination(req.query as any);
    const { search } = req.query;

    const where: any = {};
    if (search) {
      where.OR = [
        { title: { contains: search as string } },
        { altText: { contains: search as string } },
        { originalName: { contains: search as string } },
      ];
    }

    const [media, total] = await Promise.all([
      prisma.media.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
      prisma.media.count({ where }),
    ]);

    res.json({
      success: true,
      data: media,
      pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
    });
  });

  /**
   * Get single media by ID
   */
  getById = asyncHandler(async (req: Request, res: Response) => {
    const media = await prisma.media.findUnique({
      where: { id: req.params.id as string },
    });
    if (!media) throw new NotFoundError('Media not found');
    res.json({ success: true, data: media });
  });

  /**
   * Update media attributes (alt text, title, caption, description)
   */
  update = asyncHandler(async (req: AuthRequest, res: Response) => {
    const { altText, title, caption, description } = req.body;
    const media = await prisma.media.update({
      where: { id: req.params.id as string },
      data: { altText, title, caption, description },
    });
    res.json({ success: true, data: media });
  });

  /**
   * Delete media — removes files from disk + DB record
   */
  delete = asyncHandler(async (req: AuthRequest, res: Response) => {
    const media = await prisma.media.findUnique({
      where: { id: req.params.id as string },
    });
    if (!media) throw new NotFoundError('Media not found');

    // Delete files from disk
    const urls = [media.urlThumbnail, media.urlMedium, media.urlFull];
    for (const url of urls) {
      const filePath = path.join(process.cwd(), url);
      try {
        await fs.unlink(filePath);
      } catch {
        // File may not exist, ignore
      }
    }

    await prisma.media.delete({ where: { id: req.params.id as string } });
    res.json({ success: true, message: 'Media deleted' });
  });
}
