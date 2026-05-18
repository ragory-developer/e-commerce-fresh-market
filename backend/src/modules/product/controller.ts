import { Request, Response } from 'express';
import prisma from '../../config/database';
import { asyncHandler, slugify, parsePagination } from '../../utils/helpers';
import { NotFoundError } from '../../utils/errors';
import { AuthRequest } from '../../middleware/auth';

export class ProductController {
  /** Get products with search, filter, and pagination */
  getAll = asyncHandler(async (req: Request, res: Response) => {
    const { page, limit, skip } = parsePagination(req.query as any);
    const { search, category, brand, minPrice, maxPrice, sort, featured, hasPromotion } = req.query;

    const where: any = {};
    if (search) {

      where.OR = [
        { name: { contains: search as string } },
        { description: { contains: search as string } },
        { brand: { name: { contains: search as string } } },
        { categories: { some: { name: { contains: search as string } } } },
        { tags: { some: { name: { contains: search as string } } } },
        { variants: { some: { attributes: { some: { value: { contains: search as string } } } } } },
      ];
    }
    if (category) {
      const catSlugs = (category as string).split(',');
      where.categories = { some: { slug: { in: catSlugs } } };
    }
    if (brand) {
      const brandSlugs = (brand as string).split(',');
      where.brand = { slug: { in: brandSlugs } };
    }
    if (minPrice || maxPrice) {
      where.price = {};
      if (minPrice) where.price.gte = parseFloat(minPrice as string);
      if (maxPrice) where.price.lte = parseFloat(maxPrice as string);
    }
    const attributes = req.query.attributes as string;
    if (attributes) {
      const andConditions: any[] = [];
      const attrsList = attributes.split('|');
      for (const group of attrsList) {
        const [attrNameEncoded, valuesCsv] = group.split(':');
        if (valuesCsv) {
          const attrName = decodeURIComponent(attrNameEncoded);
          const values = valuesCsv.split(',').map(decodeURIComponent);
          andConditions.push({
            variants: {
               some: {
                  attributes: {
                     some: {
                        name: attrName,
                        value: { in: values }
                     }
                  }
               }
            }
          });
        }
      }
      if (andConditions.length > 0) {
        where.AND = [ ...(where.AND || []), ...andConditions ];
      }
    }
    if (featured === 'true') where.featured = true;

    if (hasPromotion === 'true') {
      where.specialPrice = { not: null };
      where.AND = [
        ...(where.AND || []),
        {
          OR: [
            { specialPriceEnd: null },
            { specialPriceEnd: { gte: new Date() } }
          ]
        }
      ];
    } else if (hasPromotion === 'false') {
      where.AND = [
        ...(where.AND || []),
        {
          OR: [
            { specialPrice: null },
            { specialPriceEnd: { lt: new Date() } }
          ]
        }
      ];
    }

    // Sort options
    let orderBy: any = { createdAt: 'desc' };
    if (sort === 'price_asc') orderBy = { price: 'asc' };
    else if (sort === 'price_desc') orderBy = { price: 'desc' };
    else if (sort === 'name') orderBy = { name: 'asc' };

    const [products, total] = await Promise.all([
      prisma.product.findMany({
        where,
        include: {
          categories: { select: { id: true, name: true, slug: true } },
          brand: { select: { id: true, name: true, slug: true } },
          tags: { select: { id: true, name: true, slug: true } },
          variants: {
            where: { enabled: true } as any,
            include: { attributes: true },
            orderBy: { isDefault: 'desc' },
          },
        },
        orderBy,
        skip,
        take: limit,
      }),
      prisma.product.count({ where }),
    ]);

    // Compute price range for variable products
    const enriched = (products as any[]).map((p: any) => ({
      ...p,
      priceRange: p.productType === 'VARIABLE' && p.variants.length > 0
        ? {
            min: Math.min(...p.variants.map((v: any) => v.price)),
            max: Math.max(...p.variants.map((v: any) => v.price)),
          }
        : null,
    }));

    res.json({
      success: true,
      data: enriched,
      pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
    });
  });

