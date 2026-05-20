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

import {
  EidHeroBanner,
  PujaHeroBanner,
  RamadanHeroBanner,
  BoishakhHeroBanner,
  BlackFridayHeroBanner,
  ChristmasHeroBanner,
} from "@/components/home/HeroBannerVariants";

import {
  EidSpecialOffersBanner,
  PujaSpecialOffersBanner,
  RamadanSpecialOffersBanner,
  BoishakhSpecialOffersBanner,
  BlackFridaySpecialOffersBanner,
  ChristmasSpecialOffersBanner,
} from "@/components/home/SpecialOffersBannerVariants";

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
  const sourceType = (props.sourceType as string) || "all";
  const limit = props.limit != null ? Number(props.limit) : 10;
  const sort = (props.sort as string) || "default";

  // 1. Filtering
  let filtered: any[] = [...allProducts];

  if (sourceType === "category") {
    const categoryId = props.showcaseCategoryId || props.categoryId;
    if (categoryId && categoryId !== "all") {
      filtered = filtered.filter((item) => {
        const product = item as ProductLike;
        return product.categoryId === categoryId
          || product.category?.id === categoryId
          || product.categories?.some((category) => category.id === categoryId);
      });
    }
  } else if (sourceType === "featured") {
    filtered = filtered.filter((item: any) => item.featured === true || item.isFeatured === true);
  } else if (sourceType === "sale") {
    filtered = filtered.filter((item: any) => {
      const now = new Date();
      if (item.productType === "VARIABLE" && item.variants?.length > 0) {
        return item.variants.some((v: any) => {
          if (v.enabled === false) return false;
          const spStart = v.specialPriceStart ? new Date(v.specialPriceStart) : null;
          const spEnd = v.specialPriceEnd ? new Date(v.specialPriceEnd) : null;
          return v.specialPrice != null &&
            (spStart == null || spStart <= now) &&
            (spEnd == null || spEnd >= now);
        });
      }
      const spStart = item.specialPriceStart ? new Date(item.specialPriceStart) : null;
      const spEnd = item.specialPriceEnd ? new Date(item.specialPriceEnd) : null;
      return item.specialPrice != null &&
        (spStart == null || spStart <= now) &&
        (spEnd == null || spEnd >= now);
    });
  } else if (sourceType === "manual") {
    let targetIds: string[] = [];
    if (typeof props.manualProductIds === "string") {
      targetIds = props.manualProductIds.split(",").map(id => id.trim()).filter(Boolean);
    } else if (Array.isArray(props.manualProductIds)) {
      targetIds = props.manualProductIds.map(id => String(id).trim()).filter(Boolean);
    }
    filtered = filtered.filter((item: any) => 
      targetIds.includes(String(item.id)) || 
      targetIds.includes(String(item._id)) || 
      targetIds.includes(String(item.slug))
    );
  }

  // 2. Sorting
  const now = new Date();
  const getActivePriceLocal = (item: any): number => {
    if (!item) return 0;
    const price = item.price || 0;
    const specialPrice = item.specialPrice;
    const start = item.specialPriceStart ? new Date(item.specialPriceStart) : null;
    const end = item.specialPriceEnd ? new Date(item.specialPriceEnd) : null;
    const isActive = specialPrice !== undefined && specialPrice !== null && (start === null || start <= now) && (end === null || end >= now);
    return isActive ? specialPrice : price;
  };

  const getResolvedPrice = (product: any): number => {
    if (product.productType === "VARIABLE" && product.variants?.length > 0) {
      const enabledVariants = product.variants.filter((v: any) => v.enabled !== false);
      if (enabledVariants.length > 0) {
        const activePrices = enabledVariants.map((v: any) => getActivePriceLocal(v));
        return Math.min(...activePrices);
      }
    }
    return getActivePriceLocal(product);
  };

  const getProductDiscountPercent = (product: any): number => {
    if (product.productType === "VARIABLE" && product.variants?.length > 0) {
      const enabledVariants = product.variants.filter((v: any) => v.enabled !== false);
      const discounts = enabledVariants.map((v: any) => {
        const price = v.price || 0;
        const activePrice = getActivePriceLocal(v);
        if (price > 0 && activePrice < price) {
          return Math.round(((price - activePrice) / price) * 100);
        }
        return 0;
      });
      return Math.max(...discounts, 0);
    }
    const price = product.price || 0;
    const activePrice = getActivePriceLocal(product);
    if (price > 0 && activePrice < price) {
      return Math.round(((price - activePrice) / price) * 100);
    }
    return 0;
  };

  if (sort === "price-asc") {
    filtered.sort((a, b) => getResolvedPrice(a) - getResolvedPrice(b));
  } else if (sort === "price-desc") {
    filtered.sort((a, b) => getResolvedPrice(b) - getResolvedPrice(a));
  } else if (sort === "newest") {
    filtered.sort((a, b) => {
      const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
      const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
      return dateB - dateA;
    });
  } else if (sort === "rating") {
    filtered.sort((a, b) => {
      const rA = a.averageRating != null ? Number(a.averageRating) : 0;
      const rB = b.averageRating != null ? Number(b.averageRating) : 0;
      return rB - rA;
    });
  } else if (sort === "discount") {
    filtered.sort((a, b) => getProductDiscountPercent(b) - getProductDiscountPercent(a));
  }

  // 3. Limit
  const products = filtered.slice(0, limit);

  return { ...props, products };
};

