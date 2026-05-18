"use client";

import HeroBanner from "@/components/home/HeroBanner";
import SpecialOffersBanner from "@/components/home/SpecialOffersBanner";
import ProductShowcase from "@/components/home/ProductShowcase";
import TestimonialSection from "@/components/home/TestimonialSection";
import PromoBadgeGrid from "@/components/home/PromoBadgeGrid";
import HotDealsSection from "@/components/home/HotDealsSection";
import ConsultationBanner from "@/components/home/ConsultationBanner";
import RoutineBanner from "@/components/home/RoutineBanner";
import NewArrivalsSection from "@/components/home/NewArrivalsSection";
import type { BuilderSection, SectionDefinition, SectionRenderContext } from "./types";
import type { ComponentType } from "react";
import {
  ConsultationEditor,
  HeroBannerEditor,
  NewArrivalsEditor,
  ProductShowcaseEditor,
  RoutineEditor,
  SpecialOffersEditor,
  StaticSectionEditor,
  TestimonialEditor,
} from "./editors";

type ProductLike = {
  categoryId?: unknown;
  category?: { id?: unknown };
  categories?: Array<{ id?: unknown }>;
};

const productResolver = (props: Record<string, unknown>, context: SectionRenderContext) => {
  const allProducts = context.allProducts || [];
  const categoryId = props.showcaseCategoryId;
  const products = categoryId && categoryId !== "all"
    ? allProducts.filter((item) => {
      const product = item as ProductLike;
      return product.categoryId === categoryId
        || product.category?.id === categoryId
        || product.categories?.some((category) => category.id === categoryId);
    })
    : allProducts;

  return { ...props, products };
};

export const sectionRegistry: Record<string, SectionDefinition> = {
  HeroBanner: {
    type: "HeroBanner",
    label: "Hero Banner",
    category: "Hero",
    defaultProps: {
      title: "Discover Natural Beauty",
      subtitle: "Premium skincare for your daily routine",
      ctaText: "Shop Now",
      ctaHref: "/products",
      imageSrc: "https://images.unsplash.com/photo-1596462502278-27bfdc403348?auto=format&fit=crop&w=800&q=80",
      textAlign: "left",
    },
    Renderer: HeroBanner,
    Editor: HeroBannerEditor,
  },
  SpecialOffersBanner: {
    type: "SpecialOffersBanner",
    label: "Special Offers",
    category: "Marketing",
    defaultProps: {
      title: "Special Offers",
      subtitle: "Get the best deals",
      ctaText: "Shop Now",
      ctaHref: "/products?sort=discount",
      bgColor: "from-blue-600 via-blue-700 to-indigo-800",
      leftImageSrc: "https://images.unsplash.com/photo-1556228578-0d85b1a4d571?auto=format&fit=crop&w=400&q=80",
      rightImageSrc: "https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?auto=format&fit=crop&w=400&q=80",
      textAlign: "left",
    },
    Renderer: SpecialOffersBanner,
    Editor: SpecialOffersEditor,
  },
  ProductShowcase: {
    type: "ProductShowcase",
    label: "Product Grid",
    category: "Commerce",
    defaultProps: {
      title: "Shop by Category",
      subtitle: "Browse our curated collection of premium products",
      showcaseCategoryId: "all",
      textAlign: "left",
    },
    Renderer: ProductShowcase as unknown as ComponentType<Record<string, unknown>>,
    Editor: ProductShowcaseEditor,
    resolveProps: productResolver,
  },
  PromoBadgeGrid: {
    type: "PromoBadgeGrid",
    label: "Promo Features",
    category: "Marketing",
    defaultProps: {},
    Renderer: PromoBadgeGrid,
    Editor: StaticSectionEditor,
  },
  TestimonialSection: {
    type: "TestimonialSection",
    label: "Testimonials",
    category: "Content",
    defaultProps: {
      title: "Real Results, Real Beauty",
      subtitle: "See what our customers are saying",
      textAlign: "center",
    },
    Renderer: TestimonialSection,
    Editor: TestimonialEditor,
  },
  HotDealsSection: {
    type: "HotDealsSection",
    label: "Hot Deals",
    category: "Commerce",
    defaultProps: {},
    Renderer: HotDealsSection,
    Editor: StaticSectionEditor,
  },
  ConsultationBanner: {
    type: "ConsultationBanner",
    label: "Consultation",
    category: "Marketing",
    defaultProps: {
      title: "Doctor's Skincare Consultation",
      subtitle: "Get personalized skincare advice from certified dermatologists",
      ctaText: "Book Now",
      ctaHref: "/consultation",
      imageSrc: "https://images.unsplash.com/photo-1559599101-f09722fb4948?auto=format&fit=crop&w=800&q=80",
      imageAlign: "right",
    },
    Renderer: ConsultationBanner,
    Editor: ConsultationEditor,
  },
  RoutineBanner: {
    type: "RoutineBanner",
    label: "Routine",
    category: "Content",
    defaultProps: {
      title: "Simplify Your Skincare Routine",
      subtitle: "Curated just for you",
      description: "Discover easy-to-follow skincare routines with products selected by experts to give you glowing, healthy skin every day.",
      ctaText: "Explore Routines",
      ctaHref: "/products",
      imageSrc: "https://images.unsplash.com/photo-1556228578-0d85b1a4d571?auto=format&fit=crop&w=600&q=80",
      imageAlign: "left",
    },
    Renderer: RoutineBanner,
    Editor: RoutineEditor,
  },
  NewArrivalsSection: {
    type: "NewArrivalsSection",
    label: "New Arrivals",
    category: "Commerce",
    defaultProps: {
      title: "Just Dropped",
      subtitle: "NEW ARRIVALS",
      ctaHref: "/products?sort=newest",
    },
    Renderer: NewArrivalsSection,
    Editor: NewArrivalsEditor,
  },
};

export const availableSections = Object.values(sectionRegistry);

export function createSection(type: string): BuilderSection {
  const definition = sectionRegistry[type];
  if (!definition) {
    throw new Error(`Unknown section type: ${type}`);
  }

  const id = `${type.replace(/([a-z])([A-Z])/g, "$1_$2").toLowerCase()}_${crypto.randomUUID()}`;

  return {
    id,
    type,
    props: { ...definition.defaultProps },
  };
}

export function resolveSectionProps(section: BuilderSection, context: SectionRenderContext) {
  const definition = sectionRegistry[section.type];
  if (!definition) return null;

  const props = section.props || {};
  return definition.resolveProps ? definition.resolveProps(props, context) : props;
}
