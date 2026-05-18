"use client";
import { API_URL } from "@/lib/config";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowLeft, ChevronRight, LayoutGrid, Loader2 } from "lucide-react";
import { motion } from "framer-motion";




export default function CategoriesPage() {
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await fetch(`${API_URL}/api/categories`);
        const json = await res.json();
        if (json.success) {
          setCategories(json.data);
        }
      } catch (e) {
        console.error("Failed to fetch categories:", e);
      } finally {
        setLoading(false);
      }
    };
    fetchCategories();
  }, []);

  const getImageSrc = (url: string) => {
    if (!url) return `https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&q=80&w=400`;
    if (url.startsWith('http')) return url;
    return `${API_URL}${url}`;
  };

  if (loading) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center">
        <Loader2 className="w-12 h-12 text-emerald-500 animate-spin" />
      </div>
    );
  }

  return (
    <div className="bg-gray-50 dark:bg-gray-950 min-h-screen">
      {/* Hero Header */}
      <div className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 pb-12 pt-8">
        <div className="container mx-auto px-4">
          <Link href="/" className="inline-flex items-center text-gray-500 hover:text-emerald-600 transition-colors mb-8 group font-medium">
            <ArrowLeft size={18} className="mr-2 group-hover:-translate-x-1 transition-transform" />
            Back to Home
          </Link>
          
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="bg-emerald-100 dark:bg-emerald-900/30 p-2 rounded-lg text-emerald-600 dark:text-emerald-400">
                  <LayoutGrid size={24} />
                </div>
                <span className="text-emerald-600 dark:text-emerald-400 font-bold uppercase tracking-[0.2em] text-sm">Explore Our</span>
              </div>
              <h1 className="text-4xl md:text-6xl font-black text-gray-900 dark:text-white tracking-tighter italic uppercase leading-none">
                Market <span className="text-emerald-600">Categories</span>
              </h1>
              <p className="text-gray-500 dark:text-gray-400 mt-4 max-w-xl text-lg font-medium">
                Browse our premium selection of fresh groceries, organic produce, and household essentials.
              </p>
            </div>
            
            <div className="bg-white dark:bg-gray-800 p-4 rounded-2xl shadow-xl shadow-gray-200/50 dark:shadow-none border border-gray-100 dark:border-gray-700 flex items-center gap-4">
               <div className="text-right">
                  <p className="text-xs font-black text-gray-400 uppercase tracking-widest">Total Found</p>
                  <p className="text-2xl font-black text-emerald-600 line-none">{categories.reduce((acc, c) => acc + 1 + (c.children?.length || 0), 0)} Units</p>
               </div>
               <div className="h-10 w-px bg-gray-100 dark:bg-gray-700"></div>
               <div className="bg-emerald-500 text-white w-10 h-10 rounded-xl flex items-center justify-center font-black">
                  {categories.length}
               </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {categories.map((category, idx) => (
            <motion.div
              key={category.id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              className="group relative h-[350px] rounded-[2.5rem] overflow-hidden shadow-2xl shadow-gray-200/50 dark:shadow-none border border-white dark:border-gray-800"
            >
              <img 
                src={getImageSrc(category.image)} 
                alt={category.name}
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-gray-900/90 via-gray-900/30 to-transparent transition-opacity duration-500 group-hover:opacity-95"></div>
              
              <div className="absolute inset-0 p-8 flex flex-col justify-end">
                <div className="flex items-center gap-2 mb-2">
                   <span className="bg-emerald-500 text-white text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-widest">
                      {category._count?.products || 0} Products
                   </span>
                   {category.children?.length > 0 && (
                      <span className="bg-white/20 backdrop-blur-md text-white text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-widest border border-white/20">
                         {category.children.length} Subcategories
                      </span>
                   )}
                </div>
                
                <h2 className="text-3xl font-black text-white italic tracking-tighter uppercase mb-4 leading-tight group-hover:translate-x-2 transition-transform duration-500">
                  {category.name}
                </h2>
                
                <div className="flex flex-wrap gap-2 mb-6 opacity-0 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-500 delay-100">
                   {category.children?.slice(0, 3).map((sub: any) => (
                      <Link 
                        key={sub.id} 
                        href={`/categories/${sub.slug}`}
                        className="text-[11px] font-bold text-gray-300 hover:text-emerald-400 bg-white/5 hover:bg-white/10 backdrop-blur-md border border-white/10 px-3 py-1 rounded-lg transition-colors"
                      >
                        {sub.name}
                      </Link>
                   ))}
                   {category.children?.length > 3 && (
                      <span className="text-[11px] font-bold text-gray-400 px-2 py-1">+{category.children.length - 3} More</span>
                   )}
                </div>

                <Link 
                  href={`/categories/${category.slug}`}
                  className="bg-white text-gray-900 hover:bg-emerald-500 hover:text-white px-6 py-3 rounded-2xl font-black text-sm uppercase tracking-wider transition-all duration-300 flex items-center justify-center gap-2 w-full shadow-lg group-hover:shadow-emerald-500/20"
                >
                  View Collection <ChevronRight size={18} strokeWidth={3} />
                </Link>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Categories Grid - Quick Links */}
        <div className="mt-24">
           <div className="flex items-center gap-4 mb-12">
              <div className="h-px flex-1 bg-gray-200 dark:bg-gray-800"></div>
              <h3 className="text-xs font-black text-gray-400 uppercase tracking-[0.5em] text-center">All Departments</h3>
              <div className="h-px flex-1 bg-gray-200 dark:bg-gray-800"></div>
           </div>
           
           <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {categories.map((category) => (
                 <Link 
                   key={category.id} 
                   href={`/categories/${category.slug}`}
                   className="bg-white dark:bg-gray-900 p-6 rounded-3xl border border-gray-100 dark:border-gray-800 hover:border-emerald-300 dark:hover:border-emerald-700 transition-all hover:shadow-xl hover:shadow-emerald-500/5 group text-center"
                 >
                    <div className="w-12 h-12 bg-gray-50 dark:bg-gray-800 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 group-hover:bg-emerald-50 dark:group-hover:bg-emerald-900/20 transition-all">
                       <LayoutGrid size={20} className="text-gray-400 group-hover:text-emerald-500 transition-colors" />
                    </div>
                    <span className="text-sm font-black text-gray-700 dark:text-gray-300 uppercase tracking-tight block truncate">
                       {category.name}
                    </span>
                    <span className="text-[10px] font-bold text-gray-400 block mt-1 uppercase tracking-widest">{category._count?.products || 0} ITEMS</span>
                 </Link>
              ))}
           </div>
        </div>
      </div>
    </div>
  );
}
