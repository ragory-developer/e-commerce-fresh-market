"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import ProductCard from "@/components/ui/ProductCard";
import CategoryPills from "./CategoryPills";
import SectionWrapper from "./SectionWrapper";

interface ProductShowcaseProps {
  title?: string;
  subtitle?: string;
  products: any[];
  showCategoryFilter?: boolean;
  textAlign?: "left" | "center" | "right";
}

export default function ProductShowcase({
  title = "Shop by Category",
  subtitle = "Browse our curated collection of premium products",
  products,
  showCategoryFilter = true,
  textAlign = "left",
}: ProductShowcaseProps) {
  const [activeCategory, setActiveCategory] = useState("All");

  // In a real app, filtering would be done via API; here we just show all products
  const displayProducts = products.slice(0, 10);

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

      {/* Product Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 lg:gap-6">
        {displayProducts.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </SectionWrapper>
  );
}
