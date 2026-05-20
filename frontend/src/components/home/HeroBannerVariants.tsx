"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { ArrowRight, Sparkles, Moon, Star, Sun, Gift, TreePine } from "lucide-react";

interface ThemedHeroBannerProps {
  title?: string;
  subtitle?: string;
  badgeText?: string;
  description?: string;
  offerText?: string;
  offerSubtext?: string;
  ctaText?: string;
  ctaHref?: string;
  imageSrc?: string;
  textAlign?: "left" | "center" | "right";
}

interface ThemeConfig {
  gradient: string;
  badge: { bg: string; text: string; Icon: typeof Sparkles };
  ctaClasses: string;
  offerColor: string;
  accentColor: string;
  blurOrb1: string;
  blurOrb2: string;
}

const themes: Record<string, ThemeConfig> = {
  eid: {
    gradient: "bg-gradient-to-br from-emerald-600 via-teal-700 to-emerald-900",
    badge: { bg: "bg-emerald-400/20", text: "text-emerald-100", Icon: Star },
    ctaClasses: "bg-white text-emerald-700 hover:bg-emerald-50 shadow-emerald-900/20",
    offerColor: "text-emerald-700",
    accentColor: "text-emerald-200",
    blurOrb1: "bg-emerald-300/15",
    blurOrb2: "bg-teal-400/20",
  },
  puja: {
    gradient: "bg-gradient-to-br from-red-600 via-rose-700 to-orange-800",
    badge: { bg: "bg-rose-400/20", text: "text-rose-100", Icon: Sparkles },
    ctaClasses: "bg-white text-rose-700 hover:bg-rose-50 shadow-rose-900/20",
    offerColor: "text-rose-700",
    accentColor: "text-rose-200",
    blurOrb1: "bg-orange-300/15",
    blurOrb2: "bg-rose-400/20",
  },
  ramadan: {
    gradient: "bg-gradient-to-br from-slate-950 via-indigo-950 to-slate-900",
    badge: { bg: "bg-amber-400/20", text: "text-amber-200", Icon: Moon },
    ctaClasses: "bg-amber-500 text-slate-950 hover:bg-amber-400 shadow-amber-500/20",
    offerColor: "text-amber-600",
    accentColor: "text-amber-200",
    blurOrb1: "bg-amber-500/10",
    blurOrb2: "bg-indigo-400/10",
  },
  boishakh: {
    gradient: "bg-gradient-to-br from-red-600 via-orange-500 to-yellow-500",
    badge: { bg: "bg-yellow-300/20", text: "text-yellow-100", Icon: Sun },
    ctaClasses: "bg-white text-red-700 hover:bg-yellow-50 shadow-red-900/20",
    offerColor: "text-red-700",
    accentColor: "text-yellow-200",
    blurOrb1: "bg-yellow-300/20",
    blurOrb2: "bg-red-400/15",
  },
  blackfriday: {
    gradient: "bg-gradient-to-br from-gray-950 via-gray-900 to-black",
    badge: { bg: "bg-yellow-400/20", text: "text-yellow-200", Icon: Gift },
    ctaClasses: "bg-yellow-400 text-gray-950 hover:bg-yellow-300 shadow-yellow-500/20",
    offerColor: "text-yellow-500",
    accentColor: "text-yellow-300",
    blurOrb1: "bg-yellow-500/10",
    blurOrb2: "bg-gray-600/15",
  },
  christmas: {
    gradient: "bg-gradient-to-br from-red-800 via-red-900 to-green-900",
    badge: { bg: "bg-green-400/20", text: "text-green-200", Icon: TreePine },
    ctaClasses: "bg-white text-red-800 hover:bg-red-50 shadow-red-900/20",
    offerColor: "text-red-700",
    accentColor: "text-green-200",
    blurOrb1: "bg-green-500/10",
    blurOrb2: "bg-red-400/15",
  },
};