  /** Check if a slug is available across ALL entities */
  checkSlug = asyncHandler(async (req: Request, res: Response) => {
    const { slug, excludeId } = req.query;
    if (!slug) {
      res.json({ success: true, available: false });
      return;
    }
    
    const targetSlug = slug as string;
    const eId = excludeId as string;
    
    // Check all tables simultaneously
    const [prod, cat, brand, page] = await Promise.all([
      prisma.product.findFirst({ where: eId ? { slug: targetSlug, id: { not: eId } } : { slug: targetSlug } }),
      prisma.category.findFirst({ where: eId ? { slug: targetSlug, id: { not: eId } } : { slug: targetSlug } }),
      prisma.brand.findFirst({ where: eId ? { slug: targetSlug, id: { not: eId } } : { slug: targetSlug } }),
      prisma.page.findFirst({ where: eId ? { slug: targetSlug, id: { not: eId } } : { slug: targetSlug } }),
    ]);

    const existing = prod || cat || brand || page;
    res.json({ success: true, available: !existing });
  });

  /** Get all product slugs (for ISR) */
  getSlugs = asyncHandler(async (req: Request, res: Response) => {
    const products = await prisma.product.findMany({
      select: { slug: true }
    });
    res.json({ success: true, data: products.map(p => p.slug) });
  });

  /** Get a single product by slug */
  getBySlug = asyncHandler(async (req: Request, res: Response) => {
    const product = await prisma.product.findUnique({
      where: { slug: req.params.slug as string },
      include: {
        categories: { 
          include: { 
            parent: { 
              include: { 
                parent: {
                  include: {
                    parent: true
                  }
                }
              }
            } 
          } 
        },
        brand: { select: { id: true, name: true, slug: true } },
        tags: { select: { id: true, name: true, slug: true } },
        variants: {
          include: { attributes: true },
          orderBy: { isDefault: 'desc' },
        },
      },
    });
    if (!product) throw new NotFoundError('Product not found');

    const p = product as any;

    // Price range from all enabled variants
    const enabledVariants = (p.variants as any[]).filter((v: any) => v.enabled);
    const priceRange = p.productType === 'VARIABLE' && enabledVariants.length > 0
      ? {
          min: Math.min(...enabledVariants.map((v: any) => v.price)),
          max: Math.max(...enabledVariants.map((v: any) => v.price)),
        }
      : null;

    // Query payload for product cards to support variable products price ranges
    const productCardSelect = {
      id: true,
      name: true,
      slug: true,
      price: true,
      specialPrice: true,
      specialPriceStart: true,
      specialPriceEnd: true,
      image: true,
      unit: true,
      productType: true,
      variants: {
        where: { enabled: true },
        select: { price: true, specialPrice: true, specialPriceStart: true, specialPriceEnd: true }
      }
    };

    // Get related products from same category
    const firstCategoryId = (p.categories as any[])[0]?.id;
    const related = firstCategoryId ? await prisma.product.findMany({
      where: { categories: { some: { id: firstCategoryId } }, id: { not: p.id } },
      take: 4,
      select: productCardSelect,
    }) : [];

    let resolvedUpsells: any[] = [];
    if (p.upsellProducts && Array.isArray(p.upsellProducts) && p.upsellProducts.length > 0) {
      resolvedUpsells = await prisma.product.findMany({
        where: { id: { in: p.upsellProducts as string[] } },
        select: productCardSelect,
        take: 8
      });
    } else if (p.upsellCategoryIds && Array.isArray(p.upsellCategoryIds) && p.upsellCategoryIds.length > 0) {
      resolvedUpsells = await prisma.product.findMany({
        where: { categories: { some: { id: { in: p.upsellCategoryIds as string[] } } }, id: { not: p.id } },
        select: productCardSelect,
        take: 8
      });
    }

    let resolvedDownsells: any[] = [];
    if (p.downsellProducts && Array.isArray(p.downsellProducts) && p.downsellProducts.length > 0) {
      resolvedDownsells = await prisma.product.findMany({
        where: { id: { in: p.downsellProducts as string[] } },
        select: productCardSelect,
        take: 8
      });
    } else if (p.downsellCategoryIds && Array.isArray(p.downsellCategoryIds) && p.downsellCategoryIds.length > 0) {
      resolvedDownsells = await prisma.product.findMany({
        where: { categories: { some: { id: { in: p.downsellCategoryIds as string[] } } }, id: { not: p.id } },
        select: productCardSelect,
        take: 8
      });
    }

    res.json({ success: true, data: { ...p, priceRange, related, resolvedUpsells, resolvedDownsells } });
  });

