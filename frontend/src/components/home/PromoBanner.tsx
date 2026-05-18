"use client";

import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";

interface PromoBannerProps {
  title: string;
  subtitle: string;
  discountText: string;
  imageSrc: string;
  href: string;
  bgColor: string; // e.g., "bg-orange-100 dark:bg-orange-900/30"
  textColor: string; // e.g., "text-orange-600 dark:text-orange-400"
}

export default function PromoBanner({
  title,
  subtitle,
  discountText,
  imageSrc,
  href,
  bgColor,
  textColor,
}: PromoBannerProps) {
  return (
    <div className={`relative overflow-hidden rounded-3xl ${bgColor} p-8 lg:p-10 flex flex-col justify-center h-full min-h-[300px] group transition-all duration-300 hover:shadow-xl`}>
      <div className="relative z-10 max-w-[60%]">
        <span className={`inline-block font-black px-4 py-1.5 rounded-full text-xs uppercase tracking-widest mb-4 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm ${textColor}`}>
          {discountText}
        </span>
        <h3 className="text-2xl lg:text-3xl font-black text-gray-900 dark:text-white mb-2 leading-tight">
          {title}
        </h3>
        <p className="text-gray-600 dark:text-gray-300 mb-6 font-medium">
          {subtitle}
        </p>
        <Link href={href} className="inline-flex items-center gap-2 font-bold hover:underline transition-all">
          Shop Now <ArrowRight size={18} />
        </Link>
      </div>

      <div className="absolute right-0 bottom-0 top-0 w-[50%] overflow-hidden flex items-end justify-end">
         {/* Using unoptimized for external URLs or generic remote patterns since we don't know the user's next.config.js entirely */}
        <Image 
          src={imageSrc} 
          alt={title} 
          fill
          className="object-contain object-right-bottom group-hover:scale-105 transition-transform duration-500 translate-x-4 translate-y-4 lg:translate-x-0 lg:translate-y-0"
          unoptimized
        />
      </div>
    </div>
  );
}
