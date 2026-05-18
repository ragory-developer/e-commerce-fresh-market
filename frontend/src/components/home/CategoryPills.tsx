"use client";

import { useRef, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { motion } from "framer-motion";

interface CategoryPill {
  name: string;
  icon?: string;
}

interface CategoryPillsProps {
  categories?: CategoryPill[];
  activeCategory?: string;
  onCategoryChange?: (category: string) => void;
}

const defaultCategories: CategoryPill[] = [
  { name: "All" },
  { name: "Skincare" },
  { name: "Makeup" },
  { name: "Haircare" },
  { name: "Body Care" },
  { name: "Fragrance" },
  { name: "Tools" },
  { name: "Organic" },
  { name: "Men's Care" },
  { name: "New Arrivals" },
  { name: "Best Sellers" },
  { name: "Gift Sets" },
];

export default function CategoryPills({
  categories = defaultCategories,
  activeCategory: controlledActive,
  onCategoryChange,
}: CategoryPillsProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [internalActive, setInternalActive] = useState("All");

  const active = controlledActive ?? internalActive;

  const handleClick = (name: string) => {
    setInternalActive(name);
    onCategoryChange?.(name);
  };

  const scroll = (direction: "left" | "right") => {
    if (scrollRef.current) {
      const scrollAmount = 200;
      scrollRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
    }
  };

  return (
    <div className="relative">
      {/* Left arrow */}
      <button
        onClick={() => scroll("left")}
        className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white dark:bg-gray-800 shadow-lg rounded-full w-8 h-8 flex items-center justify-center text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors hidden md:flex"
      >
        <ChevronLeft size={18} />
      </button>

      {/* Scrollable container */}
      <div
        ref={scrollRef}
        className="flex gap-3 overflow-x-auto scrollbar-hide px-2 md:px-10 py-2"
      >
        {categories.map((cat, idx) => (
          <motion.button
            key={idx}
            whileTap={{ scale: 0.95 }}
            onClick={() => handleClick(cat.name)}
            className={`shrink-0 px-5 py-2.5 rounded-full font-semibold text-sm transition-all border-2 ${
              active === cat.name
                ? "bg-emerald-600 text-white border-emerald-600 shadow-lg shadow-emerald-600/20"
                : "bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border-gray-200 dark:border-gray-700 hover:border-emerald-400 hover:text-emerald-600"
            }`}
          >
            {cat.name}
          </motion.button>
        ))}
      </div>

      {/* Right arrow */}
      <button
        onClick={() => scroll("right")}
        className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white dark:bg-gray-800 shadow-lg rounded-full w-8 h-8 flex items-center justify-center text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors hidden md:flex"
      >
        <ChevronRight size={18} />
      </button>
    </div>
  );
}
