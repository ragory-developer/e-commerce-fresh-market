"use client";
import { API_URL } from "@/lib/config";

import Link from "next/link";
import { useCartStore } from "@/store/cartStore";
import { ShoppingCart } from "lucide-react";
import { motion } from "framer-motion";
import { useState } from "react";
import { getActivePrice } from "@/lib/utils";
import { useSettingsStore } from "@/store/settingsStore";

const BACKEND_URL = API_URL;

const PLACEHOLDER = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='400' viewBox='0 0 400 400'%3E%3Crect width='400' height='400' fill='%23f0fdf4'/%3E%3Crect x='140' y='120' width='120' height='100' rx='8' fill='%23e2e8f0'/%3E%3Ccircle cx='200' cy='158' r='22' fill='%23cbd5e1'/%3E%3Cpolygon points='140,220 175,168 205,195 230,172 260,220' fill='%23cbd5e1'/%3E%3Ctext x='200' y='265' font-family='sans-serif' font-size='18' fill='%2394a3b8' text-anchor='middle'%3ENo Image%3C/text%3E%3C/svg%3E";

function getImageSrc(product: any): string {
  if (product.image) {
    return product.image.startsWith("http")
      ? product.image
      : `${BACKEND_URL}${product.image}`;
  }
  return PLACEHOLDER;
}

function getPriceInfo(product: any): {
  displayPrice: string;
  originalPrice: string | null;
  discountPercent: number;
  isRange: boolean;
} {
  const now = new Date();

  // Variable product: show price range from variants
  if (product.productType === "VARIABLE" && product.variants?.length > 0) {
    const enabledVariants = product.variants.filter((v: any) => v.enabled !== false);
    if (enabledVariants.length > 0) {
      const effectivePrices = enabledVariants.map((v: any) => {
        const spStart = v.specialPriceStart ? new Date(v.specialPriceStart) : null;
        const spEnd = v.specialPriceEnd ? new Date(v.specialPriceEnd) : null;
        const spActive =
          v.specialPrice != null &&
          (spStart == null || spStart <= now) &&
          (spEnd == null || spEnd >= now);
        return spActive ? v.specialPrice : v.price;
      });
      const min = Math.min(...effectivePrices);
      const max = Math.max(...effectivePrices);
      if (min === max) {
        return { displayPrice: `৳${min.toFixed(2)}`, originalPrice: null, discountPercent: 0, isRange: false };
      }
      return { displayPrice: `৳${min.toFixed(2)} – ৳${max.toFixed(2)}`, originalPrice: null, discountPercent: 0, isRange: true };
    }
  }

  // Simple product with special price
  const spStart = product.specialPriceStart ? new Date(product.specialPriceStart) : null;
  const spEnd = product.specialPriceEnd ? new Date(product.specialPriceEnd) : null;
  const spActive =
    product.specialPrice != null &&
    (spStart == null || spStart <= now) &&
    (spEnd == null || spEnd >= now);

  if (spActive) {
    const discount = Math.round(((product.price - product.specialPrice) / product.price) * 100);
    return {
      displayPrice: `৳${product.specialPrice.toFixed(2)}`,
      originalPrice: `৳${product.price.toFixed(2)}`,
      discountPercent: discount,
      isRange: false,
    };
  }

  return {
    displayPrice: `৳${product.price.toFixed(2)}`,
    originalPrice: null,
    discountPercent: 0,
    isRange: false,
  };
}

function isNewProduct(product: any): boolean {
  if (!product.createdAt) return false;
  const created = new Date(product.createdAt);
  const diffDays = (Date.now() - created.getTime()) / (1000 * 60 * 60 * 24);
  return diffDays <= 14;
}

