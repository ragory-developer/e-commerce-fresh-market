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
}

export default function TestimonialSection({
  title = "Real Results, Real Beauty",
  subtitle = "See what our customers are saying",
  testimonials = [],
}: TestimonialSectionProps) {
  return (
    <section className="py-12 lg:py-20 bg-gradient-to-b from-rose-50 via-pink-50 to-white dark:from-gray-900 dark:via-gray-900 dark:to-gray-950">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <motion.div
            initial={false}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <span className="inline-flex items-center gap-2 bg-rose-100 dark:bg-rose-900/30 text-rose-600 dark:text-rose-400 px-4 py-1.5 rounded-full text-sm font-bold mb-4">
              <Star size={14} className="fill-rose-500 text-rose-500" /> Customer Reviews
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
              <Quote size={24} className="text-rose-200 dark:text-rose-800 mb-3" />

              {/* Review */}
              <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed mb-4 line-clamp-4">
                &ldquo;{item.review}&rdquo;
              </p>

              {/* Product */}
              <p className="text-xs text-rose-500 font-bold uppercase tracking-wider mb-4">
                {item.product}
              </p>

              {/* Stars */}
              <div className="flex gap-0.5 mb-4">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    size={14}
                    className={i < item.rating ? "text-amber-400 fill-amber-400" : "text-gray-300"}
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
