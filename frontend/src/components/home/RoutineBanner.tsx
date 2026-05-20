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
  themeVariant?: "default" | "eid" | "puja" | "ramadan" | "boishakh" | "blackfriday" | "christmas";
}

const themeStyles = {
  default: {
    gradient: "from-teal-600 via-emerald-600 to-green-700",
    subColor: "text-emerald-200",
    btnColor: "text-emerald-700 hover:bg-emerald-50",
    overlay: "to-teal-600/80",
  },
  eid: {
    gradient: "from-emerald-700 via-teal-800 to-emerald-950",
    subColor: "text-emerald-300",
    btnColor: "text-emerald-800 hover:bg-emerald-50",
    overlay: "to-emerald-800/80",
  },
  puja: {
    gradient: "from-red-700 via-rose-700 to-orange-800",
    subColor: "text-rose-300",
    btnColor: "text-rose-800 hover:bg-rose-50",
    overlay: "to-rose-850/80",
  },
  ramadan: {
    gradient: "from-slate-950 via-indigo-950 to-slate-900",
    subColor: "text-amber-300",
    btnColor: "bg-amber-500 text-slate-950 hover:bg-amber-400 border-none",
    overlay: "to-indigo-950/80",
  },
  boishakh: {
    gradient: "from-red-600 via-orange-600 to-yellow-600",
    subColor: "text-yellow-250",
    btnColor: "text-red-700 hover:bg-yellow-50",
    overlay: "to-orange-655/80",
  },
  blackfriday: {
    gradient: "from-gray-950 via-gray-900 to-black",
    subColor: "text-yellow-400",
    btnColor: "bg-yellow-400 text-gray-950 hover:bg-yellow-300 border-none",
    overlay: "to-gray-900/85",
  },
  christmas: {
    gradient: "from-red-800 via-red-950 to-green-900",
    subColor: "text-green-300",
    btnColor: "text-red-800 hover:bg-red-50",
    overlay: "to-red-900/80",
  },
};

export default function RoutineBanner({
  title = "Simplify Your Content Routine",
  subtitle = "Curated just for you",
  description = "Discover easy-to-follow skincare routines with products selected by experts to give you glowing, healthy skin every day.",
  ctaText = "Explore Routines",
  ctaHref = "/products",
  imageSrc = "https://images.unsplash.com/photo-1556228578-0d85b1a4d571?auto=format&fit=crop&w=600&q=80",
  imageAlign = "left",
  themeVariant = "default",
}: RoutineBannerProps) {
  const flexDirection = imageAlign === "right" ? "flex-col md:flex-row-reverse" : "flex-col md:flex-row";
  const styles = themeStyles[themeVariant] || themeStyles.default;

  return (
    <section className="py-8 lg:py-14 bg-white dark:bg-gray-950">
      <div className="container mx-auto px-4">
        <motion.div
          initial={false}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className={`relative overflow-hidden rounded-3xl bg-gradient-to-r ${styles.gradient} min-h-[320px]`}
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
              <div className={`absolute inset-0 bg-gradient-to-r from-transparent via-transparent ${styles.overlay} hidden md:block`} />
              <div className={`absolute inset-0 bg-gradient-to-b from-transparent ${styles.overlay} md:hidden`} />
            </div>

            {/* Content */}
            <div className="md:w-3/5 p-8 lg:p-12 text-white relative z-10">
              <span data-field="subtitle" className={`${styles.subColor} font-bold text-sm uppercase tracking-widest mb-3 block cursor-text`}>
                {subtitle}
              </span>
              <h2 data-field="title" className="text-3xl lg:text-4xl font-black mb-4 leading-tight cursor-text">
                {title}
              </h2>
              <p data-field="description" className="text-white/90 text-lg mb-8 max-w-lg leading-relaxed cursor-text">
                {description}
              </p>
              <Link
                data-field="ctaText"
                href={ctaHref}
                className={`inline-flex items-center gap-2 bg-white px-8 py-3.5 rounded-full font-bold text-base transition-all hover:scale-105 shadow-lg ${styles.btnColor}`}
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
