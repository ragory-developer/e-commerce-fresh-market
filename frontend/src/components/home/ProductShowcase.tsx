"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import useEmblaCarousel from "embla-carousel-react";
import ProductCard from "@/components/ui/ProductCard";
import CategoryPills from "./CategoryPills";
import SectionWrapper from "./SectionWrapper";

interface ProductShowcaseProps {
  title?: string;
  subtitle?: string;
  products: any[];
  showCategoryFilter?: boolean;
  textAlign?: "left" | "center" | "right";
  
  // Custom chrome props
  cols?: number;
  gap?: "sm" | "md" | "lg";
  cardVariant?: "classic" | "sleek" | "minimal" | "festive";
  cardRadius?: "none" | "sm" | "md" | "lg" | "xl" | "2xl" | "3xl" | "full";
  showBadge?: boolean;
  showRating?: boolean;
  showAddToCart?: boolean;
  badgeStyle?: "pill" | "corner" | "ribbon";
  layoutType?: "grid" | "carousel";
  
  builderClassName?: string;
  builderStyle?: React.CSSProperties;
}

export default function ProductShowcase({
  title = "Shop by Category",
  subtitle = "Browse our curated collection of premium products",
  products = [],
  showCategoryFilter = true,
  textAlign = "left",
  
  cols = 5,
  gap = "md",
  cardVariant = "classic",
  cardRadius = "3xl",
  showBadge = true,
  showRating = true,
  showAddToCart = true,
  badgeStyle = "pill",
  layoutType = "grid",
  builderClassName,
  builderStyle,
}: ProductShowcaseProps) {
  const [activeCategory, setActiveCategory] = useState("All");

  const [emblaRef] = useEmblaCarousel({
    align: "start",
    containScroll: "trimSnaps",
    dragFree: true,
  });

  const filteredProducts = activeCategory === "All"
    ? products
    : products.filter((product) => {
        const productCategory = product.categories?.[0]?.name ?? product.category?.name;
        return productCategory?.toLowerCase() === activeCategory.toLowerCase();
      });

  // Gap Size Mappings
  const gapClasses = {
    sm: "gap-3 lg:gap-4",
    md: "gap-4 lg:gap-6",
    lg: "gap-6 lg:gap-8",
  };
  const gapClass = gapClasses[gap] || "gap-4 lg:gap-6";

  // Grid Columns Mappings
  const gridColsClass: Record<number, string> = {
    3: "grid-cols-2 md:grid-cols-3 lg:grid-cols-3",
    4: "grid-cols-2 md:grid-cols-3 lg:grid-cols-4",
    5: "grid-cols-2 md:grid-cols-3 lg:grid-cols-5",
    6: "grid-cols-2 md:grid-cols-4 lg:grid-cols-6",
  };
  const colsClass = gridColsClass[cols] || "grid-cols-2 md:grid-cols-3 lg:grid-cols-5";

  // Carousel Slide Width Mappings
  const slideWidths: Record<number, string> = {
    3: "lg:flex-[0_0_calc(33.333%-1rem)]",
    4: "lg:flex-[0_0_calc(25%-1rem)]",
    5: "lg:flex-[0_0_calc(20%-1rem)]",
    6: "lg:flex-[0_0_calc(16.666%-1rem)]",
  };
  const slideWidthClass = slideWidths[cols] || "lg:flex-[0_0_calc(20%-1rem)]";

  const hasProducts = filteredProducts && filteredProducts.length > 0;

  return (
    <SectionWrapper
      title={title}
      subtitle={subtitle}
      headerAction={
        <Link
          href="/products"
          className="text-emerald-500 font-bold hover:underline flex items-center gap-1"
        >
          View All <ArrowRight size={16} />
        </Link>
      }
      bgWhite
      textAlign={textAlign}
      builderClassName={builderClassName}
      builderStyle={builderStyle}
    >
      {/* Category Filter */}
      {showCategoryFilter && (
        <div className="mb-8">
          <CategoryPills
            activeCategory={activeCategory}
            onCategoryChange={setActiveCategory}
          />
        </div>
      )}

      {/* Dynamic Content */}
      {!hasProducts ? (
        <div className="text-center py-16 text-gray-400 dark:text-gray-500 font-medium">
          No products found matching the criteria.
        </div>
      ) : layoutType === "carousel" ? (
        <div className="overflow-hidden cursor-grab active:cursor-grabbing" ref={emblaRef}>
          <div className={`flex ${gapClass}`}>
            {filteredProducts.map((product) => (
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
          {filteredProducts.map((product) => (
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
    </SectionWrapper>
  );
}
