"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Sparkles, ArrowRight } from "lucide-react";

interface EidSpecialBannerProps {
  title?: string;
  subtitle?: string;
  ctaText?: string;
  ctaHref?: string;
}

export default function EidSpecialBanner({
  title = "Eid Mubarak Special Offer",
  subtitle = "Enjoy special festival discounts on organic and natural products.",
  ctaText = "Shop Eid Collection",
  ctaHref = "/products",
}: EidSpecialBannerProps) {
  return (
    <section className="py-6 lg:py-10">
      <div className="container mx-auto px-4">
        <motion.div
          initial={false}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-emerald-800 via-teal-900 to-emerald-955 p-8 lg:p-12 text-white shadow-2xl border border-emerald-500/20"
        >
          <div className="relative z-10 max-w-2xl">
            <div className="inline-flex items-center gap-2 bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 px-4 py-1.5 rounded-full text-xs font-bold mb-4 uppercase tracking-widest">
              <Sparkles size={14} className="fill-emerald-400 text-emerald-400" /> Eid Al-Fitr Celebration
            </div>
            <h2 className="text-3xl lg:text-5xl font-black mb-4 leading-tight drop-shadow-md">
              {title}
            </h2>
            <p className="text-emerald-100/80 text-lg mb-8 max-w-lg font-medium leading-relaxed">
              {subtitle}
            </p>
            <Link
              href={ctaHref}
              className="inline-flex items-center gap-2 bg-emerald-500 hover:bg-emerald-600 text-white px-8 py-3.5 rounded-full font-bold text-base transition-all hover:scale-105 shadow-xl shadow-emerald-500/20 w-fit"
            >
              <span>{ctaText}</span>
              <ArrowRight size={18} />
            </Link>
          </div>
          <div className="absolute top-0 right-0 w-80 h-80 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/3 blur-3xl pointer-events-none" />
        </motion.div>
      </div>
    </section>
  );
}
