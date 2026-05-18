"use client";
import { API_URL } from "@/lib/config";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Star, Truck, ShieldCheck, Check, Zap, ChevronDown } from "lucide-react";
import { motion } from "framer-motion";
import AddToCartButton from "@/components/ui/AddToCartButton";

const FlashSaleBanner = ({ endTime, stock }: { endTime: string, stock: number }) => {
  const [timeLeft, setTimeLeft] = useState<{days: number, hours: number, min: number, sec: number} | null>(null);

  useEffect(() => {
    const calculateTimeLeft = () => {
      const target = new Date(endTime).getTime();
      const now = new Date().getTime();
      const diff = target - now;

      if (diff <= 0) {
        return null;
      }

      return {
        days: Math.floor(diff / (1000 * 60 * 60 * 24)),
        hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
        min: Math.floor((diff / 1000 / 60) % 60),
        sec: Math.floor((diff / 1000) % 60)
      };
    };

    // Initial calculation
    setTimeLeft(calculateTimeLeft());

    const timer = setInterval(() => {
      const updated = calculateTimeLeft();
      if (!updated) {
        clearInterval(timer);
      }
      setTimeLeft(updated);
    }, 1000);

    return () => clearInterval(timer);
  }, [endTime]);

  if (!timeLeft) return null;

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ 
        opacity: 1, 
        y: 0,
        backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
      }}
      transition={{
        backgroundPosition: {
          duration: 12,
          repeat: Infinity,
          ease: "linear"
        },
        opacity: { duration: 0.5 },
        y: { duration: 0.5 }
      }}
      style={{
        backgroundSize: "200% 200%",
        backgroundImage: "linear-gradient(to right, #ec4899, #ef4444, #8b5cf6, #6366f1, #ec4899)"
      }}
      className="w-full rounded-2xl p-5 mb-8 text-white overflow-hidden relative shadow-xl border border-white/10"
    >
       <div className="absolute top-0 right-0 w-48 h-48 bg-white/10 rounded-full -mr-24 -mt-24 blur-3xl animate-pulse"></div>
       <div className="absolute bottom-0 left-0 w-32 h-32 bg-yellow-400/10 rounded-full -ml-16 -mb-16 blur-2xl"></div>
       
       <div className="flex flex-col sm:flex-row justify-between items-center gap-6 relative z-10 font-sans">
          <div className="flex items-center gap-4">
             <div className="bg-yellow-400 p-3 rounded-xl text-black shadow-lg animate-bounce">
                <Zap size={24} fill="currentColor" />
             </div>
             <div>
                <h3 className="text-2xl sm:text-3xl font-black italic tracking-tighter uppercase leading-none drop-shadow-md">FLASH SALE</h3>
                <p className="text-sm font-bold opacity-90 mt-1 flex items-center gap-2">
                   Only <span className="text-yellow-300 underline decoration-2">{stock || 10}</span> left at this price!
                </p>
             </div>
          </div>
          
          <div className="flex gap-3">
             {[
               { label: 'DAYS', value: timeLeft.days },
               { label: 'HOURS', value: timeLeft.hours },
               { label: 'MIN', value: timeLeft.min },
               { label: 'SEC', value: timeLeft.sec }
             ].map((unit, i) => (
                <div key={i} className="flex flex-col items-center">
                   <div className="bg-white text-indigo-900 w-12 sm:w-14 h-12 sm:h-14 rounded-xl flex items-center justify-center font-black text-xl sm:text-2xl shadow-lg ring-4 ring-black/5">
                      {unit.value.toString().padStart(2, '0')}
                   </div>
                   <span className="text-[10px] font-black mt-2 opacity-90 uppercase tracking-[0.2em] drop-shadow-sm">{unit.label}</span>
                </div>
             ))}
          </div>
       </div>
    </motion.div>
  );
};