function ThemedHeroBanner({ theme, ...props }: ThemedHeroBannerProps & { theme: string }) {
  const config = themes[theme] || themes.eid;
  const BadgeIcon = config.badge.Icon;

  const {
    title = "Discover Natural Beauty",
    subtitle = "Premium skincare for your daily routine",
    badgeText = "Featured Collection",
    description = "Discover our premium collection of beauty & skincare essentials curated just for you.",
    offerText = "Up to 40% OFF",
    offerSubtext = "Limited Time",
    ctaText = "Shop Now",
    ctaHref = "/products",
    imageSrc = "https://images.unsplash.com/photo-1596462502278-27bfdc403348?auto=format&fit=crop&w=800&q=80",
    textAlign = "left",
  } = props;

  const alignClass = {
    left: "text-center md:text-left items-center md:items-start md:mx-0",
    center: "text-center md:text-center items-center md:items-center mx-auto",
    right: "text-center md:text-right items-center md:items-end ml-auto md:mr-0"
  }[textAlign] || "text-center md:text-left items-center md:items-start md:mx-0";

  return (
    <section className={`relative w-full overflow-hidden ${config.gradient}`}>
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row items-center min-h-[400px] lg:min-h-[500px] py-8 md:py-0">
          <motion.div
            initial={false}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7 }}
            className={`md:w-1/2 z-10 flex flex-col ${alignClass}`}
          >
            <div className={`inline-flex items-center gap-2 ${config.badge.bg} backdrop-blur-sm rounded-full px-4 py-1.5 mb-4 w-fit`}>
              <BadgeIcon size={16} className={config.badge.text} />
              <span className={`${config.badge.text} text-sm font-semibold`}>{badgeText}</span>
            </div>
            
            <h1 data-field="title" className="text-5xl lg:text-7xl font-black text-white mb-2 leading-[1.1] drop-shadow-lg cursor-text" dangerouslySetInnerHTML={{ __html: title }} />
            
            <p data-field="subtitle" className="text-2xl lg:text-3xl font-bold text-white/90 mb-6 drop-shadow cursor-text">
              {subtitle}
            </p>
            
            <p data-field="description" className="text-white/80 text-lg mb-8 max-w-md cursor-text">
              {description}
            </p>
            
            <Link data-field="ctaText" href={ctaHref} className={`inline-flex items-center gap-2 px-8 py-4 rounded-full font-bold text-lg transition-all hover:scale-105 shadow-xl w-fit ${config.ctaClasses}`}>
              <span>{ctaText}</span>
              <ArrowRight size={20} />
            </Link>
          </motion.div>

          <motion.div
            initial={false}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="md:w-1/2 relative mt-8 md:mt-0 flex items-center justify-center"
          >
            <div className="relative w-[300px] h-[300px] lg:w-[420px] lg:h-[420px]">
              <div className="absolute inset-0 rounded-full bg-white/10 backdrop-blur-sm" />
              <div className="absolute inset-4 rounded-full bg-white/10" />
              <div className="absolute inset-0 overflow-hidden rounded-full shadow-2xl cursor-pointer" data-field="imageSrc">
                 <Image 
                   src={imageSrc}
                   alt="Featured Products"
                   fill
                   className="object-cover"
                   priority
                 />
              </div>
            </div>
            <div className="absolute -bottom-2 right-4 md:right-12 bg-white rounded-2xl shadow-xl px-5 py-3 animate-float">
              <p className={`${config.offerColor} font-black text-lg`}>{offerText}</p>
              <p className="text-gray-500 text-sm font-medium">{offerSubtext}</p>
            </div>
          </motion.div>
        </div>
      </div>

      <div className={`absolute top-10 right-10 w-32 h-32 ${config.blurOrb1} rounded-full blur-2xl`} />
      <div className={`absolute bottom-10 left-10 w-48 h-48 ${config.blurOrb2} rounded-full blur-3xl`} />
    </section>
  );
}

export function EidHeroBanner(props: ThemedHeroBannerProps) {
  return <ThemedHeroBanner theme="eid" {...props} />;
}

export function PujaHeroBanner(props: ThemedHeroBannerProps) {
  return <ThemedHeroBanner theme="puja" {...props} />;
}

export function RamadanHeroBanner(props: ThemedHeroBannerProps) {
  return <ThemedHeroBanner theme="ramadan" {...props} />;
}

export function BoishakhHeroBanner(props: ThemedHeroBannerProps) {
  return <ThemedHeroBanner theme="boishakh" {...props} />;
}

export function BlackFridayHeroBanner(props: ThemedHeroBannerProps) {
  return <ThemedHeroBanner theme="blackfriday" {...props} />;
}

export function ChristmasHeroBanner(props: ThemedHeroBannerProps) {
  return <ThemedHeroBanner theme="christmas" {...props} />;
}
