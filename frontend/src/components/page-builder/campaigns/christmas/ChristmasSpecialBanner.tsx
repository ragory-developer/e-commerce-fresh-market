"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Gift, ArrowRight } from "lucide-react";

interface ChristmasSpecialBannerProps {
  title?: string;
  subtitle?: string;
  ctaText?: string;
  ctaHref?: string;
}

export default function ChristmasSpecialBanner({
  title = "Merry Christmas & Happy New Year Offers",
  subtitle = "Explore winter gift hampers, special body treats, and cozy beauty routines with warm festive scents.",
  ctaText = "Browse Christmas Guide",
  ctaHref = "/products",
}: ChristmasSpecialBannerProps) {
  return (
    <section className="py-6 lg:py-10">
      <div className="container mx-auto px-4">
        <motion.div
          initial={false}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-red-800 via-emerald-800 to-red-900 p-8 lg:p-12 text-white shadow-2xl border border-white/10"
        >
          <div className="relative z-10 max-w-2xl">
            <div className="inline-flex items-center gap-2 bg-white/20 border border-white/30 text-white px-4 py-1.5 rounded-full text-xs font-bold mb-4 uppercase tracking-widest">
              <Gift size={14} className="fill-white" /> Christmas Blessings
            </div>
            <h2 className="text-3xl lg:text-5xl font-black mb-4 leading-tight drop-shadow-md">
              {title}
            </h2>
            <p className="text-white/80 text-lg mb-8 max-w-lg font-medium leading-relaxed">
              {subtitle}
            </p>
            <Link
              href={ctaHref}
              className="inline-flex items-center gap-2 bg-white text-emerald-800 hover:bg-gray-100 px-8 py-3.5 rounded-full font-bold text-base transition-all hover:scale-105 shadow-xl shadow-white/10 w-fit"
            >
              <span>{ctaText}</span>
              <ArrowRight size={18} />
            </Link>
          </div>
          <div className="absolute top-0 right-1/4 w-48 h-48 bg-white/5 rounded-full blur-2xl pointer-events-none" />
          <div className="absolute bottom-0 left-1/4 w-60 h-60 bg-white/5 rounded-full blur-2xl pointer-events-none" />
        </motion.div>
      </div>
    </section>
  );
}
