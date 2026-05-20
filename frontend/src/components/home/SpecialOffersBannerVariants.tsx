"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { ArrowRight, Star, Moon, Sparkles, Sun, Gift, TreePine } from "lucide-react";

interface ThemedSpecialOffersProps {
  title?: string;
  subtitle?: string;
  ctaText?: string;
  ctaHref?: string;
  leftImageSrc?: string;
  rightImageSrc?: string;
  textAlign?: "left" | "center" | "right";
}

interface ThemeConfig {
  gradient: string;
  badge: { bg: string; text: string; Icon: typeof Star; label: string };
  ctaClasses: string;
  textColor: string;
  subtitleColor: string;
  accentColor: string;
  blurOrb1: string;
  blurOrb2: string;
  borderClass: string;
}

const themes: Record<string, ThemeConfig> = {
  eid: {
    gradient: "from-emerald-800 via-teal-900 to-emerald-950",
    badge: { bg: "bg-emerald-500/20 border-emerald-500/40", text: "text-emerald-300", Icon: Sparkles, label: "Eid Al-Fitr Celebration" },
    ctaClasses: "bg-emerald-500 hover:bg-emerald-600 text-white shadow-emerald-500/20",
    textColor: "text-white",
    subtitleColor: "text-emerald-100/80",
    accentColor: "text-emerald-400",
    blurOrb1: "bg-emerald-500/10",
    blurOrb2: "bg-teal-500/10",
    borderClass: "border-emerald-500/20",
  },
  puja: {
    gradient: "from-red-700 via-rose-800 to-orange-900",
    badge: { bg: "bg-rose-500/20 border-rose-500/40", text: "text-rose-200", Icon: Sparkles, label: "Durga Puja Festive Offer" },
    ctaClasses: "bg-orange-500 hover:bg-orange-600 text-white shadow-orange-500/20",
    textColor: "text-white",
    subtitleColor: "text-rose-100/80",
    accentColor: "text-yellow-400",
    blurOrb1: "bg-orange-500/10",
    blurOrb2: "bg-rose-500/10",
    borderClass: "border-rose-500/20",
  },
  ramadan: {
    gradient: "from-slate-955 via-indigo-950 to-slate-950",
    badge: { bg: "bg-amber-500/20 border-amber-500/40", text: "text-amber-300", Icon: Moon, label: "Ramadan Blessings" },
    ctaClasses: "bg-amber-500 hover:bg-amber-600 text-slate-950 shadow-amber-500/20",
    textColor: "text-amber-50",
    subtitleColor: "text-indigo-200/85",
    accentColor: "text-amber-400",
    blurOrb1: "bg-amber-500/10",
    blurOrb2: "bg-indigo-400/10",
    borderClass: "border-amber-500/20",
  },
  boishakh: {
    gradient: "from-red-600 via-orange-600 to-yellow-600",
    badge: { bg: "bg-yellow-400/20 border-yellow-400/40", text: "text-yellow-200", Icon: Sun, label: "Pohela Boishakh Festive" },
    ctaClasses: "bg-white hover:bg-yellow-50 text-red-700 shadow-white/10",
    textColor: "text-white",
    subtitleColor: "text-yellow-50/90",
    accentColor: "text-yellow-300",
    blurOrb1: "bg-yellow-400/20",
    blurOrb2: "bg-red-400/15",
    borderClass: "border-yellow-400/20",
  },
  blackfriday: {
    gradient: "from-gray-950 via-gray-900 to-black",
    badge: { bg: "bg-yellow-400/20 border-yellow-400/40", text: "text-yellow-200", Icon: Gift, label: "Black Friday Mega Deals" },
    ctaClasses: "bg-yellow-400 hover:bg-yellow-300 text-gray-950 shadow-yellow-500/20",
    textColor: "text-white",
    subtitleColor: "text-gray-400",
    accentColor: "text-yellow-400",
    blurOrb1: "bg-yellow-500/10",
    blurOrb2: "bg-gray-600/10",
    borderClass: "border-gray-800",
  },
  christmas: {
    gradient: "from-red-800 via-red-950 to-green-950",
    badge: { bg: "bg-green-500/20 border-green-500/40", text: "text-green-300", Icon: TreePine, label: "Christmas & New Year Offer" },
    ctaClasses: "bg-white hover:bg-red-50 text-red-850 shadow-white/10",
    textColor: "text-white",
    subtitleColor: "text-green-100/85",
    accentColor: "text-red-400",
    blurOrb1: "bg-green-500/10",
    blurOrb2: "bg-red-500/10",
    borderClass: "border-green-500/20",
  },
};