export default function ProductOverview({ product }: { product: any }) {
  const { name, description, shortDescription, price, specialPrice, specialPriceStart, specialPriceEnd, stock, unit, weight, category: singleCategory, categories, productType, priceRange, variants, brand, averageRating, ratingCount } = product;
  const category = singleCategory || categories?.[0];

  // Find default variant if it's a variable product
  // (Note: user requested it to be null by default to show price range)
  const [selectedVariant, setSelectedVariant] = useState<any>(null);
  const [activeGalleryImage, setActiveGalleryImage] = useState<string | null>(null);
  const [isExpanded, setIsExpanded] = useState(false);
  const [imgError, setImgError] = useState(false);

  // Clear active gallery image when a new variant is selected
  useEffect(() => {
    setActiveGalleryImage(null);
    setImgError(false);
  }, [selectedVariant]);

  // Special price logic with date check
  const now = new Date();
  
  // Helper to check if special price is active
  const isSpecialActive = (sp: number | null, start: any, end: any) => {
    if (sp === null || sp === undefined || sp === 0) return false;
    
    const startDate = start ? new Date(start) : null;
    const endDate = end ? new Date(end) : null;
    
    const isStarted = !startDate || startDate <= now;
    // Add a 1-hour buffer to the end date to be safe
    const isNotEnded = !endDate || new Date(endDate.getTime() + 3600000) >= now;
    
    return isStarted && isNotEnded;
  };

  const hasSpecialPrice = selectedVariant 
    ? isSpecialActive(selectedVariant.specialPrice, selectedVariant.specialPriceStart, selectedVariant.specialPriceEnd)
    : isSpecialActive(specialPrice, specialPriceStart, specialPriceEnd);

  const currentPrice = selectedVariant 
    ? (hasSpecialPrice ? selectedVariant.specialPrice : selectedVariant.price)
    : (hasSpecialPrice ? specialPrice : (price || 0));

  const originalPrice = selectedVariant ? (selectedVariant.price || price || 0) : (price || 0);

  const flashSaleEndTime = selectedVariant?.specialPriceEnd || specialPriceEnd;
  const isActiveFlashSale = hasSpecialPrice && flashSaleEndTime;

  // Image Fallback Logic
  const placeholderImg = `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" viewBox="0 0 100 100"><rect width="100" height="100" fill="%23f3f4f6"/><text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" font-family="sans-serif" font-size="10" fill="%239ca3af">No Image</text></svg>`;
  
  const getImageSrc = (url: string) => {
    if (!url) return placeholderImg;
    if (url.startsWith('http')) return url;
    return `${API_URL}${url}`;
  };

  const displayImage = imgError ? placeholderImg : (activeGalleryImage || (selectedVariant && selectedVariant.image ? selectedVariant.image : product.image));
  
  // Ensure we have a flat array of unique image URLs
  const rawImages = Array.isArray(product.images) ? product.images : [];
  const allImages = [product.image, ...rawImages].filter(Boolean);
  const uniqueImages = Array.from(new Set(allImages.map(img => img.trim())));

  const renderPrice = () => {
    if (selectedVariant) {
      if (hasSpecialPrice) {
        return (
          <div className="flex flex-col sm:flex-row sm:items-end gap-3">
            <span className="text-4xl sm:text-5xl font-extrabold text-gray-900 dark:text-white tracking-tight">৳{currentPrice.toFixed(2)}</span>
            <div className="flex items-center gap-3 mb-1.5 sm:ml-1">
               <span className="text-xl sm:text-2xl text-gray-400 line-through font-medium">৳{originalPrice.toFixed(2)}</span>
               <span className="bg-rose-100 text-rose-600 px-3 py-1 rounded-full text-xs sm:text-sm font-bold shadow-sm whitespace-nowrap">
                  Save ৳{(originalPrice - currentPrice).toFixed(2)}
               </span>
            </div>
          </div>
        );
      }
      return <span className="text-4xl sm:text-5xl font-extrabold text-gray-900 dark:text-white tracking-tight">৳{currentPrice.toFixed(2)}</span>;
    }

    if (productType === "VARIABLE" && priceRange) {
      return (
        <span className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-gray-900 dark:text-white tracking-tight">
          ৳{priceRange.min.toFixed(2)} – ৳{priceRange.max.toFixed(2)}
        </span>
      );
    }

    if (hasSpecialPrice) {
      return (
        <div className="flex flex-col sm:flex-row sm:items-end gap-3">
          <span className="text-4xl sm:text-5xl font-extrabold text-gray-900 dark:text-white tracking-tight">৳{currentPrice.toFixed(2)}</span>
          <div className="flex items-center gap-3 mb-1.5 sm:ml-1">
             <span className="text-xl sm:text-2xl text-gray-400 line-through font-medium">৳{originalPrice.toFixed(2)}</span>
             <span className="bg-rose-100 text-rose-600 px-3 py-1 rounded-full text-xs sm:text-sm font-bold shadow-sm whitespace-nowrap">
                Save ৳{(originalPrice - currentPrice).toFixed(2)}
             </span>
          </div>
        </div>
      );
    }

    return <span className="text-4xl sm:text-5xl font-extrabold text-gray-900 dark:text-white tracking-tight">৳{(price || 0).toFixed(2)}</span>;
  };

  const enabledVariants = variants?.filter((v: any) => v.enabled) || [];

  return (
    <div className="flex flex-col lg:flex-row gap-8 xl:gap-20 max-w-full">
      
      {/* Images Section */}
      <div className="w-full lg:w-1/2 flex flex-col">
        <div className="aspect-square w-full bg-gray-50 dark:bg-gray-900 rounded-[1.5rem] sm:rounded-[2.5rem] overflow-hidden relative shadow-inner group">
          <img 
            src={getImageSrc(displayImage)} 
            alt={name}
            onError={() => setImgError(true)}
            fetchPriority="high"
            decoding="async"
            className="absolute inset-0 w-full h-full object-contain p-4 sm:p-10 transition-all duration-500 group-hover:scale-105"
          />
          <div className="absolute top-4 left-4 sm:top-8 sm:left-8 z-10 flex flex-col gap-2">
            {hasSpecialPrice && (
              <div className="bg-rose-500 text-white font-black px-3 py-1 sm:px-5 sm:py-2 rounded-xl sm:rounded-2xl shadow-xl transform -rotate-3 uppercase tracking-wider text-[10px] sm:text-sm">
                Flash Deal
              </div>
            )}
            {/* NEW Badge Logic matching ProductCard */}
            {(() => {
              const created = new Date(product.createdAt);
              const diffDays = (Date.now() - created.getTime()) / (1000 * 60 * 60 * 24);
              if (diffDays <= 14) {
                return (
                  <div className="bg-emerald-500 text-white font-black px-3 py-1 sm:px-4 sm:py-1.5 rounded-xl shadow-lg uppercase tracking-wider text-[10px] sm:text-xs w-fit">
                    NEW
                  </div>
                );
              }
              return null;
            })()}
            {hasSpecialPrice && originalPrice > 0 && (
              <div className="bg-amber-500 text-white font-black px-3 py-1 sm:px-4 sm:py-1.5 rounded-xl shadow-lg uppercase tracking-wider text-[10px] sm:text-xs w-fit">
                -{Math.round(((originalPrice - currentPrice) / originalPrice) * 100)}% OFF
              </div>
            )}
          </div>
        </div>

        {/* Gallery Thumbnails */}
        {uniqueImages.length > 1 && (
          <div className="flex gap-4 mt-6 sm:mt-8 overflow-x-auto pb-4 scrollbar-hide snap-x px-1">
            {uniqueImages.map((imgUrl: any, idx: number) => {
              const isActive = (activeGalleryImage || (selectedVariant && selectedVariant.image ? selectedVariant.image : product.image)) === imgUrl;
              return (
                <button 
                  key={idx}
                  onClick={() => {
                     setActiveGalleryImage(imgUrl);
                     setImgError(false);
                  }}
                  className={`relative w-20 h-20 sm:w-24 sm:h-24 rounded-xl sm:rounded-2xl overflow-hidden shrink-0 border-2 transition-all snap-start ${
                    isActive 
                      ? 'border-indigo-500 ring-4 ring-indigo-500/20 bg-indigo-50 dark:bg-indigo-900/20 shadow-md' 
                      : 'border-gray-200 dark:border-gray-800 hover:border-indigo-300 dark:hover:border-indigo-700 bg-white dark:bg-gray-900 hover:shadow-sm'
                  }`}
                >
                  <img 
                    src={getImageSrc(imgUrl)} 
                    alt={`${name} gallery ${idx + 1}`} 
                    loading="lazy"
                    className="w-full h-full object-contain p-1 sm:p-2" 
                  />
                </button>
              );
            })}
          </div>
        )}
      </div>
      
      {/* Product Details Section */}
      <div className="w-full lg:w-1/2 flex flex-col justify-start">
        <div className="flex flex-wrap items-center gap-3 mb-6">
          {category && (
             <Link href={`/categories/${category.slug}`} className="bg-indigo-50 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 px-3 py-1 rounded-lg text-xs font-black uppercase tracking-widest hover:bg-indigo-100 dark:hover:bg-indigo-900/50 transition-all border border-indigo-100 dark:border-indigo-900/20">
               {category.name}
             </Link>
          )}
          {brand && (
            <Link href={`/brands/${brand.slug}`} className="bg-gray-50 dark:bg-gray-800 text-gray-700 dark:text-gray-300 px-3 py-1 rounded-lg text-xs font-black uppercase tracking-widest hover:bg-gray-100 dark:hover:bg-gray-700 transition-all border border-gray-100 dark:border-gray-800">
              {brand.name}
            </Link>
          )}
        </div>
        
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-gray-900 dark:text-white leading-[1.1] mb-5 tracking-tight break-words [word-break:normal] hyphens-none">
          {name}
        </h1>
        
        <div className="flex flex-wrap items-center gap-4 sm:gap-5 mb-6 sm:mb-8">
          <div className="flex items-center gap-1 text-amber-500 bg-amber-50 dark:bg-amber-900/20 px-2 sm:px-3 py-1 sm:py-1.5 rounded-xl border border-amber-100 dark:border-amber-900/30">
            {[...Array(5)].map((_, i) => (
              <Star key={i} size={16} className={i < 4 ? "fill-current" : i === 4 ? "fill-current opacity-30" : ""} />
            ))}
            <span className="text-amber-700 dark:text-amber-400 font-black text-xs sm:text-sm ml-1">
              {averageRating > 0 ? averageRating.toFixed(1) : "0.0"}
            </span>
          </div>
          <span className="text-gray-400 text-[10px] sm:text-xs font-bold uppercase tracking-wider">
            ({ratingCount || 0} {ratingCount === 1 ? 'Review' : 'Reviews'})
          </span>
          <span className="hidden sm:block text-gray-200 dark:text-gray-800 self-stretch w-px"></span>
          {stock > 0 || (selectedVariant && selectedVariant.stock > 0) ? (
            <span className="text-emerald-600 font-black bg-emerald-50 dark:bg-emerald-900/40 px-3 sm:px-4 py-1 sm:py-1.5 rounded-full text-[10px] sm:text-xs flex items-center gap-2 uppercase tracking-widest border border-emerald-100 dark:border-emerald-900/30">
              <div className="w-1 sm:w-1.5 h-1 sm:h-1.5 rounded-full bg-emerald-500 animate-pulse"></div> In Stock
            </span>
          ) : (
            <span className="text-rose-500 font-black bg-rose-50 dark:bg-rose-900/40 px-3 sm:px-4 py-1 sm:py-1.5 rounded-full text-[10px] sm:text-xs uppercase tracking-widest border border-rose-100 dark:border-rose-900/30">Out of Stock</span>
          )}
          
          {/* Product Tags (Keywords) */}
          {product.tags && product.tags.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {product.tags.map((tag: any) => (
                <span key={tag.id} className="text-[10px] sm:text-[11px] font-bold bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 px-2 py-0.5 rounded-md uppercase tracking-tight">
                  #{tag.name}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Flash Sale Banner */}
        {isActiveFlashSale && flashSaleEndTime && (
           <FlashSaleBanner endTime={flashSaleEndTime} stock={stock} />
        )}
        
        <div className="flex flex-col gap-1 mb-8 sm:mb-10 overflow-hidden">
           {renderPrice()}
           {productType !== "VARIABLE" && !hasSpecialPrice && (
              <span className="text-gray-500 font-bold uppercase tracking-widest text-[10px] sm:text-xs mt-2">
                 Per {weight || unit || 'Piece'}
              </span>
           )}
        </div>
        
        <div className="w-full max-w-full relative">
          <div 
            className={`w-full text-base sm:text-lg text-gray-600 dark:text-gray-300 mb-4 leading-relaxed transition-all duration-500 overflow-hidden relative ${
              !isExpanded ? "max-h-[140px]" : "max-h-[4000px]"
            }`}
          >
            {shortDescription ? (
              <div 
                className="prose prose-indigo dark:prose-invert max-w-none prose-p:my-2 prose-img:rounded-2xl prose-img:max-w-full break-words [word-break:normal] hyphens-none text-left"
                dangerouslySetInnerHTML={{ __html: shortDescription }}
              />
            ) : (
              <p className="font-medium">
                {description 
                  ? (description.replace(/<[^>]*>/g, ""))
                  : `Premium quality ${name.toLowerCase()} sourced directly from organic farms. Carefully handpicked and packed to guarantee maximum freshness and nutritional value for your family.`}
              </p>
            )}
            
            {!isExpanded && ((shortDescription && shortDescription.length > 200) || (description && description.length > 200)) && (
               <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-white dark:from-gray-950 to-transparent pointer-events-none z-10"></div>
            )}
          </div>
          
          {((shortDescription && shortDescription.length > 200) || (description && description.length > 200)) && (
            <button 
              onClick={() => setIsExpanded(!isExpanded)}
              className="text-indigo-600 dark:text-indigo-400 font-black text-sm uppercase tracking-widest hover:text-indigo-700 dark:hover:text-indigo-300 transition-all flex items-center gap-2 mt-2 group"
            >
              {isExpanded ? "Show Less" : "Read Full Description"}
              <motion.div 
                animate={{ rotate: isExpanded ? 180 : 0 }}
                className="group-hover:translate-y-0.5 transition-transform"
              >
                 <ChevronDown size={16} strokeWidth={3} />
              </motion.div>
            </button>
          )}
        </div>

        {/* Variations Selector */}
        {productType === "VARIABLE" && enabledVariants.length > 0 && (
          <div className="mb-10 bg-gray-50 dark:bg-gray-900/50 p-6 rounded-[2rem] border border-gray-100 dark:border-gray-800">
            <h3 className="text-xs font-black text-gray-400 uppercase tracking-[0.2em] mb-5 px-1">
              Select Variation
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {enabledVariants.map((v: any) => {
                const isSelected = selectedVariant?.id === v.id;
                const variantName = v.attributes?.map((a: any) => a.value).join(" / ");
                return (
                  <button
                    key={v.id}
                    onClick={() => setSelectedVariant(v)}
                    className={`flex flex-col gap-3 p-3 rounded-2xl border-2 text-left transition-all relative group ${
                      isSelected 
                        ? "border-indigo-600 bg-white dark:bg-gray-800 shadow-xl ring-4 ring-indigo-500/10 scale-105 z-10" 
                        : "border-gray-100 dark:border-gray-800 bg-white/50 dark:bg-gray-900/50 hover:border-indigo-300 dark:hover:border-indigo-700"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      {v.image ? (
                        <div className="w-12 h-12 rounded-xl overflow-hidden shrink-0 border border-gray-100 dark:border-gray-700 bg-white shadow-sm">
                          <img src={getImageSrc(v.image)} alt={variantName} className="w-full h-full object-contain p-1" />
                        </div>
                      ) : (
                        <div className="w-12 h-12 rounded-xl bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-gray-400">
                           <Zap size={16} />
                        </div>
                      )}
                      
                      <div className="flex-1 min-w-0">
                        <p className={`text-xs font-black truncate uppercase tracking-tight ${isSelected ? "text-indigo-600" : "text-gray-500"}`}>
                          {variantName || "Standard"}
                        </p>
                        <p className={`text-sm font-black mt-0.5 ${isSelected ? "text-gray-900 dark:text-white" : "text-gray-400"}`}>
                           ৳{v.price?.toFixed(0)}
                        </p>
                      </div>
                    </div>
                    {isSelected && (
                      <div className="absolute -top-3 -right-3 bg-indigo-600 text-white w-7 h-7 rounded-full shadow-lg flex items-center justify-center ring-4 ring-white dark:ring-gray-950">
                        <Check size={14} strokeWidth={4} />
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        )}
        
        <div className="mb-12 pt-4">
          <AddToCartButton product={product} selectedVariant={selectedVariant} />
        </div>
        
        {/* Features/Trust badges */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-10">
          <div className="flex items-center gap-4 p-5 rounded-[1.5rem] bg-indigo-50/50 dark:bg-indigo-900/10 border border-indigo-100/50 dark:border-indigo-900/20">
            <div className="bg-white dark:bg-gray-900 p-3 rounded-2xl text-indigo-600 dark:text-indigo-400 shadow-sm ring-1 ring-black/5">
              <Truck size={28} strokeWidth={2.5} />
            </div>
            <div>
              <div className="font-black text-gray-900 dark:text-white uppercase tracking-tight text-sm">Lightning Fast</div>
              <div className="text-xs text-gray-500 dark:text-gray-400 font-bold uppercase tracking-widest mt-0.5">Under 2 hours</div>
            </div>
          </div>
          
          <div className="flex items-center gap-4 p-5 rounded-[1.5rem] bg-emerald-50/50 dark:bg-emerald-900/10 border border-emerald-100/50 dark:border-emerald-900/20">
            <div className="bg-white dark:bg-gray-900 p-3 rounded-2xl text-emerald-600 dark:text-emerald-400 shadow-sm ring-1 ring-black/5">
              <ShieldCheck size={28} strokeWidth={2.5} />
            </div>
            <div>
              <div className="font-black text-gray-900 dark:text-white uppercase tracking-tight text-sm">Always Fresh</div>
              <div className="text-xs text-gray-500 dark:text-gray-400 font-bold uppercase tracking-widest mt-0.5">Organic Certified</div>
            </div>
          </div>
        </div>

        {/* SKU & Stock Footer */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 border-t border-gray-100 dark:border-gray-800 pt-8">
           <div className="flex items-center gap-4 p-4 rounded-2xl bg-gray-50 dark:bg-gray-900/50 border border-gray-100 dark:border-gray-800 shadow-sm">
              <div className="bg-white dark:bg-gray-800 p-2 rounded-lg shadow-sm">
                 <Zap size={20} className="text-indigo-600" />
              </div>
              <div>
                 <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">SKU Code</p>
                 <p className="text-sm font-black text-gray-900 dark:text-gray-100 leading-none mt-1">
                    {selectedVariant?.sku || product?.sku || 'FCR-SKU-99201'}
                 </p>
              </div>
           </div>
           
           <div className="flex items-center gap-4 p-4 rounded-2xl bg-blue-50/30 dark:bg-blue-900/10 border border-blue-100 dark:border-blue-800 shadow-sm">
              <div className="bg-white dark:bg-gray-800 p-2 rounded-lg shadow-sm">
                 <ShieldCheck size={20} className="text-blue-600" />
              </div>
              <div>
                 <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Stock Status</p>
                 <p className="text-sm font-black text-blue-700 dark:text-blue-400 leading-none mt-1 uppercase tracking-tight">
                    {(selectedVariant ? selectedVariant.stock : stock) > 0 ? `${selectedVariant ? selectedVariant.stock : stock} Pcs Available` : 'Out of Stock'}
                 </p>
              </div>
           </div>
        </div>
        
      </div>
    </div>
  );
}
