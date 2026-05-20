"use client";
import { API_URL } from "@/lib/config";

import Link from "next/link";
import { useCartStore } from "@/store/cartStore";
import { ShoppingCart, Star, Eye } from "lucide-react";
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
  prefetch = true,
  variant = "classic",
  radius = "3xl",
  showBadge = true,
  showRating = true,
  showAddToCart = true,
  badgeStyle = "pill",
}: { 
  product: any;
  prefetch?: boolean;
  variant?: "classic" | "sleek" | "minimal" | "festive";
  radius?: "none" | "sm" | "md" | "lg" | "xl" | "2xl" | "3xl" | "full";
  showBadge?: boolean;
  showRating?: boolean;
  showAddToCart?: boolean;
  badgeStyle?: "pill" | "corner" | "ribbon";
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

  // Radius Class Mappings
  const radiusClasses = {
    none: "rounded-none",
    sm: "rounded-sm",
    md: "rounded-md",
    lg: "rounded-lg",
    xl: "rounded-xl",
    "2xl": "rounded-2xl",
    "3xl": "rounded-3xl",
    full: "rounded-[2rem]",
  };
  const cardRadiusClass = radiusClasses[radius] || "rounded-3xl";

  const imageRadiusClasses = {
    none: "rounded-none",
    sm: "rounded-t-sm",
    md: "rounded-t-md",
    lg: "rounded-t-lg",
    xl: "rounded-t-xl",
    "2xl": "rounded-t-2xl",
    "3xl": "rounded-t-3xl",
    full: "rounded-t-[2rem]",
  };
  const imageRadiusClass = imageRadiusClasses[radius] || "rounded-t-3xl";

  // Badges Renderer
  const renderBadges = () => {
    if (!showBadge) return null;
    if (badgeStyle === "ribbon") {
      const hasDiscount = discountPercent > 0;
      if (!hasDiscount && !showNewBadge) return null;
      return (
        <div className="absolute top-0 left-0 z-10 w-16 h-16 overflow-hidden pointer-events-none">
          <div className={`absolute top-[12px] left-[-22px] w-[80px] text-center text-white text-[8px] font-black uppercase py-0.5 leading-none shadow-sm -rotate-45 ${hasDiscount ? "bg-rose-500" : "bg-emerald-500"}`}>
            {hasDiscount ? `-${discountPercent}%` : "NEW"}
          </div>
        </div>
      );
    }
    if (badgeStyle === "corner") {
      return (
        <div className="absolute top-0 left-0 z-10 flex flex-col gap-0">
          {showNewBadge && (
            <span className="bg-emerald-500 text-white text-[9px] font-black px-2 py-1 uppercase leading-none rounded-br-md shadow-sm">
              NEW
            </span>
          )}
          {discountPercent > 0 && (
            <span className="bg-rose-500 text-white text-[9px] font-black px-2 py-1 uppercase leading-none rounded-br-md shadow-sm">
              -{discountPercent}%
            </span>
          )}
        </div>
      );
    }
    // Default: pill
    return (
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
    );
  };

  // Rating Stars Renderer
  const renderRatingStars = () => {
    if (!showRating) return null;
    const ratingValue = product.averageRating != null ? Number(product.averageRating) : 5.0;
    return (
      <div className="flex items-center gap-0.5 mt-0.5" title={`${ratingValue} out of 5 stars`}>
        {Array.from({ length: 5 }).map((_, i) => {
          const isFilled = i < Math.round(ratingValue);
          return (
            <Star
              key={i}
              size={12}
              className={isFilled ? "fill-amber-400 text-amber-400" : "text-gray-300 dark:text-gray-600"}
            />
          );
        })}
        <span className="text-[10px] text-gray-500 dark:text-gray-400 ml-1 font-semibold">
          {ratingValue.toFixed(1)}
        </span>
      </div>
    );
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
      className="group h-full"
    >
      <div className={`transition-all duration-500 overflow-hidden flex flex-col h-full relative ${cardRadiusClass} ${
        variant === "classic"
          ? "bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 shadow-sm hover:shadow-2xl hover:-translate-y-2"
          : variant === "sleek"
          ? "bg-gradient-to-b from-white/95 to-gray-50/95 dark:from-gray-900/95 dark:to-gray-950/95 shadow-md hover:shadow-2xl hover:-translate-y-1 hover:scale-[1.01] border-0"
          : variant === "festive"
          ? "bg-gradient-to-b from-amber-50/30 to-white dark:from-amber-950/10 dark:to-gray-900 border border-amber-250/50 dark:border-amber-900/30 shadow-md hover:shadow-[0_12px_30px_rgba(245,158,11,0.18)] hover:-translate-y-1.5 hover:border-amber-300 dark:hover:border-amber-700 hover:scale-[1.01]"
          : "bg-transparent border-0 shadow-none hover:opacity-95"
      }`}>
        {/* Shimmer/glass hover effect */}
        {variant !== "minimal" && (
          <div className={`absolute inset-0 bg-gradient-to-tr opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none ${
            variant === "festive"
              ? "from-amber-500/0 via-amber-500/0 to-amber-500/10"
              : "from-emerald-500/0 via-emerald-500/0 to-emerald-500/5"
          }`} />
        )}

        {/* Image area */}
        <Link 
          href={productUrl} 
          prefetch={prefetch}
          className={`relative block overflow-hidden ${
            variant === "classic" 
              ? `bg-gray-50 dark:bg-gray-800 ${imageRadiusClass}` 
              : variant === "festive"
              ? `bg-amber-50/20 dark:bg-amber-950/5 ${imageRadiusClass}`
              : "bg-transparent"
          }`}
        >
          {/* Render Badges */}
          {renderBadges()}

          {/* Add to Cart floating icon (Classic/Festive variant) */}
          {showAddToCart && (variant === "classic" || variant === "festive") && (
            <button
              type="button"
              onClick={(e) => {
                if (product.productType === "VARIABLE") {
                  // Let navigation bubble up and happen
                } else {
                  handleAddToCart(e);
                }
              }}
              title={product.productType === "VARIABLE" ? "Select Options" : "Add to Cart"}
              className={`absolute top-2 right-2 z-10 w-8 h-8 rounded-full flex items-center justify-center shadow-md transition-all duration-200 active:scale-90
                ${added
                  ? "bg-emerald-500 text-white opacity-100"
                  : product.productType === "VARIABLE"
                  ? "bg-white dark:bg-gray-700 text-amber-600 dark:text-amber-400 opacity-0 group-hover:opacity-100 hover:bg-amber-500 hover:text-white"
                  : variant === "festive"
                  ? "bg-white dark:bg-gray-700 text-amber-500 dark:text-amber-400 opacity-0 group-hover:opacity-100 hover:bg-amber-500 hover:text-white"
                  : "bg-white dark:bg-gray-700 text-gray-600 dark:text-gray-200 opacity-0 group-hover:opacity-100 hover:bg-emerald-500 hover:text-white"
                }`}
            >
              {product.productType === "VARIABLE" ? <Eye size={14} /> : <ShoppingCart size={14} />}
            </button>
          )}

          {/* Product image wrapper */}
          <div className={`aspect-square w-full overflow-hidden ${variant === "minimal" ? "bg-gray-50 dark:bg-gray-800 rounded-2xl" : ""}`}>
            <img
              src={imageSrc}
              alt={product.name}
              onError={() => setImgError(true)}
              loading="lazy"
              className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-500 p-4"
            />
          </div>
        </Link>

        {/* Body content */}
        <div className={`flex flex-col flex-1 gap-1.5 ${variant === "minimal" ? "pt-3 px-1 pb-1" : "p-3"}`}>
          {/* Category */}
          {(product.categories?.[0]?.name || product.category?.name) && (
            <span className={`text-[11px] font-semibold uppercase tracking-wide truncate ${
              variant === "festive" ? "text-amber-600 dark:text-amber-400" : "text-emerald-600"
            }`}>
              {product.categories?.[0]?.name ?? product.category?.name}
            </span>
          )}

          {/* Name */}
          <Link href={productUrl} prefetch={prefetch}>
            <h3 className="text-sm font-semibold text-gray-800 dark:text-gray-100 line-clamp-2 leading-snug hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors min-h-[2.5rem]">
              {product.name}
            </h3>
          </Link>

          {/* Rating */}
          {renderRatingStars()}

          {/* Spacer */}
          <div className="flex-1" />

          {/* Price */}
          <div className="flex items-center gap-2 flex-wrap mt-1">
            <span className={`font-extrabold ${
              variant === "festive" 
                ? "text-amber-600 dark:text-amber-400" 
                : "text-emerald-600 dark:text-emerald-400"
            } ${isRange ? "text-sm" : "text-base"}`}>
              {displayPrice}
            </span>
            {originalPrice && (
              <span className="text-xs text-rose-400 line-through">
                {originalPrice}
              </span>
            )}
          </div>

          {/* Sleek Variant Add to Cart Button */}
          {variant === "sleek" && showAddToCart && (
            <button
              type="button"
              onClick={(e) => {
                if (product.productType === "VARIABLE") {
                  // Let navigation happen
                } else {
                  handleAddToCart(e);
                }
              }}
              className={`w-full py-2 px-3 rounded-xl flex items-center justify-center gap-2 text-xs font-bold transition-all mt-2 active:scale-95
                ${added
                  ? "bg-emerald-500 text-white"
                  : product.productType === "VARIABLE"
                  ? "bg-amber-50 dark:bg-amber-950/30 text-amber-700 dark:text-amber-400 hover:bg-amber-500 hover:text-white"
                  : "bg-emerald-50 dark:bg-emerald-950/30 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-500 hover:text-white"
                }`}
            >
              {product.productType === "VARIABLE" ? (
                <>
                  <Eye size={13} /> Select Options
                </>
              ) : (
                <>
                  <ShoppingCart size={13} /> {added ? "Added!" : "Add to Cart"}
                </>
              )}
            </button>
          )}

          {/* Minimal Variant Add to Cart Button */}
          {variant === "minimal" && showAddToCart && (
            <button
              type="button"
              onClick={(e) => {
                if (product.productType === "VARIABLE") {
                  // Let navigation happen
                } else {
                  handleAddToCart(e);
                }
              }}
              className={`w-full py-1.5 text-xs font-bold text-center border border-gray-100 dark:border-gray-800 rounded-lg hover:border-emerald-500 hover:text-emerald-500 transition-colors mt-2 active:scale-95
                ${added
                  ? "text-emerald-500 border-emerald-500 bg-emerald-50/30 dark:bg-emerald-950/10"
                  : product.productType === "VARIABLE"
                  ? "text-amber-600 dark:text-amber-400 hover:border-amber-500 hover:text-amber-500"
                  : "text-gray-500 dark:text-gray-400"
                }`}
            >
              {product.productType === "VARIABLE" ? "Select Options" : added ? "✓ Added" : "+ Add to Cart"}
            </button>
          )}

          {/* Festive Variant Add to Cart Button */}
          {variant === "festive" && showAddToCart && (
            <button
              type="button"
              onClick={(e) => {
                if (product.productType === "VARIABLE") {
                  // Let navigation happen
                } else {
                  handleAddToCart(e);
                }
              }}
              className={`w-full py-2 px-3 rounded-xl flex items-center justify-center gap-2 text-xs font-bold transition-all mt-2 active:scale-95 shadow-sm
                ${added
                  ? "bg-emerald-500 text-white"
                  : product.productType === "VARIABLE"
                  ? "bg-amber-50 dark:bg-amber-950/30 text-amber-700 dark:text-amber-400 hover:bg-amber-500 hover:text-white"
                  : "bg-amber-500 hover:bg-amber-600 text-white shadow-amber-500/10"
                }`}
            >
              {product.productType === "VARIABLE" ? (
                <>
                  <Eye size={13} /> Select Options
                </>
              ) : (
                <>
                  <ShoppingCart size={13} /> {added ? "Added!" : "Add to Cart"}
                </>
              )}
            </button>
          )}
        </div>
      </div>
    </motion.div>
  );
}