export default function ProductCard({ 
  product, 
  prefetch = true 
}: { 
  product: any, 
  prefetch?: boolean 
}) {
  const addToCart = useCartStore((state) => state.addToCart);
  const [added, setAdded] = useState(false);
  const [imgError, setImgError] = useState(false);

  const imageSrc = imgError ? PLACEHOLDER : getImageSrc(product);
  const { displayPrice, originalPrice, discountPercent, isRange } = getPriceInfo(product);
  const showNewBadge = isNewProduct(product);
  const { settings } = useSettingsStore();
  const productUrl = settings.permalink_structure === "product" 
    ? `/product/${product.slug}` 
    : `/${product.slug}`;

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    addToCart({
      id: product.id,
      name: product.name,
      price: getActivePrice(product),
      slug: product.slug,
      image: imageSrc,
      quantity: 1,
    });
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.94, y: 40 }}
      whileInView={{ 
        opacity: 1, 
        scale: 1, 
        y: 0,
      }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ 
        type: "spring",
        stiffness: 100,
        damping: 15,
        mass: 1,
        duration: 0.8
      }}
      className="group"
    >
      <div className="bg-white dark:bg-gray-900 rounded-3xl border border-gray-100 dark:border-gray-800 shadow-sm hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 overflow-hidden flex flex-col h-full relative">
        {/* Subtitle shimmer/glass effect on hover */}
        <div className="absolute inset-0 bg-gradient-to-tr from-emerald-500/0 via-emerald-500/0 to-emerald-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />

        {/* Image area */}
        <Link 
          href={productUrl} 
          prefetch={prefetch}
          className="relative block bg-gray-50 dark:bg-gray-800 overflow-hidden"
        >
          
          {/* Top-left badges */}
          <div className="absolute top-2 left-2 z-10 flex flex-col gap-1">
            {showNewBadge && (
              <span className="bg-emerald-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full leading-tight shadow">
                NEW
              </span>
            )}
            {discountPercent > 0 && (
              <span className="bg-rose-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full leading-tight shadow">
                -{discountPercent}%
              </span>
            )}
          </div>

          {/* Add to Cart icon — top-right, visible on hover (SIMPLE products only) */}
          {product.productType !== "VARIABLE" && (
            <button
              type="button"
              onClick={handleAddToCart}
              title="Add to Cart"
              className={`absolute top-2 right-2 z-10 w-8 h-8 rounded-full flex items-center justify-center shadow-md transition-all duration-200 active:scale-90
                ${added
                  ? "bg-emerald-500 text-white opacity-100"
                  : "bg-white dark:bg-gray-700 text-gray-600 dark:text-gray-200 opacity-0 group-hover:opacity-100 hover:bg-emerald-500 hover:text-white"
                }`}
            >
              <ShoppingCart size={14} />
            </button>
          )}

          {/* Product image */}
          <div className="aspect-square w-full overflow-hidden">
            <img
              src={imageSrc}
              alt={product.name}
              onError={() => setImgError(true)}
              loading="lazy"
              className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-500 p-4"
            />
          </div>
        </Link>

        {/* Body */}
        <div className="flex flex-col flex-1 p-3 gap-1.5">

          {/* Category */}
          {product.categories?.[0]?.name || product.category?.name ? (
            <span className="text-[11px] text-emerald-600 font-semibold uppercase tracking-wide truncate">
              {product.categories?.[0]?.name ?? product.category?.name}
            </span>
          ) : null}

          {/* Name */}
          <Link href={productUrl} prefetch={prefetch}>
            <h3 className="text-sm font-semibold text-gray-800 dark:text-gray-100 line-clamp-2 leading-snug hover:text-emerald-600 transition-colors min-h-[2.5rem]">
              {product.name}
            </h3>
          </Link>

          {/* Spacer */}
          <div className="flex-1" />

          {/* Price */}
          <div className="flex items-center gap-2 flex-wrap mt-1">
            <span className={`font-extrabold text-emerald-600 dark:text-emerald-400 ${isRange ? "text-sm" : "text-base"}`}>
              {displayPrice}
            </span>
            {originalPrice && (
              <span className="text-xs text-rose-400 line-through">
                {originalPrice}
              </span>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
