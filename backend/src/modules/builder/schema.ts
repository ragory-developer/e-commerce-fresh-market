import { z } from 'zod';

const textAlignSchema = z.enum(['left', 'center', 'right']);
const imageAlignSchema = z.enum(['left', 'right']);

const baseString = z.string().max(5000);
const urlString = z.string().max(1000);

const heroBannerPropsSchema = z.object({
  title: baseString.optional(),
  subtitle: baseString.optional(),
  badgeText: z.string().max(200).optional(),
  description: baseString.optional(),
  offerText: z.string().max(200).optional(),
  offerSubtext: z.string().max(200).optional(),
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
  badgeText: z.string().max(200).optional(),
  features: z.array(z.string().max(500)).optional(),
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
  bgColor: z.string().max(250).optional(),
  bgGradient: z.string().max(500).optional(),
  bgImage: z.string().max(1000).optional(),
  bgOverlay: z.number().min(0).max(100).optional(),
  textColor: z.string().max(250).optional(),
  borderRadius: z.enum(["none", "sm", "md", "lg", "xl", "full"]).optional(),
  paddingX: z.number().optional(),
  paddingY: z.number().optional(),
});

export const builderSectionSchema = z.object({
  id: z.string().min(1).max(120),
  type: z.string().min(1).max(80),
  variant: z.string().min(1).max(80).optional(),
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
    theme: z.string().max(80).nullish(),
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
    page: { key: "home", slug: "/", title: "Home" },
    sections: [
      {
        id: "hero_1",
        type: "HeroBanner",
        variant: "default",
        props: {
          title: "Discover Natural Beauty",
          subtitle: "Premium skincare for your daily routine",
          ctaText: "Shop Now",
          ctaHref: "/products",
          imageSrc: "https://images.unsplash.com/photo-1596462502278-27bfdc403348?auto=format&fit=crop&w=800&q=80",
          textAlign: "left",
        },
      },
      { id: "promo_badges_1", type: "PromoBadgeGrid", variant: "default", props: {} },
      {
        id: "product_showcase_1",
        type: "ProductShowcase",
        variant: "default",
        props: {
          title: "Shop by Category",
          subtitle: "Browse our curated collection of premium products",
          showcaseCategoryId: "all",
          textAlign: "left",
        },
      },
    ],
  };
}

export function createMinimalHomeDocument(): BuilderDocument {
  return {
    schemaVersion: 1,
    page: { key: "home", slug: "/", title: "Home - Minimal" },
    sections: [
      {
        id: "hero_minimal",
        type: "HeroBanner",
        variant: "default",
        props: {
          title: "Pure Organic Living",
          subtitle: "Nourish your skin and body with nature's finest extracts.",
          ctaText: "Explore Collection",
          ctaHref: "/products",
          imageSrc: "https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?auto=format&fit=crop&w=800&q=80",
          textAlign: "center",
        },
      },
      {
        id: "new_arrivals_minimal",
        type: "NewArrivalsSection",
        variant: "default",
        props: {
          title: "The Latest Additions",
          subtitle: "Newly launched items selected for quality and freshness.",
          ctaHref: "/products?sort=newest",
        },
      },
      {
        id: "routine_minimal",
        type: "RoutineBanner",
        variant: "default",
        props: {
          title: "Simple Cleanse Routine",
          subtitle: "A step-by-step skincare guide",
          description: "Follow this minimalist routine with our organic green tea products to maintain skin health with zero clutter.",
          ctaText: "Learn More",
          ctaHref: "/guides/cleanse",
          imageSrc: "https://images.unsplash.com/photo-1556229174-5e42a09e45af?auto=format&fit=crop&w=800&q=80",
          imageAlign: "right",
        },
      },
    ],
  };
}

export function createDiscountHomeDocument(): BuilderDocument {
  return {
    schemaVersion: 1,
    page: { key: "home", slug: "/", title: "Home - Deals" },
    sections: [
      {
        id: "hero_discount",
        type: "HeroBanner",
        variant: "default",
        props: {
          title: "Massive Summer Deals!",
          subtitle: "Premium organic wellness up to 60% OFF.",
          ctaText: "Shop the Sale",
          ctaHref: "/products?sort=discount",
          imageSrc: "https://images.unsplash.com/photo-1556228578-0d85b1a4d571?auto=format&fit=crop&w=800&q=80",
          textAlign: "left",
        },
      },
      {
        id: "promo_badges_discount",
        type: "PromoBadgeGrid",
        variant: "default",
        props: {},
      },
      {
        id: "hot_deals_discount",
        type: "HotDealsSection",
        variant: "default",
        props: {
          title: "Flash Discount Deals",
          subtitle: "Limited quantity offers. Act fast before they sell out!",
        },
      },
      {
        id: "special_offers_discount",
        type: "SpecialOffersBanner",
        variant: "default",
        props: {
          title: "Bundle & Save Extra",
          subtitle: "Get free delivery and extra gifts with any combo set purchase.",
          ctaText: "View Combos",
          ctaHref: "/products?offer=combo",
        },
      },
      {
        id: "testimonials_discount",
        type: "TestimonialSection",
        variant: "default",
        props: {
          title: "Loved by thousands",
          subtitle: "See why customers keep coming back for our premium sales.",
        },
      },
    ],
  };
}

export function createWellnessHomeDocument(): BuilderDocument {
  return {
    schemaVersion: 1,
    page: { key: "home", slug: "/", title: "Home - Wellness" },
    sections: [
      {
        id: "hero_wellness",
        type: "HeroBanner",
        variant: "default",
        props: {
          title: "Holistic Health & Beauty",
          subtitle: "Nurtured by nature, refined by advanced organic science.",
          ctaText: "Book Appointment",
          ctaHref: "/consultation",
          imageSrc: "https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&w=800&q=80",
          textAlign: "left",
        },
      },
      {
        id: "product_showcase_wellness",
        type: "ProductShowcase",
        variant: "default",
        props: {
          title: "Organic Superfoods & Herbals",
          subtitle: "Boost your nutrition with our organic certified categories.",
          showcaseCategoryId: "all",
          textAlign: "center",
        },
      },
      {
        id: "consultation_wellness",
        type: "ConsultationBanner",
        variant: "default",
        props: {
          title: "Free Skincare Consultation",
          subtitle: "Discuss with certified nutritionists and skincare experts online.",
          ctaText: "Reserve Now",
          ctaHref: "/consultation",
          imageSrc: "https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&w=800&q=80",
          imageAlign: "right",
        },
      },
      {
        id: "routine_wellness",
        type: "RoutineBanner",
        variant: "default",
        props: {
          title: "Daily Healthy Glow Guide",
          subtitle: "Achieve visible health from inside out",
          description: "Download our custom curated morning routine planner. Learn what nutrients keep your skin elastic and protected all day.",
          ctaText: "Read the Guide",
          ctaHref: "/guides/routine",
          imageSrc: "https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?auto=format&fit=crop&w=800&q=80",
          imageAlign: "left",
        },
      },
    ],
  };
}



