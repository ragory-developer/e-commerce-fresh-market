"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";
import { ArrowRight } from "lucide-react";

const HeroSlides = [
  {
    title: "Fresh Groceries",
    subtitle: "Delivered in 30 Minutes",
    description: "Get farm-fresh vegetables, organic fruits, and daily essentials delivered right to your doorstep.",
    cta: "Shop Now",
    href: "/products",
    image: "https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&q=80&w=1600",
    gradient: "from-emerald-900/90 via-emerald-800/80 to-transparent",
  },
  {
    title: "Weekend Super Sale",
    subtitle: "Up to 50% OFF",
    description: "Stock up your pantry with our exclusive weekend discounts on premium grocery items.",
    cta: "View Offers",
    href: "/categories",
    image: "https://images.unsplash.com/photo-1610832958506-aa56368176cf?auto=format&fit=crop&q=80&w=1600",
    gradient: "from-orange-900/90 via-orange-800/80 to-transparent",
  },
  {
    title: "100% Organic",
    subtitle: "Healthy & Fresh",
    description: "Certified organic produce sourced directly from local farmers to ensure maximum freshness.",
    cta: "Explore Organic",
    href: "/categories/organic",
    image: "https://images.unsplash.com/photo-1628088062854-d1870b4553da?auto=format&fit=crop&q=80&w=1600",
    gradient: "from-blue-900/90 via-blue-800/80 to-transparent",
  }
];

export default function HeroSlider() {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true }, [Autoplay({ delay: 5000, stopOnInteraction: false })]);
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    if (!emblaApi) return;
    emblaApi.on("select", () => setCurrentSlide(emblaApi.selectedScrollSnap()));
  }, [emblaApi]);

  return (
    <section className="relative bg-gray-900 w-full xl:max-w-7xl xl:mx-auto xl:mt-6 xl:rounded-[2rem] overflow-hidden">
      {/* 
        Fixing cropping issue: 
        We use an explicit height (h-[500px] or h-[600px] on desktop) 
        and Image object-cover so it scales nicely without weird blank spaces 
        or content getting chopped off ungracefully.
      */}
      <div className="overflow-hidden" ref={emblaRef}>
        <div className="flex touch-pan-y">
          {HeroSlides.map((slide, index) => (
            <div key={index} className="flex-[0_0_100%] min-w-0 relative h-[450px] lg:h-[550px]">
              
              {/* Background Image */}
              <Image 
                src={slide.image} 
                alt={slide.title}
                fill
                priority={index === 0}
                className="object-cover object-center"
                unoptimized
              />
              
              {/* Gradient Overlay for Readability */}
              <div className={`absolute inset-0 bg-gradient-to-r ${slide.gradient} sm:w-3/4 lg:w-2/3`}></div>
              
              {/* Content */}
              <div className="absolute inset-0 flex items-center">
                <div className="container mx-auto px-6 lg:px-12">
                  <div className="max-w-xl text-white">
                    <motion.div
                      initial={false}
                      animate={currentSlide === index ? { opacity: 1, y: 0 } : {}}
                      transition={{ duration: 0.5, delay: 0.2 }}
                    >
                      <h1 className="text-4xl lg:text-6xl font-black mb-2 leading-tight drop-shadow-lg">
                        {slide.title}
                      </h1>
                      <h2 className="text-2xl lg:text-4xl font-bold text-emerald-300 drop-shadow-md mb-4 leading-tight">
                        {slide.subtitle}
                      </h2>
                      <p className="text-lg lg:text-xl text-gray-200 mb-8 max-w-lg drop-shadow">
                        {slide.description}
                      </p>
                      
                      <Link 
                        href={slide.href} 
                        className="inline-flex items-center gap-2 bg-emerald-500 hover:bg-emerald-600 text-white px-8 py-4 rounded-full font-bold text-lg transition-transform hover:scale-105 shadow-xl shadow-emerald-500/30"
                      >
                        {slide.cta} <ArrowRight size={20} />
                      </Link>
                    </motion.div>
                  </div>
                </div>
              </div>

            </div>
          ))}
        </div>
      </div>

      {/* Slide Indicators */}
      <div className="absolute bottom-6 left-0 right-0 flex justify-center gap-2 z-20">
        {HeroSlides.map((_, idx) => (
          <button
            key={idx}
            onClick={() => emblaApi?.scrollTo(idx)}
            className={`transition-all duration-300 rounded-full h-2 ${
              currentSlide === idx ? "w-8 bg-emerald-500" : "w-2 bg-white/50 hover:bg-white/80"
            }`}
            aria-label={`Go to slide ${idx + 1}`}
          />
        ))}
      </div>
    </section>
  );
}
