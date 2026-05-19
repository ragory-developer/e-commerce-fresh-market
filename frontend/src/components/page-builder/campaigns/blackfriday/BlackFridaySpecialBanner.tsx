"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Flame, ArrowRight } from "lucide-react";

interface BlackFridaySpecialBannerProps {
  title?: string;
  subtitle?: string;
  ctaText?: string;
  ctaHref?: string;
}

export default function BlackFridaySpecialBanner({
  title = "Black Friday Mega Clearance",
  subtitle = "Prices sliced like never before. Exclusive midnight drops and flash sales starting right now!",
  ctaText = "Unlock Midnight Deals",
  ctaHref = "/products",
}: BlackFridaySpecialBannerProps) {
  return (
    <section className="py-6 lg:py-10">
      <div className="container mx-auto px-4">
        <motion.div
          initial={false}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="relative overflow-hidden rounded-3xl bg-black p-8 lg:p-12 text-white shadow-2xl border-2 border-red-600/80"
        >
          <div className="relative z-10 max-w-2xl">
            <div className="inline-flex items-center gap-2 bg-red-600/20 border border-red-600 text-red-500 px-4 py-1.5 rounded-full text-xs font-bold mb-4 uppercase tracking-widest animate-pulse">
              <Flame size={14} /> MAXIMUM DISCOUNTS
            </div>
            <h2 className="text-3xl lg:text-5xl font-black mb-4 leading-tight tracking-tight drop-shadow-md">
              {title}
            </h2>
            <p className="text-gray-400 text-lg mb-8 max-w-lg font-medium leading-relaxed">
              {subtitle}
            </p>
            <Link
              href={ctaHref}
              className="inline-flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-8 py-3.5 rounded-full font-bold text-base transition-all hover:scale-105 shadow-xl shadow-red-600/30 w-fit"
            >
              <span>{ctaText}</span>
              <ArrowRight size={18} />
            </Link>
          </div>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[350px] h-[350px] bg-red-600/10 rounded-full blur-[100px] pointer-events-none" />
        </motion.div>
      </div>
    </section>
  );
}
