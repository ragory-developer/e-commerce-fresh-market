import { z } from 'zod';

const textAlignSchema = z.enum(['left', 'center', 'right']);
const imageAlignSchema = z.enum(['left', 'right']);

const baseString = z.string().max(5000);
const urlString = z.string().max(1000);

const heroBannerPropsSchema = z.object({
  title: baseString.optional(),
  subtitle: baseString.optional(),
  ctaText: z.string().max(120).optional(),
  ctaHref: urlString.optional(),
  imageSrc: urlString.optional(),
  textAlign: textAlignSchema.optional(),
}).passthrough();

const specialOffersPropsSchema = z.object({
  title: baseString.optional(),
  subtitle: baseString.optional(),
  ctaText: z.string().max(120).optional(),
  ctaHref: urlString.optional(),
  bgColor: z.string().max(250).optional(),
  leftImageSrc: urlString.optional(),
  rightImageSrc: urlString.optional(),
  textAlign: textAlignSchema.optional(),
}).passthrough();

const productShowcasePropsSchema = z.object({
  title: baseString.optional(),
  subtitle: baseString.optional(),
  showcaseCategoryId: z.string().max(191).optional(),
  showCategoryFilter: z.boolean().optional(),
  textAlign: textAlignSchema.optional(),
}).passthrough();

const testimonialPropsSchema = z.object({
  title: baseString.optional(),
  subtitle: baseString.optional(),
  textAlign: textAlignSchema.optional(),
}).passthrough();

const consultationPropsSchema = z.object({
  title: baseString.optional(),
  subtitle: baseString.optional(),
  ctaText: z.string().max(120).optional(),
  ctaHref: urlString.optional(),
  imageSrc: urlString.optional(),
  imageAlign: imageAlignSchema.optional(),
}).passthrough();

const routinePropsSchema = consultationPropsSchema.extend({
  description: baseString.optional(),
});

const newArrivalsPropsSchema = z.object({
  title: baseString.optional(),
  subtitle: baseString.optional(),
  ctaHref: urlString.optional(),
}).passthrough();

const sectionSchemas: Record<string, z.ZodTypeAny> = {
  HeroBanner: heroBannerPropsSchema,
  SpecialOffersBanner: specialOffersPropsSchema,
  ProductShowcase: productShowcasePropsSchema,
  PromoBadgeGrid: z.object({}).passthrough(),
  TestimonialSection: testimonialPropsSchema,
  HotDealsSection: z.object({}).passthrough(),
  ConsultationBanner: consultationPropsSchema,
  RoutineBanner: routinePropsSchema,
  NewArrivalsSection: newArrivalsPropsSchema,
};

const unsafePattern = /<\s*script|javascript:|on\w+\s*=/i;

function assertNoUnsafeStrings(value: unknown, path = 'document') {
  if (typeof value === 'string') {
    if (unsafePattern.test(value)) {
      throw new Error(`Unsafe content is not allowed at ${path}`);
    }
    return;
  }

  if (Array.isArray(value)) {
    value.forEach((item, index) => assertNoUnsafeStrings(item, `${path}[${index}]`));
    return;
  }

  if (value && typeof value === 'object') {
    Object.entries(value).forEach(([key, item]) => assertNoUnsafeStrings(item, `${path}.${key}`));
  }
}

export const builderSectionSchema = z.object({
  id: z.string().min(1).max(120),
  type: z.string().min(1).max(80),
  props: z.record(z.unknown()).default({}),
  styles: z.record(z.unknown()).optional(),
  settings: z.object({
    hidden: z.boolean().optional(),
    container: z.enum(['full', 'contained']).optional(),
  }).optional(),
});

export const builderDocumentSchema = z.object({
  schemaVersion: z.literal(1),
  page: z.object({
    key: z.string().min(1).max(80),
    slug: z.string().min(1).max(191),
    title: z.string().min(1).max(191),
  }),
  sections: z.array(builderSectionSchema).max(80),
  seo: z.object({
    title: z.string().max(191).optional(),
    description: z.string().max(500).optional(),
  }).optional(),
});

export type BuilderDocument = z.infer<typeof builderDocumentSchema>;

export function validateBuilderDocument(input: unknown): BuilderDocument {
  const document = builderDocumentSchema.parse(input);
  const ids = new Set<string>();

  document.sections.forEach((section, index) => {
    if (ids.has(section.id)) {
      throw new Error(`Duplicate section id: ${section.id}`);
    }
    ids.add(section.id);

    const propsSchema = sectionSchemas[section.type];
    if (!propsSchema) {
      throw new Error(`Unsupported section type at sections[${index}]: ${section.type}`);
    }
    propsSchema.parse(section.props || {});
  });

  assertNoUnsafeStrings(document);
  return document;
}

export function createDefaultHomeDocument(): BuilderDocument {
  return {
    schemaVersion: 1,
    page: {
      key: 'home',
      slug: '/',
      title: 'Home',
    },
    sections: [
      {
        id: 'hero_1',
        type: 'HeroBanner',
        props: {
          title: 'Discover Natural Beauty',
          subtitle: 'Premium skincare for your daily routine',
          ctaText: 'Shop Now',
          ctaHref: '/products',
          imageSrc: 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?auto=format&fit=crop&w=800&q=80',
          textAlign: 'left',
        },
      },
      { id: 'promo_badges_1', type: 'PromoBadgeGrid', props: {} },
      {
        id: 'product_showcase_1',
        type: 'ProductShowcase',
        props: {
          title: 'Shop by Category',
          subtitle: 'Browse our curated collection of premium products',
          showcaseCategoryId: 'all',
          textAlign: 'left',
        },
      },
    ],
  };
}