  /** Admin: create a product with variants */
  create = asyncHandler(async (req: AuthRequest, res: Response) => {
    const {
      name, description, shortDescription, price, specialPrice, specialPriceStart, specialPriceEnd, stock, image, images,
      unit, weight, featured, categoryIds, brandId, variants, tags, specifications, faqs, slug: customSlug,
      upsellProducts, upsellCategoryIds, downsellProducts, downsellCategoryIds, seoData
    } = req.body;

    let baseSlug = customSlug ? slugify(customSlug) : slugify(name);
    let slug = baseSlug;
    
    if (customSlug) {
      const existing = await prisma.product.findUnique({ where: { slug } });
      if (existing) {
        res.status(400).json({ success: false, message: 'The custom slug is already taken. Please choose another one.' });
        return;
      }
    } else {
      let counter = 1;
      while (await prisma.product.findUnique({ where: { slug } })) {
        slug = `${baseSlug}-${counter}`;
        counter++;
      }
    }
    const hasVariants = Array.isArray(variants) && variants.length > 0;

    const data: any = {
      name,
      slug,
      productType: hasVariants ? 'VARIABLE' : 'SIMPLE',
      description,
      shortDescription,
      price,
      specialPrice,
      specialPriceStart: specialPriceStart ? new Date(specialPriceStart) : null,
      specialPriceEnd: specialPriceEnd ? new Date(specialPriceEnd) : null,
      stock: hasVariants ? 0 : (stock ?? 0),
      image,
      images: images || [],
      unit,
      weight,
      featured,
      brandId: brandId || null,
      upsellProducts: upsellProducts ?? null,
      upsellCategoryIds: upsellCategoryIds ?? null,
      downsellProducts: downsellProducts ?? null,
      downsellCategoryIds: downsellCategoryIds ?? null,
      specifications: specifications?.length ? specifications : null,
      faqs: faqs?.length ? faqs : null,
      seoData: seoData || null,
      categories: categoryIds?.length ? { connect: categoryIds.map((id: string) => ({ id })) } : undefined,
      tags: tags?.length ? { connect: tags.map((id: string) => ({ id })) } : undefined,
      variants: hasVariants ? {
        create: variants.map((v: any, idx: number) => ({
          sku: v.sku || null,
          price: v.price ?? price,
          specialPrice: v.specialPrice ?? null,
          specialPriceStart: v.specialPriceStart ? new Date(v.specialPriceStart) : null,
          specialPriceEnd: v.specialPriceEnd ? new Date(v.specialPriceEnd) : null,
          stock: 0,
          image: v.image || null,
          isDefault: v.isDefault ?? idx === 0,
          enabled: v.enabled ?? true,
          attributes: v.attributes?.length ? {
            create: v.attributes.map((a: any) => ({
              name: a.name,
              value: a.value,
            })),
          } : undefined,
        })),
      } : undefined,
    };

    const product = await (prisma.product.create as any)({
      data,
      include: {
        categories: true,
        brand: true,
        variants: { include: { attributes: true } },
      },
    });

    res.status(201).json({ success: true, data: product });
  });

