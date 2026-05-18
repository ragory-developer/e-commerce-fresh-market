"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Clock, Zap, Percent, ShoppingCart } from "lucide-react";
import HotDealsSection from "../HotDealsSection";
import PromoBadgeGrid from "../PromoBadgeGrid";
import ProductShowcase from "../ProductShowcase";
import SpecialOffersBanner from "../SpecialOffersBanner";
import EditableSection from "../../admin/HomeBuilder/wrappers/EditableSection";

export default function HomeTemplate3({ 
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
    title: "Clearance",
    subtitle: "Mega",
    text: "Up to 70% Off Storewide. No Code Needed.",
    ctaText: "Shop The Sale",
    ctaHref: "/products?sort=discount"
  };

  const specialOffersData = data?.specialOffers || {
    title: "Buy 1 Get 1 Free",
    subtitle: "On selected items across the store. Mix and match your favorites!"
  };

  // Filter products if showcaseCategoryId is set and not "all"
  let showcaseProducts = allProducts;
  if (data?.showcaseCategoryId && data.showcaseCategoryId !== "all") {
    showcaseProducts = allProducts.filter(p => p.categoryId === data.showcaseCategoryId || p.category?.id === data.showcaseCategoryId);
  }

  const handleSectionClick = (sectionId: string) => {
    if (onSectionClick) onSectionClick(sectionId);
  };

  // Flash Sale Hero
  return (
    <>
      <EditableSection sectionId="hero" name="Flash Sale Hero" isEditing={isEditing} isActive={activeSection === "hero"} onClick={handleSectionClick}>
        <section className="bg-red-600 text-white overflow-hidden relative">
          {/* Dynamic Background Pattern */}
          <div className="absolute inset-0 opacity-10" 
               style={{ backgroundImage: "radial-gradient(#ffffff 2px, transparent 2px)", backgroundSize: "30px 30px" }}>
          </div>
          
          <div className="container mx-auto px-4 py-20 relative z-10">
            <div className="flex flex-col md:flex-row items-center justify-between gap-10">
              <motion.div 
                className="w-full md:w-3/5"
                initial={{ x: -50, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ duration: 0.5 }}
              >
                <div className="inline-flex items-center gap-2 bg-yellow-400 text-red-900 px-4 py-1.5 rounded-full font-bold text-sm mb-6 animate-pulse">
                  <Zap size={16} fill="currentColor" /> ENDS IN 24 HOURS
                </div>
                <h1 className="text-6xl md:text-8xl font-black mb-4 uppercase tracking-tighter leading-none">
                  {heroData.subtitle} <br/><span className="text-yellow-400">{heroData.title}</span>
                </h1>
                <p className="text-2xl md:text-3xl font-medium mb-8 text-red-100">
                  {heroData.text}
                </p>
                
                <div className="flex flex-wrap gap-4">
                  <Link
                    href={heroData.ctaHref || "/products?sort=discount"}
                    className="bg-yellow-400 text-red-900 hover:bg-yellow-300 px-8 py-4 rounded-xl font-bold text-lg transition-transform hover:scale-105 shadow-xl flex items-center gap-2"
                  >
                    <ShoppingCart size={20} /> {heroData.ctaText || "Shop The Sale"}
                  </Link>
                </div>
              </motion.div>
              
              <motion.div 
                className="w-full md:w-2/5 flex justify-center"
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                <div className="bg-white text-red-600 rounded-3xl p-8 shadow-2xl rotate-3 transform border-8 border-yellow-400 max-w-sm w-full text-center">
                  <h3 className="text-3xl font-black uppercase mb-2">Deal of the Day</h3>
                  <div className="text-7xl font-black mb-2">-50%</div>
                  <p className="text-gray-600 font-medium mb-6">On all premium skincare sets</p>
                  <div className="flex justify-center gap-4 text-center">
                    <div className="bg-red-50 rounded-lg p-3 min-w-[70px]">
                      <div className="text-2xl font-bold">12</div>
                      <div className="text-xs uppercase font-bold text-gray-500">Hours</div>
                    </div>
                    <div className="bg-red-50 rounded-lg p-3 min-w-[70px]">
                      <div className="text-2xl font-bold">45</div>
                      <div className="text-xs uppercase font-bold text-gray-500">Mins</div>
                    </div>
                    <div className="bg-red-50 rounded-lg p-3 min-w-[70px]">
                      <div className="text-2xl font-bold">30</div>
                      <div className="text-xs uppercase font-bold text-gray-500">Secs</div>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </section>
      </EditableSection>

      {/* High-priority deals right after hero */}
      <HotDealsSection />

      <PromoBadgeGrid />

      {/* Big Sale Banner */}
      <EditableSection sectionId="specialOffers" name="Special Offers" isEditing={isEditing} isActive={activeSection === "specialOffers"} onClick={handleSectionClick}>
        <SpecialOffersBanner 
          {...specialOffersData}
          bgColor="from-red-600 via-rose-600 to-orange-500"
        />
      </EditableSection>

      <div className="py-10 bg-gray-50">
        <EditableSection sectionId="productShowcase" name="Product Showcase" isEditing={isEditing} isActive={activeSection === "productShowcase"} onClick={handleSectionClick}>
          <ProductShowcase products={showcaseProducts} title="All Sale Items" subtitle="Grab them before they're gone" />
        </EditableSection>
      </div>
    </>
  );
}
