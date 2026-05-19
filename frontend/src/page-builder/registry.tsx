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
import { eidRegistry } from "@/components/page-builder/campaigns/eid/registry";
import { pujaRegistry } from "@/components/page-builder/campaigns/puja/registry";
import { ramadanRegistry } from "@/components/page-builder/campaigns/ramadan/registry";
import { boishakhRegistry } from "@/components/page-builder/campaigns/boishakh/registry";
import { blackfridayRegistry } from "@/components/page-builder/campaigns/blackfriday/registry";
import { christmasRegistry } from "@/components/page-builder/campaigns/christmas/registry";
import {
  ConsultationEditor,
  HeroBannerEditor,
  NewArrivalsEditor,
  ProductShowcaseEditor,
  RoutineEditor,
  SpecialOffersEditor,
  StaticSectionEditor,
  TestimonialEditor,
  PromoBadgeGridEditor,
  HotDealsEditor,
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
    defaultProps: {
      badges: [
        {
          title: "Buy 1 Get 1",
          subtitle: "Free",
          iconName: "Gift",
          bgColor: "from-blue-500 to-blue-700",
          href: "/products?offer=bogo",
        },
        {
          title: "Stock",
          subtitle: "Clearance",
          iconName: "Package",
          bgColor: "from-emerald-500 to-teal-700",
          href: "/products?offer=clearance",
        },
        {
          title: "Combo",
          subtitle: "Sale",
          iconName: "Boxes",
          bgColor: "from-purple-500 to-indigo-700",
          href: "/products?offer=combo",
        },
        {
          title: "Makeup",
          subtitle: "Sale",
          iconName: "Sparkles",
          bgColor: "from-rose-500 to-pink-700",
          href: "/products?offer=makeup",
        },
      ]
    },
    Renderer: PromoBadgeGrid,
    Editor: PromoBadgeGridEditor,
  },
  TestimonialSection: {
    type: "TestimonialSection",
    label: "Testimonials",
    category: "Content",
    defaultProps: {
      title: "Real Results, Real Beauty",
      subtitle: "See what our customers are saying",
      textAlign: "center",
      testimonials: [
        {
          name: "Sarah Johnson",
          avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80",
          rating: 5,
          review: "Absolutely love the glow serum! My skin has never looked better. Saw visible results within just 2 weeks of daily use.",
          product: "Radiance Glow Serum",
        },
        {
          name: "Emily Chen",
          avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=150&q=80",
          rating: 5,
          review: "The moisturizer is so hydrating without being heavy. Perfect for my combination skin type. Highly recommend!",
          product: "Hydra Boost Moisturizer",
        },
        {
          name: "Aisha Rahman",
          avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80",
          rating: 4,
          review: "Great value for money. The vitamin C serum helped fade my dark spots significantly. Will repurchase for sure.",
          product: "Vitamin C Brightening Serum",
        },
        {
          name: "Lisa Park",
          avatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=150&q=80",
          rating: 5,
          review: "The sunscreen is lightweight and doesn't leave a white cast. Finally found my HG sunscreen! Perfect under makeup.",
          product: "Invisible Shield SPF 50",
        },
      ]
    },
    Renderer: TestimonialSection,
    Editor: TestimonialEditor,
  },
  HotDealsSection: {
    type: "HotDealsSection",
    label: "Hot Deals",
    category: "Commerce",
    defaultProps: {
      title: "Hot Deals",
      subtitle: "Grab them before they're gone!",
      deals: [
        {
          name: "Premium Face Wash Bundle",
          originalPrice: "৳1,800",
          salePrice: "৳999",
          discount: "45% OFF",
          image: "https://images.unsplash.com/photo-1556228578-0d85b1a4d571?auto=format&fit=crop&w=400&q=80",
          endsIn: "2d 14h",
        },
        {
          name: "Korean Skincare Set",
          originalPrice: "৳3,500",
          salePrice: "৳2,100",
          discount: "40% OFF",
          image: "https://images.unsplash.com/photo-1571781926291-c477ebfd024b?auto=format&fit=crop&w=400&q=80",
          endsIn: "1d 8h",
        },
        {
          name: "Anti-Aging Combo Pack",
          originalPrice: "৳4,200",
          salePrice: "৳2,520",
          discount: "40% OFF",
          image: "https://images.unsplash.com/photo-1596755389378-c31d21fd1273?auto=format&fit=crop&w=400&q=80",
          endsIn: "3d 5h",
        },
        {
          name: "SPF Protection Kit",
          originalPrice: "৳2,000",
          salePrice: "৳1,200",
          discount: "40% OFF",
          image: "https://images.unsplash.com/photo-1611930022073-b7a4ba5fcccd?auto=format&fit=crop&w=400&q=80",
          endsIn: "5h 30m",
        },
      ]
    },
    Renderer: HotDealsSection,
    Editor: HotDealsEditor,
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
  
  // Merge Campaign Component Packs
  ...eidRegistry,
  ...pujaRegistry,
  ...ramadanRegistry,
  ...boishakhRegistry,
  ...blackfridayRegistry,
  ...christmasRegistry,
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

  const dbComponent = context.dbComponents?.find((c: any) => c.name === section.type);
  const defaultProps = dbComponent?.defaultProps || definition.defaultProps || {};

  const props = { ...defaultProps, ...section.props };
  return definition.resolveProps ? definition.resolveProps(props, context) : props;
}
