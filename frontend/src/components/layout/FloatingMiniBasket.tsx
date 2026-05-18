"use client";

import { useCartStore } from "@/store/cartStore";
import { motion, AnimatePresence } from "framer-motion";
import { ShoppingCart, ArrowRight } from "lucide-react";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

export default function FloatingMiniBasket() {
  const { items, getCartTotal, openCart } = useCartStore();
  const [mounted, setMounted] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted || pathname === '/cart' || pathname === '/checkout') return null;

  const itemCount = items.reduce((count, item) => count + (item.quantity || 1), 0);
  const totalAmount = getCartTotal();

  return (
    <AnimatePresence>
      {itemCount > 0 && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          className="fixed bottom-6 inset-x-0 mx-auto w-[calc(100%-2rem)] max-w-[340px] z-[55] lg:bottom-8 lg:right-8 lg:left-auto lg:mx-0"
        >
          <button
            onClick={openCart}
            className="w-full bg-white dark:bg-gray-900 shadow-xl shadow-primary/10 dark:shadow-emerald-900/10 border border-gray-100 dark:border-gray-800 rounded-2xl p-4 flex items-center justify-between group hover:border-emerald-500/30 transition-all active:scale-95"
          >
            <div className="flex items-center gap-4">
              <div className="bg-emerald-50 dark:bg-emerald-900/30 w-12 h-12 rounded-xl flex items-center justify-center text-emerald-600 relative overflow-hidden shrink-0">
                 <ShoppingCart size={22} className="relative z-10 fill-emerald-600/20" />
                 <motion.div 
                   key={itemCount}
                   initial={{ scale: 0, opacity: 0 }}
                   animate={{ scale: 1, opacity: 1 }}
                   transition={{ type: "spring", stiffness: 300, damping: 20 }}
                   className="absolute inset-0 bg-emerald-100 dark:bg-emerald-900/50"
                 />
              </div>
              <div className="flex flex-col items-start gap-0.5">
                <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                  {itemCount} {itemCount === 1 ? 'item' : 'items'}
                </span>
                <motion.div 
                  key={totalAmount}
                  initial={{ y: -5, opacity: 0.5 }}
                  animate={{ y: 0, opacity: 1 }}
                  className="font-black text-lg text-gray-900 dark:text-white"
                >
                  Total: <span className="text-emerald-600 dark:text-emerald-500">৳{totalAmount.toFixed(2)}</span>
                </motion.div>
              </div>
            </div>
            
            <div className="w-10 h-10 rounded-full bg-gray-50 dark:bg-gray-800 flex items-center justify-center text-gray-500 group-hover:bg-emerald-500 group-hover:text-white group-hover:shadow-lg transition-all shrink-0">
              <ArrowRight size={18} />
            </div>
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
