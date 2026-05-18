"use client";

import { useState } from "react";
import { useCartStore } from "@/store/cartStore";
import { ShoppingCart, Check, Minus, Plus, Zap } from "lucide-react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { getActivePrice } from "@/lib/utils";
import { API_URL } from "@/lib/config";
import * as fpixel from "@/lib/fpixel";

function resolveImage(img: string | null | undefined): string {
  if (!img) return '';
  return img.startsWith('http') ? img : `${API_URL}${img}`;
}

export default function AddToCartButton({ product, selectedVariant }: { product: any, selectedVariant?: any }) {
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);
  const addToCart = useCartStore((state) => state.addToCart);
  const router = useRouter();

  const currentId = selectedVariant ? selectedVariant.id : product.id;
  const currentPrice = getActivePrice(selectedVariant || product);
  const currentName = selectedVariant 
    ? `${product.name} - ${selectedVariant.attributes?.map((a: any) => a.value).join(' / ')}`
    : product.name;
  const currentImage = resolveImage(selectedVariant?.image || product.image);

  const isSelectionRequired = product.productType === "VARIABLE" && !selectedVariant;

  const handleBuyNow = () => {
    if (isSelectionRequired) return;
    addToCart({
      id: currentId,
      productId: product.id,
      variantId: selectedVariant?.id,
      variantName: selectedVariant ? currentName : undefined,
      name: currentName,
      price: currentPrice,
      slug: product.slug,
      image: currentImage,
      quantity,
    });
    
    fpixel.event('AddToCart', {
      content_name: currentName,
      content_ids: [currentId],
      content_type: 'product',
      value: currentPrice * quantity,
      currency: 'BDT'
    });

    router.push('/checkout');
  };

  const handleAdd = () => {
    if (isSelectionRequired) return;
    addToCart({
      id: currentId,
      productId: product.id,
      variantId: selectedVariant?.id,
      variantName: selectedVariant ? currentName : undefined,
      name: currentName,
      price: currentPrice,
      slug: product.slug,
      image: currentImage,
      quantity,
    });
    
    fpixel.event('AddToCart', {
      content_name: currentName,
      content_ids: [currentId],
      content_type: 'product',
      value: currentPrice * quantity,
      currency: 'BDT'
    });
    
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  const totalPrice = currentPrice * quantity;

  return (
    <div className="flex flex-col gap-6 w-full">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center w-full">
        <div className="flex items-center justify-between border-2 border-gray-200 dark:border-gray-700 rounded-xl w-32 h-14 bg-white dark:bg-gray-900 px-1 shrink-0">
          <button 
            type="button"
            onClick={() => setQuantity(Math.max(1, quantity - 1))}
            disabled={quantity <= 1 || isSelectionRequired}
            className={`w-10 h-10 rounded-lg flex items-center justify-center transition-colors ${
              quantity <= 1 || isSelectionRequired
                ? 'bg-gray-100 text-gray-400 cursor-not-allowed dark:bg-gray-800 dark:text-gray-500' 
                : 'bg-gray-100 hover:bg-gray-200 text-gray-700 dark:bg-gray-800 dark:hover:bg-gray-700 dark:text-gray-200'
            }`}
          >
            <Minus size={18} />
          </button>
          <span className="font-bold text-lg select-none w-8 text-center text-gray-900 dark:text-white">{quantity}</span>
          <button 
            type="button"
            onClick={() => setQuantity(quantity + 1)}
            disabled={isSelectionRequired}
            className={`w-10 h-10 rounded-lg flex items-center justify-center transition-colors ${
              isSelectionRequired
                ? 'bg-gray-100 text-gray-400 cursor-not-allowed dark:bg-gray-800 dark:text-gray-500'
                : 'bg-gray-100 hover:bg-gray-200 text-gray-700 dark:bg-gray-800 dark:hover:bg-gray-700 dark:text-gray-200'
            }`}
          >
            <Plus size={18} />
          </button>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-3 w-full">
          <motion.button
            type="button"
            whileTap={{ scale: isSelectionRequired ? 1 : 0.95 }}
            onClick={handleAdd}
            disabled={added || isSelectionRequired}
            className={`flex-1 h-14 rounded-xl font-bold flex items-center justify-center gap-2 transition-all duration-300 shadow-sm ${
              added 
                ? "bg-emerald-50 text-emerald-600 border-2 border-emerald-500" 
                : isSelectionRequired
                  ? "bg-gray-100 text-gray-400 cursor-not-allowed border-2 border-dashed border-gray-200 dark:bg-gray-900 dark:border-gray-800"
                  : "bg-gray-200 hover:bg-gray-300 text-gray-800 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700"
            }`}
          >
            {added ? (
              <>
                <Check size={20} />
                Added
              </>
            ) : (
              <>
                <ShoppingCart size={20} className="fill-current" />
                {isSelectionRequired ? "Select Variant" : "Add to Cart"}
              </>
            )}
          </motion.button>
          
          <motion.button
            type="button"
            whileTap={{ scale: isSelectionRequired ? 1 : 0.95 }}
            onClick={handleBuyNow}
            disabled={isSelectionRequired}
            className={`flex-1 h-14 rounded-xl font-bold flex items-center justify-center gap-2 transition-all duration-300 shadow-xl ${
              isSelectionRequired
                ? "bg-gray-100 text-gray-400 cursor-not-allowed border shadow-none dark:bg-gray-900 dark:border-gray-800"
                : "shadow-emerald-500/20 bg-emerald-600 hover:bg-emerald-700 text-white"
            }`}
          >
            <Zap size={20} className="fill-current" />
            Buy Now
          </motion.button>
        </div>
      </div>

      {/* Dynamic Total Price Section */}
      <div className="bg-gray-50 dark:bg-gray-900/50 rounded-2xl p-5 border border-gray-100 dark:border-gray-800 flex items-center justify-between">
        <div className="flex flex-col">
          <span className="text-gray-600 dark:text-gray-400 font-medium">Total Price</span>
          <span className="text-sm text-gray-500">৳{currentPrice.toFixed(2)} x {quantity}</span>
        </div>
        <motion.div 
          key={quantity}
          initial={{ scale: 0.9, opacity: 0.8 }}
          animate={{ scale: 1, opacity: 1 }}
          className="text-2xl font-black text-emerald-600 dark:text-emerald-500"
        >
          ৳{totalPrice.toFixed(2)}
        </motion.div>
      </div>
    </div>
  );
}
