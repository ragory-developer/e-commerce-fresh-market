"use client";

import { motion } from "framer-motion";

export default function ProductCardSkeleton() {
  return (
    <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm overflow-hidden flex flex-col h-full relative group">
      {/* Image area skeleton */}
      <div className="relative aspect-square w-full bg-gray-50/50 dark:bg-gray-800/50 flex items-center justify-center p-4">
         <div className="w-full h-full bg-gray-100 dark:bg-gray-700/50 rounded-2xl animate-pulse" />
         
         {/* Top-right cart button skeleton */}
         <div className="absolute top-2 right-2 w-8 h-8 bg-white dark:bg-gray-700 rounded-full shadow-sm animate-pulse" />
      </div>

      {/* Body skeleton */}
      <div className="flex flex-col flex-1 p-3 gap-3">
        {/* Category skeleton */}
        <div className="h-2.5 w-1/4 bg-emerald-100/50 dark:bg-emerald-900/10 rounded-full animate-pulse" />
        
        {/* Name skeleton */}
        <div className="space-y-2">
          <div className="h-4 w-full bg-gray-100 dark:bg-gray-800 rounded animate-pulse" />
          <div className="h-4 w-4/5 bg-gray-100 dark:bg-gray-800 rounded animate-pulse" />
        </div>

        {/* Price/Footer skeleton */}
        <div className="mt-auto flex items-center gap-2">
          <div className="h-6 w-24 bg-emerald-50 dark:bg-emerald-900/10 rounded-lg animate-pulse" />
        </div>
      </div>

      {/* Premium Shimmer Overlay */}
      <div className="absolute inset-0 z-10 pointer-events-none">
        <div className="absolute inset-0 -translate-x-full animate-[shimmer_2.5s_infinite] bg-gradient-to-r from-transparent via-white/40 to-transparent dark:via-white/5" />
      </div>
      
      <style jsx>{`
        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
      `}</style>
    </div>
  );
}