export const sectionRegistry: Record<string, SectionDefinition> = {
  HeroBanner: {
    type: "HeroBanner",
    label: "Hero Banner",
    category: "Hero",
    contentKind: "static",
    defaultVariant: "default",
    variants: {
      default: {
        label: "Default",
        defaultProps: {
          title: "Discover Natural Beauty",
          subtitle: "Premium skincare for your daily routine",
          badgeText: "New Collection 2026",
          description: "Discover our premium collection of beauty & skincare essentials curated just for you.",
          offerText: "Up to 40% OFF",
          offerSubtext: "Limited Time",
          ctaText: "Shop Now",
          ctaHref: "/products",
          imageSrc: "https://images.unsplash.com/photo-1596462502278-27bfdc403348?auto=format&fit=crop&w=800&q=80",
          textAlign: "left",
        },
        Renderer: HeroBanner,
      },
      eid: {
        label: "Eid Celebration",
        defaultProps: {
          title: "Celebrate Eid with Natural Glow",
          subtitle: "Festive premium skincare essentials",
          badgeText: "Eid Special Collection",
          description: "Look your absolute best this Eid with our exclusive organic skincare bundles.",
          offerText: "Flat 50% OFF",
          offerSubtext: "Eid Mubarak Offer",
          ctaText: "Explore Eid Collection",
          ctaHref: "/products?offer=eid",
          imageSrc: "https://images.unsplash.com/photo-1596462502278-27bfdc403348?auto=format&fit=crop&w=800&q=80",
          textAlign: "left",
        },
        Renderer: EidHeroBanner,
      },
      puja: {
        label: "Durga Puja Festive",
        defaultProps: {
          title: "Sharodiyo Sharoj Festive Glow",
          subtitle: "Vibrant ayurvedic skincare sets",
          badgeText: "Puja Dhamaka",
          description: "Welcome the festive season with radiant skin. Pure herbal ingredients for a premium feel.",
          offerText: "Buy 1 Get 1 Free",
          offerSubtext: "Durga Puja Special",
          ctaText: "Shop Puja Specials",
          ctaHref: "/products?offer=puja",
          imageSrc: "https://images.unsplash.com/photo-1596462502278-27bfdc403348?auto=format&fit=crop&w=800&q=80",
          textAlign: "left",
        },
        Renderer: PujaHeroBanner,
      },
      ramadan: {
        label: "Ramadan Blessings",
        defaultProps: {
          title: "Pure & Organic Skincare for Ramadan",
          subtitle: "Nourish and hydrate your skin",
          badgeText: "Ramadan Mubarak",
          description: "Keep your skin hydrated and glowing during the fasting season with our gentle natural cleansers and oils.",
          offerText: "Save up to 45%",
          offerSubtext: "Ramadan Special Deals",
          ctaText: "Shop Ramadan Essentials",
          ctaHref: "/products?offer=ramadan",
          imageSrc: "https://images.unsplash.com/photo-1596462502278-27bfdc403348?auto=format&fit=crop&w=800&q=80",
          textAlign: "left",
        },
        Renderer: RamadanHeroBanner,
      },
      boishakh: {
        label: "Pohela Boishakh",
        defaultProps: {
          title: "Boishakhi Mela Freshness",
          subtitle: "Traditional seasonal wellness collections",
          badgeText: "Shubho Noboborsho",
          description: "Celebrate the Bengali New Year with traditional herbal extracts and pure, organic beauty formulas.",
          offerText: "Flat 35% OFF",
          offerSubtext: "Halkhata Special",
          ctaText: "Shop Boishakhi Offers",
          ctaHref: "/products?offer=boishakh",
          imageSrc: "https://images.unsplash.com/photo-1596462502278-27bfdc403348?auto=format&fit=crop&w=800&q=80",
          textAlign: "left",
        },
        Renderer: BoishakhHeroBanner,
      },
      blackfriday: {
        label: "Black Friday",
        defaultProps: {
          title: "Black Friday Midnight Drop",
          subtitle: "Deepest discounts of the year",
          badgeText: "Mega Deals Live",
          description: "Unbeatable price cuts on luxury skincare and makeup combos. Limited quantity, act fast!",
          offerText: "Up to 70% OFF",
          offerSubtext: "Limited Stock",
          ctaText: "Unlock DoorBusters",
          ctaHref: "/products?offer=blackfriday",
          imageSrc: "https://images.unsplash.com/photo-1596462502278-27bfdc403348?auto=format&fit=crop&w=800&q=80",
          textAlign: "left",
        },
        Renderer: BlackFridayHeroBanner,
      },
      christmas: {
        label: "Christmas Festive",
        defaultProps: {
          title: "Merry Christmas Holiday Glow",
          subtitle: "Cozy winter hydration sets",
          badgeText: "Season of Giving",
          description: "Treat yourself or your loved ones with perfect winter gift packs, warm vanilla extracts and butter creams.",
          offerText: "Free Holiday Gift Box",
          offerSubtext: "With orders over ৳1,500",
          ctaText: "Explore Christmas Gifts",
          ctaHref: "/products?offer=christmas",
          imageSrc: "https://images.unsplash.com/photo-1596462502278-27bfdc403348?auto=format&fit=crop&w=800&q=80",
          textAlign: "left",
        },
        Renderer: ChristmasHeroBanner,
      },
    },
    Editor: HeroBannerEditor,
  },
  SpecialOffersBanner: {
    type: "SpecialOffersBanner",
    label: "Special Offers",
    category: "Marketing",
    contentKind: "static",
    defaultVariant: "default",
    variants: {
      default: {
        label: "Default",
        defaultProps: {
          title: "Special Offers",
          subtitle: "Get the best deals on premium beauty products",
          ctaText: "Shop Now",
          ctaHref: "/products?sort=discount",
          bgColor: "from-blue-600 via-blue-700 to-indigo-800",
          leftImageSrc: "https://images.unsplash.com/photo-1556228578-0d85b1a4d571?auto=format&fit=crop&w=400&q=80",
          rightImageSrc: "https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?auto=format&fit=crop&w=400&q=80",
          textAlign: "left",
        },
        Renderer: SpecialOffersBanner,
      },
      eid: {
        label: "Eid Celebration",
        defaultProps: {
          title: "Eid Mubarak Special Offer",
          subtitle: "Enjoy special festival discounts on organic and natural products.",
          ctaText: "Shop Eid Collection",
          ctaHref: "/products",
        },
        Renderer: EidSpecialOffersBanner,
      },
      puja: {
        label: "Durga Puja Celebration",
        defaultProps: {
          title: "Happy Durga Puja Special Offer",
          subtitle: "Celebrate the festival of colors and joy with our organic selections and daily deals.",
          ctaText: "Shop Festive Specials",
          ctaHref: "/products",
        },
        Renderer: PujaSpecialOffersBanner,
      },
      ramadan: {
        label: "Ramadan Mubarak",
        defaultProps: {
          title: "Ramadan Mubarak Special Deals",
          subtitle: "Get healthy diet items, organic dates, and natural energy products for Iftar & Sahri.",
          ctaText: "Shop Ramadan Essentials",
          ctaHref: "/products",
        },
        Renderer: RamadanSpecialOffersBanner,
      },
      boishakh: {
        label: "Pohela Boishakh",
        defaultProps: {
          title: "Boishakh Special Festive Deals",
          subtitle: "Welcome the Bengali New Year with traditional items, herbal foods, and fresh seasonal collections.",
          ctaText: "Shop Utsab Offers",
          ctaHref: "/products",
        },
        Renderer: BoishakhSpecialOffersBanner,
      },
      blackfriday: {
        label: "Black Friday",
        defaultProps: {
          title: "Black Friday Mega Clearance",
          subtitle: "Prices sliced like never before. Exclusive midnight drops and flash sales starting right now!",
          ctaText: "Unlock Midnight Deals",
          ctaHref: "/products",
        },
        Renderer: BlackFridaySpecialOffersBanner,
      },
      christmas: {
        label: "Christmas Special",
        defaultProps: {
          title: "Merry Christmas & Happy New Year Offers",
          subtitle: "Explore winter gift hampers, special body treats, and cozy beauty routines with warm festive scents.",
          ctaText: "Browse Christmas Guide",
          ctaHref: "/products",
        },
        Renderer: ChristmasSpecialOffersBanner,
      },
    },
    Editor: SpecialOffersEditor,
  },
  ProductShowcase: {
    type: "ProductShowcase",
    label: "Product Grid",
    category: "Commerce",
    contentKind: "hybrid",
    defaultVariant: "default",
    variants: {
      default: {
        label: "Default",
        defaultProps: {
          title: "Shop by Category",
          subtitle: "Browse our curated collection of premium products",
          showcaseCategoryId: "all",
          textAlign: "left",
          sourceType: "all",
          limit: 10,
          sort: "default",
          cols: 5,
          gap: "md",
          cardVariant: "classic",
          cardRadius: "3xl",
          showBadge: true,
          showRating: true,
          showAddToCart: true,
          badgeStyle: "pill",
          layoutType: "grid",
        },
        Renderer: ProductShowcase as unknown as ComponentType<Record<string, unknown>>,
      },
    },
    Editor: ProductShowcaseEditor,
    resolveProps: productResolver,
  },
  PromoBadgeGrid: {
    type: "PromoBadgeGrid",
    label: "Promo Features",
    category: "Marketing",
    contentKind: "static",
    defaultVariant: "default",
    variants: {
      default: {
        label: "Default",
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
      },
      eid: {
        label: "Eid Celebration",
        defaultProps: {
          badges: [
            {
              title: "Eid Gifts",
              subtitle: "For Loved Ones",
              iconName: "Gift",
              bgColor: "from-emerald-500 to-teal-750",
              href: "/products?offer=eid-gifts",
            },
            {
              title: "Festive Feasts",
              subtitle: "Organic Honey & Dates",
              iconName: "Star",
              bgColor: "from-teal-500 to-cyan-700",
              href: "/products?offer=eid-feast",
            },
            {
              title: "Attire & Beauty",
              subtitle: "Premium Skincare",
              iconName: "Sparkles",
              bgColor: "from-emerald-600 to-green-800",
              href: "/products?offer=eid-beauty",
            },
            {
              title: "Mega Discounts",
              subtitle: "Up to 50% OFF",
              iconName: "ShoppingBag",
              bgColor: "from-emerald-750 to-teal-900",
              href: "/products?offer=eid-mega",
            },
          ]
        },
        Renderer: PromoBadgeGrid,
      },
      puja: {
        label: "Durga Puja Festive",
        defaultProps: {
          badges: [
            {
              title: "Puja Anjali",
              subtitle: "Traditional Items",
              iconName: "Flame",
              bgColor: "from-red-500 to-rose-700",
              href: "/products?offer=puja-anjali",
            },
            {
              title: "Festival Glow",
              subtitle: "Natural Skincare",
              iconName: "Sparkles",
              bgColor: "from-rose-500 to-orange-700",
              href: "/products?offer=puja-glow",
            },
            {
              title: "Utsab Gifts",
              subtitle: "Combo Packs",
              iconName: "Gift",
              bgColor: "from-orange-500 to-amber-700",
              href: "/products?offer=puja-gifts",
            },
            {
              title: "Dhamaka Offers",
              subtitle: "Flat 45% OFF",
              iconName: "Percent",
              bgColor: "from-red-600 to-orange-800",
              href: "/products?offer=puja-dhamaka",
            },
          ]
        },
        Renderer: PromoBadgeGrid,
      },
      ramadan: {
        label: "Ramadan Blessings",
        defaultProps: {
          badges: [
            {
              title: "Iftar Essentials",
              subtitle: "Dates & Honey",
              iconName: "Moon",
              bgColor: "from-slate-900 to-indigo-900",
              href: "/products?offer=iftar",
            },
            {
              title: "Sahri Energy",
              subtitle: "Healthy Nutrients",
              iconName: "Sun",
              bgColor: "from-indigo-950 to-indigo-800",
              href: "/products?offer=sahri",
            },
            {
              title: "Natural Wellness",
              subtitle: "Herbal Products",
              iconName: "Heart",
              bgColor: "from-slate-950 to-amber-900",
              href: "/products?offer=ramadan-wellness",
            },
            {
              title: "Sadaqah Bundles",
              subtitle: "Charity Packs",
              iconName: "HandHeart",
              bgColor: "from-slate-900 to-emerald-950",
              href: "/products?offer=charity",
            },
          ]
        },
        Renderer: PromoBadgeGrid,
      },
      boishakh: {
        label: "Pohela Boishakh",
        defaultProps: {
          badges: [
            {
              title: "Boishakhi Mela",
              subtitle: "Traditional Spices",
              iconName: "Sun",
              bgColor: "from-red-500 to-orange-600",
              href: "/products?offer=mela",
            },
            {
              title: "Summer Coolers",
              subtitle: "Organic Juices",
              iconName: "CupSoda",
              bgColor: "from-orange-500 to-yellow-600",
              href: "/products?offer=coolers",
            },
            {
              title: "Herbal Detox",
              subtitle: "Pure Aloe Vera",
              iconName: "Leaf",
              bgColor: "from-red-650 to-orange-700",
              href: "/products?offer=herbal",
            },
            {
              title: "Halkhata Deals",
              subtitle: "Flat 35% OFF",
              iconName: "Sparkles",
              bgColor: "from-orange-600 to-yellow-700",
              href: "/products?offer=halkhata",
            },
          ]
        },
        Renderer: PromoBadgeGrid,
      },
      blackfriday: {
        label: "Black Friday",
        defaultProps: {
          badges: [
            {
              title: "Flash Sale",
              subtitle: "Hourly Drops",
              iconName: "Zap",
              bgColor: "from-gray-900 to-black",
              href: "/products?offer=flash",
            },
            {
              title: "Mega Deals",
              subtitle: "Flat 70% OFF",
              iconName: "Trophy",
              bgColor: "from-yellow-500 to-amber-600",
              href: "/products?offer=mega",
            },
            {
              title: "VIP Early Access",
              subtitle: "Limited Stock",
              iconName: "ShoppingCart",
              bgColor: "from-gray-850 to-gray-950",
              href: "/products?offer=vip",
            },
            {
              title: "Hot Items",
              subtitle: "Best Sellers",
              iconName: "Flame",
              bgColor: "from-yellow-600 to-amber-700",
              href: "/products?offer=hot",
            },
          ]
        },
        Renderer: PromoBadgeGrid,
      },
      christmas: {
        label: "Christmas Festive",
        defaultProps: {
          badges: [
            {
              title: "Winter Care",
              subtitle: "Deep Moisture",
              iconName: "Snowflake",
              bgColor: "from-blue-700 to-teal-850",
              href: "/products?offer=winter-care",
            },
            {
              title: "Holiday Gifts",
              subtitle: "Hampers & Sets",
              iconName: "TreePine",
              bgColor: "from-red-700 to-red-900",
              href: "/products?offer=holiday-gifts",
            },
            {
              title: "Festive Treats",
              subtitle: "Organic Cocoa & Nuts",
              iconName: "Cookie",
              bgColor: "from-green-700 to-green-900",
              href: "/products?offer=treats",
            },
            {
              title: "Santa's Box",
              subtitle: "Mystery Gift Free",
              iconName: "Gift",
              bgColor: "from-red-600 to-green-800",
              href: "/products?offer=santa",
            },
          ]
        },
        Renderer: PromoBadgeGrid,
      },
    },
    Editor: PromoBadgeGridEditor,
  },
  TestimonialSection: {
    type: "TestimonialSection",
    label: "Testimonials",
    category: "Content",
    contentKind: "static",
    defaultVariant: "default",
    variants: {
      default: {
        label: "Default",
        defaultProps: {
          title: "Real Results, Real Beauty",
          subtitle: "See what our customers are saying",
          textAlign: "center",
          themeVariant: "default",
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
      },
      eid: {
        label: "Eid Celebration",
        defaultProps: {
          title: "Eid Special Reviews",
          subtitle: "Genuine feedback from our happy Eid customers",
          textAlign: "center",
          themeVariant: "eid",
          testimonials: [
            {
              name: "Tasnim Ahmed",
              avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80",
              rating: 5,
              review: "The premium attar and organic glow kit made my Eid special! Absolute bliss.",
              product: "Royal Eid Grooming Kit",
            },
            {
              name: "Farhan Kabir",
              avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80",
              rating: 5,
              review: "Purchased the herbal hair combo for Eid. Amazing quality, completely natural and soothing fragrance.",
              product: "Organic Herbal Care Set",
            },
          ]
        },
        Renderer: TestimonialSection,
      },
      puja: {
        label: "Durga Puja Festive",
        defaultProps: {
          title: "Festive Puja Glow Stories",
          subtitle: "What our community says about their puja radiance kits",
          textAlign: "center",
          themeVariant: "puja",
          testimonials: [
            {
              name: "Priya Roy",
              avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80",
              rating: 5,
              review: "The kumkumadi oil is pure magic! My Puja look was complete with that perfect traditional glow.",
              product: "Ayurvedic Kumkumadi Oil",
            },
          ]
        },
        Renderer: TestimonialSection,
      },
      ramadan: {
        label: "Ramadan Blessings",
        defaultProps: {
          title: "Nourishment & Wellness Stories",
          subtitle: "How our pure honey, organic dates, and mild skincare helped our family during fasting",
          textAlign: "center",
          themeVariant: "ramadan",
          testimonials: [
            {
              name: "Mariam Khan",
              avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=150&q=80",
              rating: 5,
              review: "The organic dates and raw sidr honey kept us active and refreshed during Sahri and Iftar. Incredible purity!",
              product: "Raw Organic Sidr Honey",
            },
          ]
        },
        Renderer: TestimonialSection,
      },
      boishakh: {
        label: "Pohela Boishakh",
        defaultProps: {
          title: "Boishakhi Utsab Reviews",
          subtitle: "Warm feedback from our Noboborsho shoppers",
          textAlign: "center",
          themeVariant: "boishakh",
          testimonials: [
            {
              name: "Anika Bose",
              avatar: "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?auto=format&fit=crop&w=150&q=80",
              rating: 5,
              review: "Loving the cooling organic aloe gel for this hot summer Noboborsho. Absolute lifesaver!",
              product: "Pure Aloe Vera Refreshing Gel",
            },
          ]
        },
        Renderer: TestimonialSection,
      },
      blackfriday: {
        label: "Black Friday",
        defaultProps: {
          title: "DoorBuster Deal Reviews",
          subtitle: "Hear from the smart shoppers who scored early midnight steals",
          textAlign: "center",
          themeVariant: "blackfriday",
          testimonials: [
            {
              name: "Jessica Miller",
              avatar: "https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?auto=format&fit=crop&w=150&q=80",
              rating: 5,
              review: "Got this at 70% off during midnight flash. Best deal ever! Skincare range is premium quality.",
              product: "Pro-Collagen Hydration Set",
            },
          ]
        },
        Renderer: TestimonialSection,
      },
      christmas: {
        label: "Christmas Festive",
        defaultProps: {
          title: "Holiday Gift Reviews",
          subtitle: "Warm reviews of our winter hydration bundles and cozy seasonal scent boxes",
          textAlign: "center",
          themeVariant: "christmas",
          testimonials: [
            {
              name: "David Smith",
              avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&q=80",
              rating: 5,
              review: "Gifted the cocoa butter gift pack to my sister. She loved the cozy vanilla scent and rich moisturizing texture.",
              product: "Winter Rich Cocoa Butter Box",
            },
          ]
        },
        Renderer: TestimonialSection,
      },
    },
    Editor: TestimonialEditor,
  },
  HotDealsSection: {
    type: "HotDealsSection",
    label: "Hot Deals",
    category: "Commerce",
    contentKind: "hybrid",
    defaultVariant: "default",
    variants: {
      default: {
        label: "Default",
        defaultProps: {
          title: "Hot Deals",
          subtitle: "Grab them before they're gone!",
          sourceType: "sale",
          limit: 4,
          sort: "discount",
          cols: 4,
          gap: "md",
          cardVariant: "classic",
          cardRadius: "2xl",
          showBadge: true,
          showRating: true,
          showAddToCart: true,
          badgeStyle: "pill",
          layoutType: "grid",
        },
        Renderer: HotDealsSection as unknown as ComponentType<Record<string, unknown>>,
      },
    },
    Editor: HotDealsEditor,
    resolveProps: productResolver,
  },
  ConsultationBanner: {
    type: "ConsultationBanner",
    label: "Consultation",
    category: "Marketing",
    contentKind: "static",
    defaultVariant: "default",
    variants: {
      default: {
        label: "Default",
        defaultProps: {
          title: "Doctor's Skincare Consultation",
          subtitle: "Get personalized skincare advice from certified dermatologists",
          badgeText: "Expert Advice",
          features: [
            "Personalized skin analysis",
            "Custom routine recommendations",
            "Expert product matching",
          ],
          ctaText: "Book Now",
          ctaHref: "/consultation",
          imageSrc: "https://images.unsplash.com/photo-1559599101-f09722fb4948?auto=format&fit=crop&w=800&q=80",
          imageAlign: "right",
          themeVariant: "default",
        },
        Renderer: ConsultationBanner,
      },
      eid: {
        label: "Eid Celebration",
        defaultProps: {
          title: "Eid Special Skincare Consultation",
          subtitle: "Get personalized festive tips and skincare routines from certified dermatologists",
          badgeText: "Eid Glow Advice",
          features: [
            "Festive skincare glow tips",
            "Custom Eid routine recommendations",
            "Organic halal-friendly products",
          ],
          ctaText: "Book Eid Session",
          ctaHref: "/consultation",
          imageSrc: "https://images.unsplash.com/photo-1559599101-f09722fb4948?auto=format&fit=crop&w=800&q=80",
          imageAlign: "right",
          themeVariant: "eid",
        },
        Renderer: ConsultationBanner,
      },
      puja: {
        label: "Durga Puja Festive",
        defaultProps: {
          title: "Puja Radiance Consultation",
          subtitle: "Get personalized ayurvedic skincare advice from traditional dermatologists",
          badgeText: "Utsab Glow Advice",
          features: [
            "Traditional glow skin analysis",
            "Ayurvedic skincare routine tips",
            "Pure herbal product recommendations",
          ],
          ctaText: "Book Puja Session",
          ctaHref: "/consultation",
          imageSrc: "https://images.unsplash.com/photo-1559599101-f09722fb4948?auto=format&fit=crop&w=800&q=80",
          imageAlign: "right",
          themeVariant: "puja",
        },
        Renderer: ConsultationBanner,
      },
      ramadan: {
        label: "Ramadan Blessings",
        defaultProps: {
          title: "Ramadan Skincare & Hydration Advice",
          subtitle: "Keep your skin hydrated and glowing while fasting with expert dermatologist advice",
          badgeText: "Ramadan Fasting Tips",
          features: [
            "Dehydration barrier analysis",
            "Sahri & Iftar hydration tips",
            "Extremely gentle cleanser matches",
          ],
          ctaText: "Get Free Fasting Guide",
          ctaHref: "/consultation",
          imageSrc: "https://images.unsplash.com/photo-1559599101-f09722fb4948?auto=format&fit=crop&w=800&q=80",
          imageAlign: "right",
          themeVariant: "ramadan",
        },
        Renderer: ConsultationBanner,
      },
      boishakh: {
        label: "Pohela Boishakh",
        defaultProps: {
          title: "Boishakhi Mela Heat Protection Advice",
          subtitle: "Prevent sunburns and oil control under the summer sun with dermatologist consultation",
          badgeText: "Summer Care Tips",
          features: [
            "Sunburn and oily skin analysis",
            "Traditional summer cooling routine",
            "Natural mineral sunscreen matching",
          ],
          ctaText: "Book Summer Session",
          ctaHref: "/consultation",
          imageSrc: "https://images.unsplash.com/photo-1559599101-f09722fb4948?auto=format&fit=crop&w=800&q=80",
          imageAlign: "right",
          themeVariant: "boishakh",
        },
        Renderer: ConsultationBanner,
      },
      blackfriday: {
        label: "Black Friday",
        defaultProps: {
          title: "Black Friday Flash Glow Consultation",
          subtitle: "Get immediate dry skin barrier checkups and glow tips before midnight sale drops",
          badgeText: "VIP Speed Advice",
          features: [
            "Hourly routine speed analysis",
            "Instant glow booster advice",
            "Mega deal product bundle matching",
          ],
          ctaText: "Get VIP Consultation",
          ctaHref: "/consultation",
          imageSrc: "https://images.unsplash.com/photo-1559599101-f09722fb4948?auto=format&fit=crop&w=800&q=80",
          imageAlign: "right",
          themeVariant: "blackfriday",
        },
        Renderer: ConsultationBanner,
      },
      christmas: {
        label: "Christmas Festive",
        defaultProps: {
          title: "Christmas Cozy Winter Care Consultation",
          subtitle: "Protect your dry skin from freezing cold winds with rich moisturizer guidance",
          badgeText: "Winter Hydration Advice",
          features: [
            "Winter moisture barrier checkup",
            "Rich deep butter hydration routine",
            "Warm vanilla scent product matching",
          ],
          ctaText: "Book Winter Session",
          ctaHref: "/consultation",
          imageSrc: "https://images.unsplash.com/photo-1559599101-f09722fb4948?auto=format&fit=crop&w=800&q=80",
          imageAlign: "right",
          themeVariant: "christmas",
        },
        Renderer: ConsultationBanner,
      },
    },
    Editor: ConsultationEditor,
  },
  RoutineBanner: {
    type: "RoutineBanner",
    label: "Routine",
    category: "Content",
    contentKind: "static",
    defaultVariant: "default",
    variants: {
      default: {
        label: "Default",
        defaultProps: {
          title: "Simplify Your Skincare Routine",
          subtitle: "Curated just for you",
          description: "Discover easy-to-follow skincare routines with products selected by experts to give you glowing, healthy skin every day.",
          ctaText: "Explore Routines",
          ctaHref: "/products",
          imageSrc: "https://images.unsplash.com/photo-1556228578-0d85b1a4d571?auto=format&fit=crop&w=600&q=80",
          imageAlign: "left",
          themeVariant: "default",
        },
        Renderer: RoutineBanner,
      },
      eid: {
        label: "Eid Celebration",
        defaultProps: {
          title: "Festive Eid Mubarak Skincare Routines",
          subtitle: "Eid Special Routine",
          description: "Get that sparkling Eid look with our quick and organic skin prep routines designed by our lead skin doctors.",
          ctaText: "Browse Eid Routines",
          ctaHref: "/products",
          imageSrc: "https://images.unsplash.com/photo-1556228578-0d85b1a4d571?auto=format&fit=crop&w=600&q=80",
          imageAlign: "left",
          themeVariant: "eid",
        },
        Renderer: RoutineBanner,
      },
      puja: {
        label: "Durga Puja Festive",
        defaultProps: {
          title: "Traditional Puja Radiance Routines",
          subtitle: "Puja Utsab Care",
          description: "Experience holistic beauty with special organic facial routines using raw traditional ingredients.",
          ctaText: "Explore Puja Routines",
          ctaHref: "/products",
          imageSrc: "https://images.unsplash.com/photo-1556228578-0d85b1a4d571?auto=format&fit=crop&w=600&q=80",
          imageAlign: "left",
          themeVariant: "puja",
        },
        Renderer: RoutineBanner,
      },
      ramadan: {
        label: "Ramadan Blessings",
        defaultProps: {
          title: "Ramadan Deep Moisture Lock Routines",
          subtitle: "Fasting Skincare Guide",
          description: "Prevent dry skin and dullness while fasting with our easy-to-follow moisture locking skincare routines.",
          ctaText: "Explore Fasting Routines",
          ctaHref: "/products",
          imageSrc: "https://images.unsplash.com/photo-1556228578-0d85b1a4d571?auto=format&fit=crop&w=600&q=80",
          imageAlign: "left",
          themeVariant: "ramadan",
        },
        Renderer: RoutineBanner,
      },
      boishakh: {
        label: "Pohela Boishakh",
        defaultProps: {
          title: "Boishakhi Mela Sun Shield Routines",
          subtitle: "Traditional Summer Care",
          description: "Protect your skin from the summer heat and dust with custom organic cooling routines.",
          ctaText: "Browse Cooling Routines",
          ctaHref: "/products",
          imageSrc: "https://images.unsplash.com/photo-1556228578-0d85b1a4d571?auto=format&fit=crop&w=600&q=80",
          imageAlign: "left",
          themeVariant: "boishakh",
        },
        Renderer: RoutineBanner,
      },
      blackfriday: {
        label: "Black Friday",
        defaultProps: {
          title: "Midnight Flash Glow Recovery Routines",
          subtitle: "Rapid Skin Restore",
          description: "Fast-acting routines for busy shoppers to instantly brighten and repair skin overnight.",
          ctaText: "Shop Recovery Routines",
          ctaHref: "/products",
          imageSrc: "https://images.unsplash.com/photo-1556228578-0d85b1a4d571?auto=format&fit=crop&w=600&q=80",
          imageAlign: "left",
          themeVariant: "blackfriday",
        },
        Renderer: RoutineBanner,
      },
      christmas: {
        label: "Christmas Festive",
        defaultProps: {
          title: "Christmas Winter Deep Hydration Routines",
          subtitle: "Holiday Glow Guide",
          description: "Fight cold winter winds and dry air with our extra rich nourishing barrier repair routines.",
          ctaText: "Browse Holiday Routines",
          ctaHref: "/products",
          imageSrc: "https://images.unsplash.com/photo-1556228578-0d85b1a4d571?auto=format&fit=crop&w=600&q=80",
          imageAlign: "left",
          themeVariant: "christmas",
        },
        Renderer: RoutineBanner,
      },
    },
    Editor: RoutineEditor,
  },
  NewArrivalsSection: {
    type: "NewArrivalsSection",
    label: "New Arrivals",
    category: "Commerce",
    contentKind: "hybrid",
    defaultVariant: "default",
    variants: {
      default: {
        label: "Default",
        defaultProps: {
          title: "Just Dropped",
          subtitle: "NEW ARRIVALS",
          sourceType: "all",
          limit: 4,
          sort: "newest",
          cols: 4,
          gap: "md",
          cardVariant: "classic",
          cardRadius: "2xl",
          showBadge: true,
          showRating: true,
          showAddToCart: true,
          badgeStyle: "pill",
          layoutType: "grid",
          ctaHref: "/products?sort=newest",
        },
        Renderer: NewArrivalsSection as unknown as ComponentType<Record<string, unknown>>,
      },
    },
    Editor: NewArrivalsEditor,
    resolveProps: productResolver,
  },

  // Deprecated individual campaign banners kept for backward compatibility mapping
  EidSpecialBanner: {
    type: "EidSpecialBanner",
    label: "Eid Celebration Banner",
    category: "Marketing",
    contentKind: "static",
    defaultVariant: "eid",
    variants: {
      eid: {
        label: "Eid Celebration",
        defaultProps: {
          title: "Eid Mubarak Special Offer",
          subtitle: "Enjoy special festival discounts on organic and natural products.",
          ctaText: "Shop Eid Collection",
          ctaHref: "/products",
        },
        Renderer: EidSpecialOffersBanner,
      },
    },
    Editor: StaticSectionEditor as any,
    deprecated: true,
  },
  PujaSpecialBanner: {
    type: "PujaSpecialBanner",
    label: "Puja Festive Banner",
    category: "Marketing",
    contentKind: "static",
    defaultVariant: "puja",
    variants: {
      puja: {
        label: "Durga Puja Celebration",
        defaultProps: {
          title: "Happy Durga Puja Special Offer",
          subtitle: "Celebrate the festival of colors and joy with our organic selections and daily deals.",
          ctaText: "Shop Festive Specials",
          ctaHref: "/products",
        },
        Renderer: PujaSpecialOffersBanner,
      },
    },
    Editor: StaticSectionEditor as any,
    deprecated: true,
  },
  RamadanSpecialBanner: {
    type: "RamadanSpecialBanner",
    label: "Ramadan Banner",
    category: "Marketing",
    contentKind: "static",
    defaultVariant: "ramadan",
    variants: {
      ramadan: {
        label: "Ramadan Mubarak",
        defaultProps: {
          title: "Ramadan Mubarak Special Deals",
          subtitle: "Get healthy diet items, organic dates, and natural energy products for Iftar & Sahri.",
          ctaText: "Shop Ramadan Essentials",
          ctaHref: "/products",
        },
        Renderer: RamadanSpecialOffersBanner,
      },
    },
    Editor: StaticSectionEditor as any,
    deprecated: true,
  },
  BoishakhSpecialBanner: {
    type: "BoishakhSpecialBanner",
    label: "Boishakhi Banner",
    category: "Marketing",
    contentKind: "static",
    defaultVariant: "boishakh",
    variants: {
      boishakh: {
        label: "Pohela Boishakh",
        defaultProps: {
          title: "Boishakh Special Festive Deals",
          subtitle: "Welcome the Bengali New Year with traditional items, herbal foods, and fresh seasonal collections.",
          ctaText: "Shop Utsab Offers",
          ctaHref: "/products",
        },
        Renderer: BoishakhSpecialOffersBanner,
      },
    },
    Editor: StaticSectionEditor as any,
    deprecated: true,
  },
  BlackFridaySpecialBanner: {
    type: "BlackFridaySpecialBanner",
    label: "Black Friday Banner",
    category: "Marketing",
    contentKind: "static",
    defaultVariant: "blackfriday",
    variants: {
      blackfriday: {
        label: "Black Friday",
        defaultProps: {
          title: "Black Friday Mega Clearance",
          subtitle: "Prices sliced like never before. Exclusive midnight drops and flash sales starting right now!",
          ctaText: "Unlock Midnight Deals",
          ctaHref: "/products",
        },
        Renderer: BlackFridaySpecialOffersBanner,
      },
    },
    Editor: StaticSectionEditor as any,
    deprecated: true,
  },
  ChristmasSpecialBanner: {
    type: "ChristmasSpecialBanner",
    label: "Christmas Festive Banner",
    category: "Marketing",
    contentKind: "static",
    defaultVariant: "christmas",
    variants: {
      christmas: {
        label: "Christmas Special",
        defaultProps: {
          title: "Merry Christmas & Happy New Year Offers",
          subtitle: "Explore winter gift hampers, special body treats, and cozy beauty routines with warm festive scents.",
          ctaText: "Browse Christmas Guide",
          ctaHref: "/products",
        },
        Renderer: ChristmasSpecialOffersBanner,
      },
    },
    Editor: StaticSectionEditor as any,
    deprecated: true,
  },
};

export const availableSections = Object.values(sectionRegistry).filter((def) => !def.deprecated);

export function createSection(type: string): BuilderSection {
  const definition = sectionRegistry[type];
  if (!definition) {
    throw new Error(`Unknown section type: ${type}`);
  }

  const id = `${type.replace(/([a-z])([A-Z])/g, "$1_$2").toLowerCase()}_${crypto.randomUUID()}`;
  const variantName = definition.defaultVariant;
  const variantDef = definition.variants[variantName];

  return {
    id,
    type,
    variant: variantName,
    props: { ...variantDef.defaultProps },
  };
}

export function resolveSectionProps(section: BuilderSection, context: SectionRenderContext) {
  const definition = sectionRegistry[section.type];
  if (!definition) return null;

  const variantName = section.variant || definition.defaultVariant;
  const variantDef = definition.variants[variantName] || definition.variants[definition.defaultVariant];
  const variantDefaultProps = variantDef?.defaultProps || {};

  const dbComponent = context.dbComponents?.find((c: any) => c.name === section.type);
  const dbDefaultProps = dbComponent?.defaultProps || {};

  const props = { ...variantDefaultProps, ...dbDefaultProps, ...section.props };
  return definition.resolveProps ? definition.resolveProps(props, context) : props;
}

export function migrateDeprecatedSections(sections: BuilderSection[]): { migrated: boolean; sections: BuilderSection[] } {
  let migrated = false;
  const campaignMap: Record<string, string> = {
    EidSpecialBanner: "eid",
    PujaSpecialBanner: "puja",
    RamadanSpecialBanner: "ramadan",
    BoishakhSpecialBanner: "boishakh",
    BlackFridaySpecialBanner: "blackfriday",
    ChristmasSpecialBanner: "christmas",
  };

  const newSections = sections.map((sec) => {
    if (campaignMap[sec.type]) {
      migrated = true;
      console.warn(`[Builder Deprecation] Migrating deprecated section type "${sec.type}" to "SpecialOffersBanner" with variant "${campaignMap[sec.type]}"`);
      return {
        ...sec,
        type: "SpecialOffersBanner",
        variant: campaignMap[sec.type],
      };
    }
    return sec;
  });

  return { migrated, sections: newSections };
}
