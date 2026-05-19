"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Sparkles, ArrowRight } from "lucide-react";

interface PujaSpecialBannerProps {
  title?: string;
  subtitle?: string;
  ctaText?: string;
  ctaHref?: string;
}

export default function PujaSpecialBanner({
  title = "Happy Durga Puja Special Offer",
  subtitle = "Celebrate the festival of colors and joy with our organic selections and daily deals.",
  ctaText = "Shop Festive Specials",
  ctaHref = "/products",
}: PujaSpecialBannerProps) {
  return (
    <section className="py-6 lg:py-10">
      <div className="container mx-auto px-4">
        <motion.div
          initial={false}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-red-700 via-orange-600 to-yellow-600 p-8 lg:p-12 text-white shadow-2xl border border-red-500/20"
        >
          <div className="relative z-10 max-w-2xl">
            <div className="inline-flex items-center gap-2 bg-white/20 border border-white/30 text-white px-4 py-1.5 rounded-full text-xs font-bold mb-4 uppercase tracking-widest">
              <Sparkles size={14} className="fill-yellow-300 text-yellow-300" /> Durga Puja Celebration
            </div>
            <h2 className="text-3xl lg:text-5xl font-black mb-4 leading-tight drop-shadow-md">
              {title}
            </h2>
            <p className="text-red-500-100/90 text-lg mb-8 max-w-lg font-medium leading-relaxed">
              {subtitle}
            </p>
            <Link
              href={ctaHref}
              className="inline-flex items-center gap-2 bg-yellow-500 hover:bg-yellow-600 text-white px-8 py-3.5 rounded-full font-bold text-base transition-all hover:scale-105 shadow-xl shadow-yellow-550/20 w-fit"
            >
              <span>{ctaText}</span>
              <ArrowRight size={18} />
            </Link>
          </div>
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-yellow-500/20 rounded-full translate-y-1/3 translate-x-1/4 blur-3xl pointer-events-none" />
        </motion.div>
      </div>
    </section>
  );
}