  /** Admin: update a product */
  update = asyncHandler(async (req: AuthRequest, res: Response) => {
    const {
      name, description, shortDescription, price, specialPrice, specialPriceStart, specialPriceEnd, stock, image, images,
      unit, weight, featured, categoryIds, brandId, tags, productType, variants, slug: customSlug, specifications, faqs,
      upsellProducts, upsellCategoryIds, downsellProducts, downsellCategoryIds, seoData
    } = req.body;

    const data: any = {
      description, shortDescription, price, specialPrice,
      specialPriceStart: specialPriceStart ? new Date(specialPriceStart) : null,
      specialPriceEnd: specialPriceEnd ? new Date(specialPriceEnd) : null,
      stock, image, images, unit, weight, featured, brandId,
      productType,
      upsellProducts: upsellProducts !== undefined ? upsellProducts : undefined,
      upsellCategoryIds: upsellCategoryIds !== undefined ? (upsellCategoryIds || null) : undefined,
      downsellProducts: downsellProducts !== undefined ? downsellProducts : undefined,
      downsellCategoryIds: downsellCategoryIds !== undefined ? (downsellCategoryIds || null) : undefined,
      specifications: specifications || null,
      faqs: faqs || null,
      categories: categoryIds ? { set: categoryIds.map((id: string) => ({ id })) } : undefined,
      tags: tags ? { set: tags.map((id: string) => ({ id })) } : undefined,
      seoData: seoData !== undefined ? (seoData || null) : undefined,
    };
    
    if (name || customSlug) {
      if (name) data.name = name;
      let baseSlug = customSlug ? slugify(customSlug) : slugify(name || req.body.name);
      let slug = baseSlug;
      
      if (customSlug) {
        const existing = await prisma.product.findFirst({ where: { slug, id: { not: req.params.id as string } } });
        if (existing) {
          res.status(400).json({ success: false, message: 'The custom slug is already taken. Please choose another one.' });
          return;
        }
      } else {
        let counter = 1;
        while (await prisma.product.findFirst({ where: { slug, id: { not: req.params.id as string } } })) {
          slug = `${baseSlug}-${counter}`;
          counter++;
        }
      }
      data.slug = slug;
    }

    if (variants && Array.isArray(variants)) {
      const incomingIds = variants.map((v: any) => v.id).filter(Boolean);
      await prisma.productVariant.updateMany({
        where: { productId: req.params.id as string, id: { notIn: incomingIds } },
        data: { enabled: false }
      });

      data.variants = {
        upsert: variants.map((v: any, idx: number) => ({
          where: { id: v.id || 'new_placeholder_' + idx },
          update: {
            sku: v.sku || null,
            price: v.price ?? price,
            specialPrice: v.specialPrice ?? null,
            specialPriceStart: v.specialPriceStart ? new Date(v.specialPriceStart) : null,
            specialPriceEnd: v.specialPriceEnd ? new Date(v.specialPriceEnd) : null,
            image: v.image || null,
            isDefault: v.isDefault ?? idx === 0,
            enabled: v.enabled ?? true,
            attributes: {
              deleteMany: {},
              create: v.attributes?.map((a: any) => ({ name: a.name, value: a.value })) || []
            }
          },
          create: {
            sku: v.sku || null,
            price: v.price ?? price,
            specialPrice: v.specialPrice ?? null,
            specialPriceStart: v.specialPriceStart ? new Date(v.specialPriceStart) : null,
            specialPriceEnd: v.specialPriceEnd ? new Date(v.specialPriceEnd) : null,
            stock: 0,
            image: v.image || null,
            isDefault: v.isDefault ?? idx === 0,
            enabled: v.enabled ?? true,
            attributes: {
              create: v.attributes?.map((a: any) => ({ name: a.name, value: a.value })) || []
            }
          }
        }))
      };
    }

    const product = await (prisma.product.update as any)({
      where: { id: req.params.id },
      data,
      include: {
        categories: true,
        brand: true,
        variants: { include: { attributes: true } },
      },
    });
    res.json({ success: true, data: product, debugData: data });
  });

  /** Admin: delete a product */
  delete = asyncHandler(async (req: AuthRequest, res: Response) => {
    await prisma.product.delete({ where: { id: req.params.id as string } });
    res.json({ success: true, message: 'Product deleted' });
  });

  /** Admin: Apply bulk promotion to multiple products */
  applyBulkPromotion = asyncHandler(async (req: AuthRequest, res: Response) => {
    const { productIds, type, value, startDate, endDate, remove } = req.body;

    if (!Array.isArray(productIds) || productIds.length === 0) {
      res.status(400).json({ success: false, message: 'Please select at least one product.' });
      return;
    }

    const start = startDate ? new Date(startDate) : null;
    const end = endDate ? new Date(endDate) : null;

    const products = await prisma.product.findMany({
      where: { id: { in: productIds } },
      include: { variants: true }
    });

    for (const p of products) {
      let specialPrice = null;
      
      if (!remove) {
        if (type === 'PERCENT') {
          specialPrice = p.price - (p.price * value / 100);
        } else {
          specialPrice = Math.max(0, p.price - value);
        }
      }

      await prisma.product.update({
        where: { id: p.id },
        data: {
          specialPrice,
          specialPriceStart: remove ? null : start,
          specialPriceEnd: remove ? null : end,
        }
      });

      if (p.variants && p.variants.length > 0) {
        for (const v of p.variants) {
          let vSpecialPrice = null;
          if (!remove) {
             if (type === 'PERCENT') {
                vSpecialPrice = v.price - (v.price * value / 100);
             } else {
                vSpecialPrice = Math.max(0, v.price - value);
             }
          }

          await prisma.productVariant.update({
            where: { id: v.id },
            data: {
              specialPrice: vSpecialPrice,
              specialPriceStart: remove ? null : start,
              specialPriceEnd: remove ? null : end,
            }
          });
        }
      }
    }

    res.json({ success: true, message: remove ? 'Promotions removed successfully' : 'Bulk promotions applied successfully' });
  });
}
