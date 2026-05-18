"use client";

import { useCartStore } from "@/store/cartStore";
import { motion, AnimatePresence } from "framer-motion";
import { useSettingsStore } from "@/store/settingsStore";
import { X, Trash2, Plus, Minus, ArrowRight, ShoppingBag } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function CartDrawer() {
  const { items, isOpen, closeCart, updateQuantity, removeFromCart, getCartTotal } = useCartStore();
  const { settings } = useSettingsStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Prevent background scrolling when cart is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!mounted) return null;

  const total = getCartTotal();

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeCart}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[60]"
          />

          {/* Drawer */}
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="fixed top-0 right-0 h-full w-full sm:w-[450px] bg-white dark:bg-gray-950 shadow-2xl z-[70] flex flex-col border-l border-gray-200 dark:border-gray-800"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-100 dark:border-gray-800">
              <h2 className="text-2xl font-black flex items-center gap-3 text-gray-900 dark:text-gray-100">
                <ShoppingBag className="text-primary" />
                Your Cart
                <span className="bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 text-sm py-1 px-3 rounded-full font-semibold shadow-sm">
                  {items.length}
                </span>
              </h2>
              <button 
                onClick={closeCart}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors"
              >
                <X size={24} />
              </button>
            </div>

            {/* Cart Items */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {items.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center text-gray-500 space-y-4">
                  <div className="bg-gray-50 dark:bg-gray-900 p-6 rounded-full text-gray-400 mb-4">
                    <ShoppingBag size={48} strokeWidth={1.5} />
                  </div>
                  <p className="text-lg font-medium">Your cart is empty</p>
                  <button 
                    onClick={closeCart}
                    className="text-primary font-bold hover:underline"
                  >
                    Continue Shopping
                  </button>
                </div>
              ) : (
                items.map((item) => (
                  <motion.div 
                    layout
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    key={item.id} 
                    className="flex gap-4 bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 p-3 rounded-2xl shadow-sm"
                  >
                    <Link 
                      href={settings.permalink_structure === 'product' ? `/product/${item.slug}` : `/${item.slug}`}
                      onClick={closeCart}
                      className="w-20 h-20 bg-gray-100 dark:bg-gray-800 rounded-xl overflow-hidden shrink-0"
                    >
                      <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                    </Link>
                    
                    <div className="flex-1 flex flex-col justify-between">
                      <div className="flex justify-between items-start">
                        <Link 
                          href={settings.permalink_structure === 'product' ? `/product/${item.slug}` : `/${item.slug}`}
                          onClick={closeCart}
                          className="font-semibold text-gray-800 dark:text-gray-200 line-clamp-1 flex-1 pr-2 hover:text-primary transition-colors"
                        >
                          {item.name}
                        </Link>
                        <button 
                          onClick={() => removeFromCart(item.id)}
                          className="text-gray-400 hover:text-rose-500 transition-colors p-1"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                      
                      <div className="flex justify-between items-center mt-2">
                        <div className="font-black text-emerald-600 dark:text-emerald-500">৳{item.price.toFixed(2)}</div>
                        
                        <div className="flex items-center gap-2">
                          <button 
                            onClick={() => updateQuantity(item.id, Math.max(1, (item.quantity || 1) - 1))}
                            disabled={(item.quantity || 1) <= 1}
                            className={`w-7 h-7 rounded-md flex items-center justify-center transition-colors ${
                              (item.quantity || 1) <= 1 
                                ? 'bg-gray-100 text-gray-400 cursor-not-allowed dark:bg-gray-800 dark:text-gray-500' 
                                : 'bg-gray-200 hover:bg-gray-300 text-gray-700 dark:bg-gray-700 dark:hover:bg-gray-600 dark:text-gray-200'
                            }`}
                          >
                            <Minus size={14} />
                          </button>
                          
                          <span className="font-semibold text-sm text-gray-800 dark:text-gray-100 min-w-[1.5rem] text-center">
                            {item.quantity || 1}
                          </span>
                          
                          <button 
                            onClick={() => updateQuantity(item.id, (item.quantity || 1) + 1)}
                            className="w-7 h-7 bg-gray-200 hover:bg-gray-300 text-gray-700 dark:bg-gray-700 dark:hover:bg-gray-600 dark:text-gray-200 rounded-md flex items-center justify-center transition-colors"
                          >
                            <Plus size={14} />
                          </button>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))
              )}
            </div>

            {/* Footer */}
            {items.length > 0 && (
              <div className="p-6 bg-gray-50 dark:bg-gray-900/50 border-t border-gray-100 dark:border-gray-800">
                <div className="flex justify-between items-center mb-6">
                  <span className="font-semibold text-gray-800 dark:text-gray-200">Subtotal</span>
                  <span className="font-black text-2xl text-emerald-600 dark:text-emerald-500">৳{total.toFixed(2)}</span>
                </div>
                
                <div className="space-y-3">
                  <Link 
                    href="/cart"
                    onClick={closeCart}
                    className="w-full bg-white dark:bg-gray-800 border-2 border-primary text-primary hover:bg-emerald-50 dark:hover:bg-emerald-900/20 py-4 rounded-xl font-bold text-lg flex items-center justify-center transition-colors shadow-sm"
                  >
                    View Full Cart
                  </Link>
                  <Link 
                    href="/checkout"
                    onClick={closeCart}
                    className="w-full bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white py-4 rounded-xl font-black text-lg flex items-center justify-center gap-2 transition-all shadow-xl shadow-emerald-500/25 hover:-translate-y-0.5"
                  >
                    Checkout <ArrowRight size={20} />
                  </Link>
                </div>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
