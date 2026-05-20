"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { ArrowRight, CheckCircle2 } from "lucide-react";

interface ConsultationBannerProps {
  title?: string;
  subtitle?: string;
  badgeText?: string;
  features?: string[];
  ctaText?: string;
  ctaHref?: string;
  imageSrc?: string;
  imageAlign?: "left" | "right";
  themeVariant?: "default" | "eid" | "puja" | "ramadan" | "boishakh" | "blackfriday" | "christmas";
}

const themeStyles = {
  default: {
    badgeBg: "bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400",
    checkColor: "text-emerald-500",
    btnClass: "bg-emerald-600 hover:bg-emerald-700 text-white shadow-emerald-600/20",
  },
  eid: {
    badgeBg: "bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-455",
    checkColor: "text-emerald-600",
    btnClass: "bg-emerald-600 hover:bg-emerald-700 text-white shadow-emerald-600/20",
  },
  puja: {
    badgeBg: "bg-rose-50 dark:bg-rose-900/30 text-rose-700 dark:text-rose-455",
    checkColor: "text-rose-600",
    btnClass: "bg-rose-600 hover:bg-rose-700 text-white shadow-rose-600/20",
  },
  ramadan: {
    badgeBg: "bg-amber-50 dark:bg-amber-900/30 text-amber-700 dark:text-amber-455",
    checkColor: "text-amber-500",
    btnClass: "bg-amber-500 hover:bg-amber-600 text-slate-950 shadow-amber-500/20",
  },
  boishakh: {
    badgeBg: "bg-orange-50 dark:bg-orange-900/30 text-orange-700 dark:text-orange-455",
    checkColor: "text-orange-600",
    btnClass: "bg-orange-650 hover:bg-orange-700 text-white shadow-orange-600/20",
  },
  blackfriday: {
    badgeBg: "bg-yellow-450/20 text-yellow-600 dark:text-yellow-400",
    checkColor: "text-yellow-500",
    btnClass: "bg-yellow-450 hover:bg-yellow-400 text-gray-950 shadow-yellow-500/20",
  },
  christmas: {
    badgeBg: "bg-green-50 dark:bg-green-900/30 text-green-700 dark:text-green-455",
    checkColor: "text-red-500",
    btnClass: "bg-red-650 hover:bg-red-700 text-white shadow-red-600/20",
  },
};

export default function ConsultationBanner({
  title = "Doctor's Skincare Consultation",
  subtitle = "Get personalized skincare advice from certified dermatologists",
  badgeText = "Expert Advice",
  features = [
    "Personalized skin analysis",
    "Custom routine recommendations",
    "Expert product matching",
  ],
  ctaText = "Book Now",
  ctaHref = "/consultation",
  imageSrc = "https://images.unsplash.com/photo-1559599101-f09722fb4948?auto=format&fit=crop&w=800&q=80",
  imageAlign = "right",
  themeVariant = "default",
}: ConsultationBannerProps) {
  const flexDirection = imageAlign === "left" ? "flex-col md:flex-row-reverse" : "flex-col md:flex-row";
  const styles = themeStyles[themeVariant] || themeStyles.default;

  return (
    <section className="py-8 lg:py-14 bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4">
        <motion.div
          initial={false}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="bg-white dark:bg-gray-800 rounded-3xl overflow-hidden shadow-xl border border-gray-100 dark:border-gray-700"
        >
          <div className={`flex ${flexDirection}`}>
            {/* Content Side */}
            <div className="md:w-1/2 p-8 lg:p-12 flex flex-col justify-center">
              <span className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-bold w-fit mb-6 ${styles.badgeBg}`}>
                <CheckCircle2 size={16} /> {badgeText}
              </span>
              <h2 data-field="title" className="text-3xl lg:text-4xl font-black text-gray-900 dark:text-white mb-4 leading-tight cursor-text">
                {title}
              </h2>
              <p data-field="subtitle" className="text-gray-600 dark:text-gray-300 text-lg mb-6 leading-relaxed cursor-text">
                {subtitle}
              </p>

              <ul className="space-y-3 mb-8">
                {features.map((feature, idx) => (
                  <li key={idx} className="flex items-center gap-3 text-gray-700 dark:text-gray-300">
                    <CheckCircle2 size={18} className={`${styles.checkColor} shrink-0`} />
                    <span className="font-medium">{feature}</span>
                  </li>
                ))}
              </ul>

              <Link
                data-field="ctaText"
                href={ctaHref}
                className={`inline-flex items-center gap-2 px-8 py-3.5 rounded-full font-bold text-base transition-all hover:scale-105 shadow-lg w-fit ${styles.btnClass}`}
              >
                {ctaText} <ArrowRight size={18} />
              </Link>
            </div>

            {/* Image Side */}
            <div data-field="imageSrc" className="md:w-1/2 relative min-h-[300px] md:min-h-[400px] cursor-pointer">
              <Image
                src={imageSrc}
                alt="Skincare Consultation"
                fill
                className="object-cover"
                unoptimized
              />
              {/* Gradient overlay on mobile */}
              <div className="absolute inset-0 bg-gradient-to-t from-white/50 via-transparent to-transparent md:hidden" />
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
