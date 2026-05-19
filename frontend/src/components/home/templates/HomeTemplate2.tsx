"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import ProductShowcase from "../ProductShowcase";
import TestimonialSection from "../TestimonialSection";
import EditableSection from "../../admin/HomeBuilder/wrappers/EditableSection";

export default function HomeTemplate2({ 
  allProducts, 
  data,
  isEditing = false,
  activeSection,
  onSectionClick
}: { 
  allProducts: any[], 
  data?: any,
  isEditing?: boolean,
  activeSection?: string,
  onSectionClick?: (section: string) => void
}) {
  const heroData = data?.hero || { 
    title: "Pure. Simple. Effective.", 
    subtitle: "The Essentials", 
    imageSrc: "https://images.unsplash.com/photo-1615397323812-4217117f7b32?auto=format&fit=crop&w=1920&q=80",
    ctaText: "Shop Collection",
    ctaHref: "/products"
  };
  
  const storyData = data?.story || {
    title: "Embrace natural ingredients", 
    text: "We believe in the power of nature. Our products are formulated with the highest quality organic ingredients, free from harsh chemicals and artificial fragrances. Just pure, skin-loving goodness.", 
    imageSrc: "https://images.unsplash.com/photo-1556228578-0d85b1a4d571?auto=format&fit=crop&w=800&q=80",
    ctaText: "Learn our story",
    ctaHref: "/about"
  };

  // Filter products if showcaseCategoryId is set and not "all"
  let showcaseProducts = allProducts;
  if (data?.showcaseCategoryId && data.showcaseCategoryId !== "all") {
    showcaseProducts = allProducts.filter(p => p.categoryId === data.showcaseCategoryId || p.category?.id === data.showcaseCategoryId);
  }

  const handleSectionClick = (sectionId: string) => {
    if (onSectionClick) onSectionClick(sectionId);
  };

  // Minimalist Hero
  return (
    <>
      {/* Minimalist Hero */}
      <EditableSection sectionId="hero" name="Hero Section" isEditing={isEditing} isActive={activeSection === "hero"} onClick={handleSectionClick}>
        <section className="relative w-full h-[80vh] min-h-[600px] flex items-center justify-center bg-[#f8f8f8] overflow-hidden">
          <div className="absolute inset-0 z-0">
            <Image
              src={heroData.imageSrc}
              alt="Minimalist Skincare"
              fill
              className="object-cover opacity-60"
              priority
            />
          </div>
          <div className="container mx-auto px-4 relative z-10 text-center">
            <motion.div
              initial={false}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
            >
              <span className="text-gray-500 uppercase tracking-[0.3em] text-sm font-semibold mb-4 block">
                {heroData.subtitle}
              </span>
              
              <h1 className="text-5xl md:text-7xl font-light text-gray-900 mb-6 tracking-tight block" dangerouslySetInnerHTML={{ __html: heroData.title }} />
              
              <p className="text-gray-600 max-w-xl mx-auto text-lg mb-10">
                Discover a curated collection of skincare essentials designed to nourish your natural beauty without the clutter.
              </p>
              
              <Link href={heroData.ctaHref || "/products"} className="inline-flex items-center gap-2 bg-gray-900 text-white px-10 py-4 rounded-full font-medium transition-all hover:bg-gray-800 hover:-translate-y-1">
                <span>{heroData.ctaText || "Shop Collection"}</span>
              </Link>
            </motion.div>
          </div>
        </section>
      </EditableSection>

      {/* Minimal New Arrivals / Featured (Custom implementation for minimal feel) */}
      <EditableSection sectionId="productShowcase" name="Product Showcase" isEditing={isEditing} isActive={activeSection === "productShowcase"} onClick={handleSectionClick}>
        <section className="py-24 bg-white">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl font-light mb-16 tracking-tight text-gray-900">Curated Favorites</h2>
            <ProductShowcase products={showcaseProducts} title="" subtitle="" showCategoryFilter={false} />
          </div>
        </section>
      </EditableSection>

      {/* Two Column Feature */}
      <EditableSection sectionId="story" name="Story Section" isEditing={isEditing} isActive={activeSection === "story"} onClick={handleSectionClick}>
        <section className="py-20 bg-[#fbf9f6]">
          <div className="container mx-auto px-4">
            <div className="flex flex-col md:flex-row items-center gap-12">
              <div className="w-full md:w-1/2 relative h-[500px] rounded-2xl overflow-hidden shadow-sm">
                <Image 
                  src={storyData.imageSrc}
                  alt={storyData.title}
                  fill
                  className="object-cover"
                />
              </div>
              <div className="w-full md:w-1/2 md:pl-10">
                <h3 className="text-3xl font-light text-gray-900 mb-6 block" dangerouslySetInnerHTML={{ __html: storyData.title }} />
                
                <p className="text-gray-600 mb-8 leading-relaxed text-lg block">
                  {storyData.text}
                </p>
                <Link href={storyData.ctaHref || "/about"} className="inline-flex items-center gap-2 text-gray-900 font-medium hover:text-emerald-600 transition-colors group">
                  <span>{storyData.ctaText || "Learn our story"}</span>
                  <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            </div>
          </div>
        </section>
      </EditableSection>

      {/* Minimal Testimonials */}
      <TestimonialSection />
    </>
  );
}
