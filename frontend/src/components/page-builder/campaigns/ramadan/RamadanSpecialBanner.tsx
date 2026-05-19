"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Moon, ArrowRight } from "lucide-react";

interface RamadanSpecialBannerProps {
  title?: string;
  subtitle?: string;
  ctaText?: string;
  ctaHref?: string;
}

export default function RamadanSpecialBanner({
  title = "Ramadan Mubarak Special Deals",
  subtitle = "Get healthy diet items, organic dates, and natural energy products for Iftar & Sahri.",
  ctaText = "Shop Ramadan Essentials",
  ctaHref = "/products",
}: RamadanSpecialBannerProps) {
  return (
    <section className="py-6 lg:py-10">
      <div className="container mx-auto px-4">
        <motion.div
          initial={false}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-950 via-indigo-950 to-slate-950 p-8 lg:p-12 text-white shadow-2xl border border-amber-500/20"
        >
          <div className="relative z-10 max-w-2xl">
            <div className="inline-flex items-center gap-2 bg-amber-500/20 border border-amber-500/40 text-amber-300 px-4 py-1.5 rounded-full text-xs font-bold mb-4 uppercase tracking-widest">
              <Moon size={14} className="fill-amber-300 text-amber-300" /> Ramadan Blessings
            </div>
            <h2 className="text-3xl lg:text-5xl font-black text-amber-100 mb-4 leading-tight drop-shadow-md">
              {title}
            </h2>
            <p className="text-indigo-200/80 text-lg mb-8 max-w-lg font-medium leading-relaxed">
              {subtitle}
            </p>
            <Link
              href={ctaHref}
              className="inline-flex items-center gap-2 bg-amber-500 hover:bg-amber-600 text-slate-950 px-8 py-3.5 rounded-full font-bold text-base transition-all hover:scale-105 shadow-xl shadow-amber-500/20 w-fit"
            >
              <span>{ctaText}</span>
              <ArrowRight size={18} />
            </Link>
          </div>
          <div className="absolute top-0 right-10 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl pointer-events-none animate-pulse" />
        </motion.div>
      </div>
    </section>
  );
}
