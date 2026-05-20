"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Flame, ArrowRight } from "lucide-react";
import useEmblaCarousel from "embla-carousel-react";
import ProductCard from "@/components/ui/ProductCard";

interface HotDealsSectionProps {
  title?: string;
  subtitle?: string;
  products?: any[];
  
  // Custom query/chrome props
  cols?: number;
  gap?: "sm" | "md" | "lg";
  cardVariant?: "classic" | "sleek" | "minimal";
  cardRadius?: "none" | "sm" | "md" | "lg" | "xl" | "2xl" | "3xl" | "full";
  showBadge?: boolean;
  showRating?: boolean;
  showAddToCart?: boolean;
  badgeStyle?: "pill" | "corner" | "ribbon";
  layoutType?: "grid" | "carousel";
}

export default function HotDealsSection({
  title = "Hot Deals",
  subtitle = "Grab them before they're gone!",
  products = [],
  
  cols = 4,
  gap = "md",
  cardVariant = "classic",
  cardRadius = "2xl",
  showBadge = true,
  showRating = true,
  showAddToCart = true,
  badgeStyle = "pill",
  layoutType = "grid",
}: HotDealsSectionProps) {
  const [emblaRef] = useEmblaCarousel({
    align: "start",
    containScroll: "trimSnaps",
    dragFree: true,
  });

  // Gap size mappings
  const gapClasses = {
    sm: "gap-3 lg:gap-4",
    md: "gap-4 lg:gap-6",
    lg: "gap-6 lg:gap-8",
  };
  const gapClass = gapClasses[gap] || "gap-4 lg:gap-6";

  // Grid columns mappings
  const gridColsClass: Record<number, string> = {
    3: "grid-cols-2 md:grid-cols-3 lg:grid-cols-3",
    4: "grid-cols-2 md:grid-cols-3 lg:grid-cols-4",
    5: "grid-cols-2 md:grid-cols-3 lg:grid-cols-5",
    6: "grid-cols-2 md:grid-cols-4 lg:grid-cols-6",
  };
  const colsClass = gridColsClass[cols] || "grid-cols-2 md:grid-cols-3 lg:grid-cols-4";

  // Carousel Slide Width Mappings
  const slideWidths: Record<number, string> = {
    3: "lg:flex-[0_0_calc(33.333%-1rem)]",
    4: "lg:flex-[0_0_calc(25%-1rem)]",
    5: "lg:flex-[0_0_calc(20%-1rem)]",
    6: "lg:flex-[0_0_calc(16.666%-1rem)]",
  };
  const slideWidthClass = slideWidths[cols] || "lg:flex-[0_0_calc(25%-1rem)]";

  const hasProducts = products && products.length > 0;

  return (
    <section className="py-12 lg:py-20 bg-gradient-to-b from-white to-gray-50 dark:from-gray-950 dark:to-gray-900">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10">
          <motion.div
            initial={false}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <div className="flex items-center gap-2 mb-2">
              <Flame size={24} className="text-red-500 animate-pulse" />
              <h2 className="text-3xl lg:text-4xl font-black text-gray-900 dark:text-white">
                {title}
              </h2>
            </div>
            <p className="text-gray-500 dark:text-gray-400 text-lg">
              {subtitle}
            </p>
          </motion.div>
          <Link
            href="/products?sort=discount"
            className="inline-flex items-center gap-2 text-red-500 hover:text-red-600 font-bold transition-colors"
          >
            All Deals <ArrowRight size={18} />
          </Link>
        </div>

        {/* Dynamic Content */}
        {!hasProducts ? (
          <div className="text-center py-16 text-gray-400 dark:text-gray-500 font-medium">
            No active deals found.
          </div>
        ) : layoutType === "carousel" ? (
          <div className="overflow-hidden cursor-grab active:cursor-grabbing" ref={emblaRef}>
            <div className={`flex ${gapClass}`}>
              {products.map((product) => (
                <div
                  key={product.id}
                  className={`flex-[0_0_calc(50%-0.5rem)] md:flex-[0_0_calc(33.333%-0.75rem)] ${slideWidthClass} min-w-0 h-auto`}
                >
                  <ProductCard
                    product={product}
                    variant={cardVariant}
                    radius={cardRadius}
                    showBadge={showBadge}
                    showRating={showRating}
                    showAddToCart={showAddToCart}
                    badgeStyle={badgeStyle}
                  />
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className={`grid ${colsClass} ${gapClass}`}>
            {products.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                variant={cardVariant}
                radius={cardRadius}
                showBadge={showBadge}
                showRating={showRating}
                showAddToCart={showAddToCart}
                badgeStyle={badgeStyle}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
