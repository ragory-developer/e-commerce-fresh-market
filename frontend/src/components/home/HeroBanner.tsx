"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { ArrowRight, Sparkles } from "lucide-react";

interface HeroBannerProps {
  title?: string;
  subtitle?: string;
  ctaText?: string;
  ctaHref?: string;
  imageSrc?: string;
  textAlign?: "left" | "center" | "right";
}

export default function HeroBanner({
  title = "Discover Natural Beauty",
  subtitle = "Premium skincare for your daily routine",
  ctaText = "Shop Now",
  ctaHref = "/products",
  imageSrc = "https://images.unsplash.com/photo-1596462502278-27bfdc403348?auto=format&fit=crop&w=800&q=80",
  textAlign = "left"
}: HeroBannerProps) {
  const alignClass = {
    left: "text-center md:text-left items-center md:items-start md:mx-0",
    center: "text-center md:text-center items-center md:items-center mx-auto",
    right: "text-center md:text-right items-center md:items-end ml-auto md:mr-0"
  }[textAlign] || "text-center md:text-left items-center md:items-start md:mx-0";

  return (
    <section className="relative w-full overflow-hidden bg-gradient-to-br from-orange-400 via-amber-400 to-orange-500 animate-gradient">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row items-center min-h-[400px] lg:min-h-[500px] py-8 md:py-0">
          {/* Left Content */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7 }}
            className={`md:w-1/2 z-10 flex flex-col ${alignClass}`}
          >
            <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm rounded-full px-4 py-1.5 mb-4 w-fit">
              <Sparkles size={16} className="text-white" />
              <span className="text-white text-sm font-semibold">New Collection 2026</span>
            </div>
            
            <h1 data-field="title" className="text-5xl lg:text-7xl font-black text-white mb-2 leading-[1.1] drop-shadow-lg cursor-text" dangerouslySetInnerHTML={{ __html: title }} />
            
            <p data-field="subtitle" className="text-2xl lg:text-3xl font-bold text-white/90 mb-6 drop-shadow cursor-text">
              {subtitle}
            </p>
            
            <p className="text-white/80 text-lg mb-8 max-w-md">
              Discover our premium collection of beauty & skincare essentials curated just for you.
            </p>
            
            <Link data-field="ctaText" href={ctaHref} className="inline-flex items-center gap-2 bg-white text-orange-600 hover:bg-orange-50 px-8 py-4 rounded-full font-bold text-lg transition-all hover:scale-105 shadow-xl shadow-black/10 w-fit">
              <span>{ctaText}</span>
              <ArrowRight size={20} />
            </Link>
          </motion.div>
 
          {/* Right Image */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="md:w-1/2 relative mt-8 md:mt-0 flex items-center justify-center"
          >
            <div className="relative w-[300px] h-[300px] lg:w-[420px] lg:h-[420px]">
              {/* Decorative circle */}
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
            {/* Floating badge */}
            <div className="absolute -bottom-2 right-4 md:right-12 bg-white rounded-2xl shadow-xl px-5 py-3 animate-float">
              <p className="text-orange-600 font-black text-lg">Up to 40% OFF</p>
              <p className="text-gray-500 text-sm font-medium">Limited Time</p>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Background decorative elements */}
      <div className="absolute top-10 right-10 w-32 h-32 bg-white/10 rounded-full blur-2xl" />
      <div className="absolute bottom-10 left-10 w-48 h-48 bg-yellow-300/20 rounded-full blur-3xl" />
    </section>
  );
}
