"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import ProductCard from "@/components/ui/ProductCard";
import ProductCardSkeleton from "@/components/ui/ProductCardSkeleton";
import { X } from "lucide-react";
import Link from "next/link";

interface InfiniteProductListProps {
  initialProducts: any[];
  initialPagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
  fetchUrl: string;
  gridCols: string;
  enabled: boolean;
}

import { motion, AnimatePresence } from "framer-motion";

export default function InfiniteProductList({
  initialProducts,
  initialPagination,
  fetchUrl,
  gridCols,
  enabled
}: InfiniteProductListProps) {
  const [products, setProducts] = useState(initialProducts);
  const [page, setPage] = useState(initialPagination.page);
  const [hasMore, setHasMore] = useState(initialPagination.page < initialPagination.totalPages);
  const [loading, setLoading] = useState(false);
  const observer = useRef<IntersectionObserver | null>(null);

  const lastProductRef = useCallback((node: HTMLDivElement) => {
    if (loading || !enabled || !hasMore) return;
    if (observer.current) observer.current.disconnect();
    
    observer.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting) {
        setPage(prevPage => prevPage + 1);
      }
    }, { rootMargin: "200px" });
    
    if (node) observer.current.observe(node);
  }, [loading, hasMore, enabled]);

  useEffect(() => {
    setProducts(initialProducts);
    setPage(initialPagination.page);
    setHasMore(initialPagination.page < initialPagination.totalPages);
    setLoading(false);
  }, [initialProducts, initialPagination, fetchUrl]);

  useEffect(() => {
    if (page === initialPagination.page) return;
    
    const fetchMore = async () => {
      setLoading(true);
      try {
        const url = new URL(fetchUrl);
        url.searchParams.set("page", page.toString());
        url.searchParams.set("limit", "20");
        
        const res = await fetch(url.toString());
        const json = await res.json();
        
        if (json.success) {
          setProducts(prev => [...prev, ...json.data]);
          setHasMore(page < json.pagination.totalPages);
        }
      } catch (e) {
        console.error("Failed to fetch more products:", e);
      } finally {
        setLoading(false);
      }
    };

    fetchMore();
  }, [page, fetchUrl, initialPagination.page]);

  // If infinite scroll is disabled, just show the initial products in a standard grid
  if (!enabled) {
    return (
      <div className={`grid grid-cols-2 md:grid-cols-2 ${gridCols} gap-6 sm:gap-8`}>
        {initialProducts.length > 0 ? (
          initialProducts.map((product: any, idx: number) => (
            <motion.div 
              key={product.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05 }}
            >
              <ProductCard product={product} />
            </motion.div>
          ))
        ) : (
          <EmptyState />
        )}
      </div>
    );
  }

  return (
    <div className="space-y-12">
      <div className={`grid grid-cols-2 md:grid-cols-2 ${gridCols} gap-6 sm:gap-8`}>
        <AnimatePresence mode="popLayout">
          {products.map((product: any, index: number) => {
            const isLast = products.length === index + 1;
            const batchIndex = index % 20; // Stagger within each batch
            return (
              <motion.div 
                ref={isLast ? lastProductRef : null} 
                key={`${product.id}-${index}`}
                initial={{ opacity: 0, y: 40, scale: 0.94 }}
                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ 
                  duration: 0.6,
                  delay: batchIndex * 0.03, // Subtle stagger
                  ease: [0.21, 1.11, 0.81, 0.99]
                }}
              >
                <ProductCard product={product} />
              </motion.div>
            );
          })}
        </AnimatePresence>
        
        {loading && (
          <>
            {[...Array(8)].map((_, i) => (
              <motion.div
                key={`skeleton-${i}`}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <ProductCardSkeleton />
              </motion.div>
            ))}
          </>
        )}
      </div>

      {!hasMore && products.length > 0 && (
        <div className="py-16 text-center">
          <div className="inline-flex flex-col items-center gap-4">
            <div className="h-[1px] w-12 bg-gray-200 dark:bg-gray-800" />
            <p className="text-gray-400 font-bold uppercase tracking-[0.3em] text-[10px] italic">
              End of Collection
            </p>
            <div className="h-[1px] w-12 bg-gray-200 dark:bg-gray-800" />
          </div>
        </div>
      )}

      {products.length === 0 && !loading && <EmptyState />}
    </div>
  );
}

function EmptyState() {
  return (
    <div className="col-span-full py-32 text-center bg-white dark:bg-gray-900 rounded-[3rem] border-2 border-dashed border-gray-100 dark:border-gray-800 shadow-inner">
      <div className="w-20 h-20 bg-gray-50 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-6">
         <X size={32} className="text-gray-300" />
      </div>
      <h3 className="text-2xl font-black text-gray-900 dark:text-white mb-2 uppercase italic tracking-tighter">No items found</h3>
      <p className="text-gray-500 max-w-xs mx-auto font-medium">Try adjusting your filters or search criteria to find what you're looking for.</p>
      <Link href="/products" className="inline-block mt-8 bg-gray-900 dark:bg-white text-white dark:text-gray-900 px-8 py-3 rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-primary dark:hover:bg-primary dark:hover:text-white transition-all shadow-lg">
         Reset All Filters
      </Link>
    </div>
  );
}
