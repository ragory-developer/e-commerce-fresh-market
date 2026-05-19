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
  themeVariant: z.enum(['default', 'eid', 'puja']).optional(),
}).passthrough();

const slideSchema = z.object({
  title: baseString,
  subtitle: baseString,
  description: baseString,
  cta: z.string().max(120),
  href: urlString,
  image: urlString,
  gradient: z.string().max(250),
});

const heroSliderPropsSchema = z.object({
  slides: z.array(slideSchema).optional(),
}).passthrough();

const campaignBannerPropsSchema = z.object({
  title: baseString.optional(),
  subtitle: baseString.optional(),
  ctaText: z.string().max(120).optional(),
  ctaHref: urlString.optional(),
}).passthrough();

const eidSpecialBannerPropsSchema = campaignBannerPropsSchema;
const pujaSpecialBannerPropsSchema = campaignBannerPropsSchema;
const ramadanSpecialBannerPropsSchema = campaignBannerPropsSchema;
const boishakhSpecialBannerPropsSchema = campaignBannerPropsSchema;
const blackfridaySpecialBannerPropsSchema = campaignBannerPropsSchema;
const christmasSpecialBannerPropsSchema = campaignBannerPropsSchema;

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
  testimonials: z.array(z.object({
    name: baseString,
    avatar: urlString,
    rating: z.number().min(1).max(5),
    review: baseString,
    product: baseString,
  })).optional(),
}).passthrough();

const promoBadgeGridPropsSchema = z.object({
  badges: z.array(z.object({
    title: baseString,
    subtitle: baseString,
    iconName: z.string().max(80),
    bgColor: z.string().max(120),
    href: urlString,
  })).optional(),
}).passthrough();

const hotDealsSectionPropsSchema = z.object({
  title: baseString.optional(),
  subtitle: baseString.optional(),
  deals: z.array(z.object({
    name: baseString,
    originalPrice: z.string().max(80),
    salePrice: z.string().max(80),
    discount: z.string().max(80),
    image: urlString,
    endsIn: z.string().max(80).optional(),
  })).optional(),
}).passthrough();

const consultationPropsSchema = z.object({
  title: baseString.optional(),
  subtitle: baseString.optional(),
  features: z.array(z.string().max(500)).max(10).optional(),
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
  items: z.array(z.object({
    name: baseString,
    price: z.string().max(80),
    image: urlString,
    badge: z.string().max(80).optional(),
  })).max(12).optional(),
}).passthrough();

const sectionSchemas: Record<string, z.ZodTypeAny> = {
  HeroBanner: heroBannerPropsSchema,
  SpecialOffersBanner: specialOffersPropsSchema,
  ProductShowcase: productShowcasePropsSchema,
  PromoBadgeGrid: promoBadgeGridPropsSchema,
  TestimonialSection: testimonialPropsSchema,
  HotDealsSection: hotDealsSectionPropsSchema,
  ConsultationBanner: consultationPropsSchema,
  RoutineBanner: routinePropsSchema,
  NewArrivalsSection: newArrivalsPropsSchema,
  EidSpecialBanner: eidSpecialBannerPropsSchema,
  PujaSpecialBanner: pujaSpecialBannerPropsSchema,
  RamadanSpecialBanner: ramadanSpecialBannerPropsSchema,
  BoishakhSpecialBanner: boishakhSpecialBannerPropsSchema,
  BlackFridaySpecialBanner: blackfridaySpecialBannerPropsSchema,
  ChristmasSpecialBanner: christmasSpecialBannerPropsSchema,
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

export const builderSectionStyleSchema = z.object({
  spacingTop: z.enum(["none", "sm", "md", "lg", "xl"]).optional(),
  spacingBottom: z.enum(["none", "sm", "md", "lg", "xl"]).optional(),
  background: z.enum(["white", "gray", "brand", "dark"]).optional(),
  container: z.enum(["full", "contained", "narrow"]).optional(),
  customClass: z.string().max(250).optional(),
  customBgColor: z.string().max(80).optional(),
  customBgImage: z.string().max(1000).optional(),
  customTextColor: z.string().max(80).optional(),
  customPadding: z.string().max(100).optional(),
  customAlignment: z.enum(["left", "center", "right"]).optional(),
});

export const builderSectionSchema = z.object({
  id: z.string().min(1).max(120),
  type: z.string().min(1).max(80),
  props: z.record(z.unknown()).default({}),
  styles: builderSectionStyleSchema.optional(),
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
