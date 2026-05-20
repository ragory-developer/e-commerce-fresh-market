"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { ArrowRight, Star } from "lucide-react";

interface SpecialOffersBannerProps {
  title?: string;
  subtitle?: string;
  ctaText?: string;
  ctaHref?: string;
  bgColor?: string;
  leftImageSrc?: string;
  rightImageSrc?: string;
  textAlign?: "left" | "center" | "right";
}

export default function SpecialOffersBanner({
  title = "Special Offers",
  subtitle = "Get the best deals on premium beauty products",
  ctaText = "Shop Now",
  ctaHref = "/products?sort=discount",
  bgColor = "from-blue-600 via-blue-700 to-indigo-800",
  leftImageSrc = "https://images.unsplash.com/photo-1571781926291-c477ebfd024b?auto=format&fit=crop&w=300&q=80",
  rightImageSrc = "https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?auto=format&fit=crop&w=300&q=80",
  textAlign = "center"
}: SpecialOffersBannerProps) {
  const alignClass = {
    left: "text-left md:text-left items-start",
    center: "text-center md:text-center items-center mx-auto",
    right: "text-right md:text-right items-end ml-auto"
  }[textAlign] || "text-center md:text-center items-center mx-auto";

  const justifyStars = {
    left: "justify-start",
    center: "justify-center",
    right: "justify-end"
  }[textAlign] || "justify-center";

  return (
    <section className="py-6 lg:py-10">
      <div className="container mx-auto px-4">
        <motion.div
          initial={false}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className={`relative overflow-hidden rounded-2xl sm:rounded-3xl bg-gradient-to-r ${bgColor} p-5 sm:p-8 lg:p-12`}
        >
          <div className="flex flex-col md:flex-row items-center gap-6 relative z-10">
            {/* Left Image */}
            <div data-field="leftImageSrc" className="hidden md:block w-[160px] h-[200px] relative shrink-0 cursor-pointer">
               <div className="absolute inset-0 overflow-hidden rounded-2xl shadow-lg">
                  <Image 
                    src={leftImageSrc}
                    alt="Offer product"
                    fill
                    className="object-cover"
                  />
               </div>
            </div>

            {/* Center Content */}
            <div className={`flex-1 flex flex-col ${alignClass}`}>
              <div className={`flex items-center gap-2 mb-3 w-full ${justifyStars}`}>
                <Star size={20} className="text-yellow-300 fill-yellow-300" />
                <Star size={20} className="text-yellow-300 fill-yellow-300" />
                <Star size={20} className="text-yellow-300 fill-yellow-300" />
              </div>
              
              <h2 data-field="title" className="text-xl sm:text-3xl lg:text-5xl font-black text-white mb-2 sm:mb-3 leading-tight block w-full cursor-text" dangerouslySetInnerHTML={{ __html: title }} />
              
              <p data-field="subtitle" className="text-blue-100 text-sm sm:text-base lg:text-lg mb-4 sm:mb-6 max-w-lg font-medium block w-full cursor-text">
                 {subtitle}
              </p>
              
              <Link data-field="ctaText" href={ctaHref} className="inline-flex items-center gap-2 bg-white text-blue-700 hover:bg-blue-50 px-5 sm:px-8 py-2.5 sm:py-3.5 rounded-full font-bold text-sm sm:text-base transition-all hover:scale-105 shadow-lg w-fit">
                <span>{ctaText}</span>
                <ArrowRight size={18} />
              </Link>
            </div>

            {/* Right Image */}
            <div data-field="rightImageSrc" className="hidden md:block w-[160px] h-[200px] relative shrink-0 cursor-pointer">
               <div className="absolute inset-0 overflow-hidden rounded-2xl shadow-lg">
                  <Image 
                    src={rightImageSrc}
                    alt="Offer product"
                    fill
                    className="object-cover"
                  />
               </div>
            </div>
          </div>

          {/* Background decorations */}
          <div className="absolute top-0 left-0 w-40 h-40 bg-white/5 rounded-full -translate-x-1/2 -translate-y-1/2" />
          <div className="absolute bottom-0 right-0 w-60 h-60 bg-white/5 rounded-full translate-x-1/3 translate-y-1/3" />
          <div className="absolute top-1/2 left-1/4 w-3 h-3 bg-yellow-300/40 rounded-full" />
          <div className="absolute top-1/3 right-1/4 w-2 h-2 bg-white/30 rounded-full" />
        </motion.div>
      </div>
    </section>
  );
}
