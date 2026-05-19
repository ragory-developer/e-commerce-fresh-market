"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Sun, ArrowRight } from "lucide-react";

interface BoishakhSpecialBannerProps {
  title?: string;
  subtitle?: string;
  ctaText?: string;
  ctaHref?: string;
}

export default function BoishakhSpecialBanner({
  title = "Boishakh Special Festive Deals",
  subtitle = "Welcome the Bengali New Year with traditional items, herbal foods, and fresh seasonal collections.",
  ctaText = "Shop Utsab Offers",
  ctaHref = "/products",
}: BoishakhSpecialBannerProps) {
  return (
    <section className="py-6 lg:py-10">
      <div className="container mx-auto px-4">
        <motion.div
          initial={false}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-red-600 via-orange-500 to-yellow-400 p-8 lg:p-12 text-white shadow-2xl border border-red-400/20"
        >
          <div className="relative z-10 max-w-2xl">
            <div className="inline-flex items-center gap-2 bg-white/20 border border-white/30 text-white px-4 py-1.5 rounded-full text-xs font-bold mb-4 uppercase tracking-widest">
              <Sun size={14} className="fill-white" /> Shuvo Noboborsho
            </div>
            <h2 className="text-3xl lg:text-5xl font-black mb-4 leading-tight drop-shadow-md">
              {title}
            </h2>
            <p className="text-white/90 text-lg mb-8 max-w-lg font-medium leading-relaxed">
              {subtitle}
            </p>
            <Link
              href={ctaHref}
              className="inline-flex items-center gap-2 bg-white text-red-600 hover:bg-gray-100 px-8 py-3.5 rounded-full font-bold text-base transition-all hover:scale-105 shadow-xl shadow-white/10 w-fit"
            >
              <span>{ctaText}</span>
              <ArrowRight size={18} />
            </Link>
          </div>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-yellow-300/10 rounded-full blur-[80px] pointer-events-none" />
        </motion.div>
      </div>
    </section>
  );
}
