"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { Star, Quote } from "lucide-react";

interface Testimonial {
  name: string;
  avatar: string;
  rating: number;
  review: string;
  product: string;
}

interface TestimonialSectionProps {
  title?: string;
  subtitle?: string;
  testimonials?: Testimonial[];
  themeVariant?: "default" | "eid" | "puja" | "ramadan" | "boishakh" | "blackfriday" | "christmas";
}

const themeStyles = {
  default: {
    bg: "bg-gradient-to-b from-rose-50 via-pink-50 to-white dark:from-gray-900 dark:via-gray-900 dark:to-gray-950",
    badgeBg: "bg-rose-100 dark:bg-rose-900/30 text-rose-600 dark:text-rose-400",
    starColor: "text-rose-500 fill-rose-500",
    quoteColor: "text-rose-200 dark:text-rose-800",
    productColor: "text-rose-500 dark:text-rose-450",
    accentStarColor: "text-amber-400 fill-amber-400",
  },
  eid: {
    bg: "bg-gradient-to-b from-emerald-50 via-teal-50 to-white dark:from-slate-900 dark:via-emerald-950/20 dark:to-slate-950",
    badgeBg: "bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400",
    starColor: "text-emerald-500 fill-emerald-500",
    quoteColor: "text-emerald-200 dark:text-emerald-800",
    productColor: "text-emerald-600 dark:text-emerald-450",
    accentStarColor: "text-teal-500 fill-teal-500",
  },
  puja: {
    bg: "bg-gradient-to-b from-red-50 via-rose-50 to-white dark:from-slate-900 dark:via-rose-955/20 dark:to-slate-950",
    badgeBg: "bg-rose-100 dark:bg-rose-900/30 text-rose-700 dark:text-rose-400",
    starColor: "text-rose-500 fill-rose-500",
    quoteColor: "text-rose-200 dark:text-rose-800",
    productColor: "text-rose-600 dark:text-rose-450",
    accentStarColor: "text-orange-500 fill-orange-500",
  },
  ramadan: {
    bg: "bg-gradient-to-b from-slate-900/10 via-indigo-950/5 to-white dark:from-slate-950 dark:via-indigo-950/20 dark:to-slate-950",
    badgeBg: "bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400",
    starColor: "text-amber-500 fill-amber-500",
    quoteColor: "text-amber-200 dark:text-indigo-850",
    productColor: "text-amber-600 dark:text-amber-550",
    accentStarColor: "text-amber-500 fill-amber-500",
  },
  boishakh: {
    bg: "bg-gradient-to-b from-yellow-50 via-orange-50 to-white dark:from-slate-900 dark:via-orange-955/10 dark:to-slate-950",
    badgeBg: "bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-400",
    starColor: "text-orange-500 fill-orange-500",
    quoteColor: "text-orange-200 dark:text-orange-850",
    productColor: "text-red-650 dark:text-red-500",
    accentStarColor: "text-orange-500 fill-orange-500",
  },
  blackfriday: {
    bg: "bg-gradient-to-b from-gray-150 via-gray-50 to-white dark:from-gray-950 dark:via-gray-900 dark:to-gray-950",
    badgeBg: "bg-yellow-400/20 text-yellow-600 dark:text-yellow-400",
    starColor: "text-yellow-500 fill-yellow-500",
    quoteColor: "text-gray-300 dark:text-gray-800",
    productColor: "text-yellow-600 dark:text-yellow-500",
    accentStarColor: "text-yellow-400 fill-yellow-400",
  },
  christmas: {
    bg: "bg-gradient-to-b from-green-50 via-red-50 to-white dark:from-slate-900 dark:via-green-955/10 dark:to-slate-950",
    badgeBg: "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400",
    starColor: "text-green-500 fill-green-500",
    quoteColor: "text-green-200 dark:text-green-800",
    productColor: "text-red-650 dark:text-red-500",
    accentStarColor: "text-red-550 fill-red-550",
  },
};

export default function TestimonialSection({
  title = "Real Results, Real Beauty",
  subtitle = "See what our customers are saying",
  testimonials = [],
  themeVariant = "default",
}: TestimonialSectionProps) {
  const styles = themeStyles[themeVariant] || themeStyles.default;

  return (
    <section className={`py-12 lg:py-20 ${styles.bg}`}>
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <motion.div
            initial={false}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <span className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-bold mb-4 ${styles.badgeBg}`}>
              <Star size={14} className={styles.starColor} /> Customer Reviews
            </span>
            <h2 className="text-3xl lg:text-4xl font-black text-gray-900 dark:text-white mb-3">
              {title}
            </h2>
            <p className="text-gray-500 dark:text-gray-400 text-lg max-w-lg mx-auto">
              {subtitle}
            </p>
          </motion.div>
        </div>

        {/* Testimonial Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {testimonials.map((item, idx) => (
            <motion.div
              key={idx}
              initial={false}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: idx * 0.1 }}
              className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-700 hover:shadow-xl transition-shadow group"
            >
              {/* Quote icon */}
              <Quote size={24} className={`${styles.quoteColor} mb-3`} />

              {/* Review */}
              <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed mb-4 line-clamp-4">
                &ldquo;{item.review}&rdquo;
              </p>

              {/* Product */}
              <p className={`text-xs font-bold uppercase tracking-wider mb-4 ${styles.productColor}`}>
                {item.product}
              </p>

              {/* Stars */}
              <div className="flex gap-0.5 mb-4">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    size={14}
                    className={i < item.rating ? styles.accentStarColor : "text-gray-300"}
                  />
                ))}
              </div>

              {/* Author */}
              <div className="flex items-center gap-3 pt-4 border-t border-gray-100 dark:border-gray-700">
                <div className="w-10 h-10 rounded-full overflow-hidden relative">
                  <Image
                    src={item.avatar}
                    alt={item.name}
                    fill
                    className="object-cover"
                    unoptimized
                  />
                </div>
                <span className="font-bold text-sm text-gray-900 dark:text-white">{item.name}</span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
