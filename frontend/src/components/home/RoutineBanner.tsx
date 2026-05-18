"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";

interface RoutineBannerProps {
  title?: string;
  subtitle?: string;
  description?: string;
  ctaText?: string;
  ctaHref?: string;
  imageSrc?: string;
  imageAlign?: "left" | "right";
}

export default function RoutineBanner({
  title = "Simplify Your Content Routine",
  subtitle = "Curated just for you",
  description = "Discover easy-to-follow skincare routines with products selected by experts to give you glowing, healthy skin every day.",
  ctaText = "Explore Routines",
  ctaHref = "/products",
  imageSrc = "https://images.unsplash.com/photo-1556228578-0d85b1a4d571?auto=format&fit=crop&w=600&q=80",
  imageAlign = "left"
}: RoutineBannerProps) {
  const flexDirection = imageAlign === "right" ? "flex-col md:flex-row-reverse" : "flex-col md:flex-row";

  return (
    <section className="py-8 lg:py-14 bg-white dark:bg-gray-950">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-teal-600 via-emerald-600 to-green-700 min-h-[320px]"
        >
          <div className={`flex ${flexDirection} items-center`}>
            {/* Image */}
            <div data-field="imageSrc" className="md:w-2/5 relative h-[250px] md:h-[380px] w-full cursor-pointer">
              <Image
                src={imageSrc}
                alt="Routine Products"
                fill
                className="object-cover"
                unoptimized
              />
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-transparent to-teal-600/80 hidden md:block" />
              <div className="absolute inset-0 bg-gradient-to-b from-transparent to-teal-600/80 md:hidden" />
            </div>

            {/* Content */}
            <div className="md:w-3/5 p-8 lg:p-12 text-white relative z-10">
              <span data-field="subtitle" className="text-emerald-200 font-bold text-sm uppercase tracking-widest mb-3 block cursor-text">
                {subtitle}
              </span>
              <h2 data-field="title" className="text-3xl lg:text-4xl font-black mb-4 leading-tight cursor-text">
                {title}
              </h2>
              <p data-field="description" className="text-emerald-100 text-lg mb-8 max-w-lg leading-relaxed cursor-text">
                {description}
              </p>
              <Link
                data-field="ctaText"
                href={ctaHref}
                className="inline-flex items-center gap-2 bg-white text-emerald-700 hover:bg-emerald-50 px-8 py-3.5 rounded-full font-bold text-base transition-all hover:scale-105 shadow-lg"
              >
                {ctaText} <ArrowRight size={18} />
              </Link>
            </div>
          </div>

          {/* Decorative elements */}
          <div className="absolute top-6 right-6 w-20 h-20 border-2 border-white/10 rounded-full" />
          <div className="absolute bottom-6 right-20 w-12 h-12 border-2 border-white/10 rounded-full" />
        </motion.div>
      </div>
    </section>
  );
}