function ThemedSpecialOffersBanner({ theme, ...props }: ThemedSpecialOffersProps & { theme: string }) {
  const config = themes[theme] || themes.eid;
  const BadgeIcon = config.badge.Icon;

  const {
    title = "Special Offer",
    subtitle = "Get special festive discounts on our premium organic products.",
    ctaText = "Shop Now",
    ctaHref = "/products",
    leftImageSrc,
    rightImageSrc,
    textAlign = "left",
  } = props;

  const alignClass = {
    left: "text-left md:text-left items-start",
    center: "text-center md:text-center items-center mx-auto",
    right: "text-right md:text-right items-end ml-auto"
  }[textAlign] || "text-left md:text-left items-start";

  const justifyStars = {
    left: "justify-start",
    center: "justify-center",
    right: "justify-end"
  }[textAlign] || "justify-start";

  return (
    <section className="py-6 lg:py-10">
      <div className="container mx-auto px-4">
        <motion.div
          initial={false}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className={`relative overflow-hidden rounded-3xl bg-gradient-to-br ${config.gradient} p-8 lg:p-12 border ${config.borderClass} shadow-2xl`}
        >
          <div className="flex flex-col md:flex-row items-center gap-8 relative z-10">
            {/* Left Image (Optional) */}
            {leftImageSrc && (
              <div data-field="leftImageSrc" className="hidden md:block w-[160px] h-[200px] relative shrink-0 cursor-pointer">
                <div className="absolute inset-0 overflow-hidden rounded-2xl shadow-lg border border-white/10">
                  <Image 
                    src={leftImageSrc}
                    alt="Festive Product Left"
                    fill
                    className="object-cover"
                  />
                </div>
              </div>
            )}

            {/* Center Content */}
            <div className={`flex-1 flex flex-col ${alignClass}`}>
              <div className={`inline-flex items-center gap-2 border px-4 py-1.5 rounded-full text-xs font-bold mb-4 uppercase tracking-widest ${config.badge.bg} ${config.badge.text}`}>
                <BadgeIcon size={14} className="animate-pulse" />
                <span>{config.badge.label}</span>
              </div>
              
              <h2 data-field="title" className={`text-3xl lg:text-5xl font-black mb-4 leading-tight cursor-text ${config.textColor} drop-shadow-md`} dangerouslySetInnerHTML={{ __html: title }} />
              
              <p data-field="subtitle" className={`text-lg mb-8 max-w-lg font-medium leading-relaxed cursor-text ${config.subtitleColor}`}>
                {subtitle}
              </p>
              
              <Link data-field="ctaText" href={ctaHref} className={`inline-flex items-center gap-2 px-8 py-3.5 rounded-full font-bold text-base transition-all hover:scale-105 shadow-xl w-fit ${config.ctaClasses}`}>
                <span>{ctaText}</span>
                <ArrowRight size={18} />
              </Link>
            </div>

            {/* Right Image (Optional) */}
            {rightImageSrc && (
              <div data-field="rightImageSrc" className="hidden md:block w-[160px] h-[200px] relative shrink-0 cursor-pointer">
                <div className="absolute inset-0 overflow-hidden rounded-2xl shadow-lg border border-white/10">
                  <Image 
                    src={rightImageSrc}
                    alt="Festive Product Right"
                    fill
                    className="object-cover"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Background decorations */}
          <div className={`absolute top-0 right-10 w-80 h-80 ${config.blurOrb1} rounded-full blur-3xl pointer-events-none animate-pulse`} />
          <div className={`absolute bottom-0 left-10 w-60 h-60 ${config.blurOrb2} rounded-full blur-3xl pointer-events-none`} />
        </motion.div>
      </div>
    </section>
  );
}

export function EidSpecialOffersBanner(props: ThemedSpecialOffersProps) {
  return <ThemedSpecialOffersBanner theme="eid" {...props} />;
}

export function PujaSpecialOffersBanner(props: ThemedSpecialOffersProps) {
  return <ThemedSpecialOffersBanner theme="puja" {...props} />;
}

export function RamadanSpecialOffersBanner(props: ThemedSpecialOffersProps) {
  return <ThemedSpecialOffersBanner theme="ramadan" {...props} />;
}

export function BoishakhSpecialOffersBanner(props: ThemedSpecialOffersProps) {
  return <ThemedSpecialOffersBanner theme="boishakh" {...props} />;
}

export function BlackFridaySpecialOffersBanner(props: ThemedSpecialOffersProps) {
  return <ThemedSpecialOffersBanner theme="blackfriday" {...props} />;
}

export function ChristmasSpecialOffersBanner(props: ThemedSpecialOffersProps) {
  return <ThemedSpecialOffersBanner theme="christmas" {...props} />;
}
