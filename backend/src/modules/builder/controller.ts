import { Request, Response } from 'express';
import { Prisma } from '@prisma/client';
import prisma from '../../config/database';
import { asyncHandler } from '../../utils/helpers';
import { BadRequestError, NotFoundError } from '../../utils/errors';
import { AuthRequest } from '../../middleware/auth';
import { BuilderDocument, createDefaultHomeDocument, validateBuilderDocument } from './schema';

function getParam(value: string | string[] | undefined, name: string) {
  if (typeof value !== 'string') {
    throw new BadRequestError(`Invalid ${name}`);
  }
  return value;
}

function toInputJson(document: BuilderDocument): Prisma.InputJsonValue {
  return JSON.parse(JSON.stringify(document)) as Prisma.InputJsonValue;
}

function normalizePageMeta(key: string, document?: BuilderDocument) {
  return {
    key,
    slug: document?.page.slug || (key === 'home' ? '/' : `/${key}`),
    title: document?.page.title || (key === 'home' ? 'Home' : key),
  };
}

export class BuilderController {
  private async ensurePage(key: string, document?: BuilderDocument) {
    const meta = normalizePageMeta(key, document);
    let page = await prisma.builderPage.findUnique({ where: { key } });

    if (!page) {
      page = await prisma.builderPage.create({
        data: {
          key,
          slug: meta.slug,
          title: meta.title,
        },
      });
    }

    return page;
  }

  private async ensureHomeSeed() {
    const existing = await prisma.builderPage.findUnique({
      where: { key: 'home' },
      include: { versions: { take: 1 } },
    });

    if (existing && existing.versions.length > 0) return;

    const document = createDefaultHomeDocument();
    await prisma.$transaction(async (tx) => {
      const page = existing || await tx.builderPage.create({
        data: {
          key: 'home',
          slug: '/',
          title: 'Home',
        },
      });

      const version = await tx.builderPageVersion.create({
        data: {
          pageId: page.id,
          version: 1,
          status: 'published',
          document: toInputJson(document),
          publishedAt: new Date(),
        },
      });

      await tx.builderPage.update({
        where: { id: page.id },
        data: {
          status: 'published',
          draftVersionId: version.id,
          publishedVersionId: version.id,
        },
      });
    });
  }

  getAdminPage = asyncHandler(async (req: AuthRequest, res: Response) => {
    const key = getParam(req.params.key, 'page key');
    if (key === 'home') await this.ensureHomeSeed();

    const page = await prisma.builderPage.findUnique({ where: { key } });
    if (!page) throw new NotFoundError('Builder page not found');

    const [draft, published] = await Promise.all([
      page.draftVersionId
        ? prisma.builderPageVersion.findUnique({ where: { id: page.draftVersionId } })
        : null,
      page.publishedVersionId
        ? prisma.builderPageVersion.findUnique({ where: { id: page.publishedVersionId } })
        : null,
    ]);

    res.json({
      success: true,
      data: {
        page,
        draft,
        published,
        dirty: draft?.id !== published?.id,
      },
    });
  });

  saveDraft = asyncHandler(async (req: AuthRequest, res: Response) => {
    const key = getParam(req.params.key, 'page key');
    let document: BuilderDocument;

    try {
      document = validateBuilderDocument(req.body.document);
    } catch (error: any) {
      throw new BadRequestError(error.message || 'Invalid builder document');
    }

    if (document.page.key !== key) {
      throw new BadRequestError('Document page key does not match route key');
    }

    const result = await prisma.$transaction(async (tx) => {
      const existingPage = await tx.builderPage.findUnique({ where: { key } });
      const page = existingPage || await tx.builderPage.create({
        data: {
          key,
          slug: document.page.slug,
          title: document.page.title,
        },
      });

      const latest = await tx.builderPageVersion.findFirst({
        where: { pageId: page.id },
        orderBy: { version: 'desc' },
      });

      const draft = await tx.builderPageVersion.create({
        data: {
          pageId: page.id,
          version: (latest?.version || 0) + 1,
          status: 'draft',
          document: toInputJson(document),
          createdById: req.user?.userId,
        },
      });

      const updatedPage = await tx.builderPage.update({
        where: { id: page.id },
        data: {
          title: document.page.title,
          slug: document.page.slug,
          status: page.publishedVersionId ? 'published' : 'draft',
          draftVersionId: draft.id,
        },
      });

      return { page: updatedPage, draft };
    });

    res.json({ success: true, data: result, message: 'Draft saved' });
  });

  publish = asyncHandler(async (req: AuthRequest, res: Response) => {
    const key = getParam(req.params.key, 'page key');
    const page = await this.ensurePage(key);
    const draftVersionId = req.body.draftVersionId || page.draftVersionId;

    if (!draftVersionId) {
      throw new BadRequestError('No draft available to publish');
    }

    const result = await prisma.$transaction(async (tx) => {
      const draft = await tx.builderPageVersion.findUnique({ where: { id: draftVersionId } });
      if (!draft || draft.pageId !== page.id) {
        throw new BadRequestError('Draft version not found for this page');
      }

      let document: BuilderDocument;
      try {
        document = validateBuilderDocument(draft.document);
      } catch (error: any) {
        throw new BadRequestError(error.message || 'Draft is invalid');
      }

      await tx.builderPageVersion.updateMany({
        where: { pageId: page.id, status: 'published' },
        data: { status: 'archived' },
      });

      const published = await tx.builderPageVersion.update({
        where: { id: draft.id },
        data: {
          status: 'published',
          publishedAt: new Date(),
        },
      });

      const updatedPage = await tx.builderPage.update({
        where: { id: page.id },
        data: {
          status: 'published',
          title: document.page.title,
          slug: document.page.slug,
          draftVersionId: published.id,
          publishedVersionId: published.id,
        },
      });

      return { page: updatedPage, published };
    });

    res.json({ success: true, data: result, message: 'Page published' });
  });

  getVersions = asyncHandler(async (req: AuthRequest, res: Response) => {
    const key = getParam(req.params.key, 'page key');
    const page = await prisma.builderPage.findUnique({ where: { key } });
    if (!page) throw new NotFoundError('Builder page not found');

    const versions = await prisma.builderPageVersion.findMany({
      where: { pageId: page.id },
      orderBy: { version: 'desc' },
      take: 50,
    });

    res.json({ success: true, data: versions });
  });

  getPublicPage = asyncHandler(async (req: Request, res: Response) => {
    const key = getParam(req.params.key, 'page key');
    if (key === 'home') await this.ensureHomeSeed();

    const page = await prisma.builderPage.findUnique({ where: { key } });
    if (!page || !page.publishedVersionId) {
      throw new NotFoundError('Published page not found');
    }

    const published = await prisma.builderPageVersion.findUnique({
      where: { id: page.publishedVersionId },
    });

    if (!published || published.status !== 'published') {
      throw new NotFoundError('Published page not found');
    }

    res.json({
      success: true,
      data: {
        page,
        version: {
          id: published.id,
          version: published.version,
          publishedAt: published.publishedAt,
          document: published.document,
        },
      },
    });
  });
}
