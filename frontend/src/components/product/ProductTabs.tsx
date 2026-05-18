"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Info, ListChecks, MessageCircleQuestion, Star, Send } from "lucide-react";

export default function ProductTabs({ product }: { product: any }) {
  const [activeTab, setActiveTab] = useState("description");

  const hasSpecifications = 
    (product.specifications && Array.isArray(product.specifications) && product.specifications.length > 0) ||
    product.weight || 
    (product.variants && product.variants.some((v: any) => v.attributes && v.attributes.length > 0));

  const hasFaqs = product.faqs && Array.isArray(product.faqs) && product.faqs.length > 0;

  const tabs = [
    { id: "description", label: "Description", icon: Info, show: true },
    { id: "specifications", label: "Specifications", icon: ListChecks, show: hasSpecifications },
    { id: "questions", label: "Questions (Q&A)", icon: MessageCircleQuestion, show: hasFaqs },
    { id: "reviews", label: "Reviews", icon: Star, show: true },
  ].filter(tab => tab.show);

  return (
    <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 overflow-hidden mt-12">
      {/* Tabs Header */}
      <div className="flex overflow-x-auto border-b border-gray-100 dark:border-gray-800 scrollbar-hide">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-6 py-4 font-semibold text-sm whitespace-nowrap transition-all relative ${
                isActive 
                  ? "text-emerald-600 dark:text-emerald-500" 
                  : "text-gray-500 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-200"
              }`}
            >
              <Icon size={18} />
              {tab.label}
              {isActive && (
                <motion.div 
                  layoutId="activeTabIndicator"
                  className="absolute bottom-0 left-0 right-0 h-0.5 bg-emerald-600 dark:bg-emerald-500"
                />
              )}
            </button>
          );
        })}
      </div>

      {/* Tabs Content */}
      <div className="p-6 md:p-8 min-h-[300px]">
        {/* Description Tab */}
        <div className={activeTab === "description" ? "block" : "hidden"}>
          <div className="text-gray-600 dark:text-gray-300">
            {product.description ? (
              <article 
                className="prose prose-emerald dark:prose-invert max-w-none leading-relaxed break-words [word-break:normal] hyphens-none text-left"
                dangerouslySetInnerHTML={{ __html: product.description }}
              />
            ) : (
              <div className="space-y-4 leading-relaxed">
                <p>
                  Experience the finest quality {product.name?.toLowerCase() || 'product'}. Sourced from sustainable farms and delivered fresh to your doorstep. Perfect for your daily nutritional needs.
                </p>
                <p>
                  We guarantee 100% freshness on all our organic products. Our strict quality control process ensures that only the best items make it to your kitchen. Try it today and taste the difference of premium farm-to-table groceries.
                </p>
                <div className="mt-6 p-4 bg-emerald-50 dark:bg-emerald-900/20 rounded-xl text-emerald-800 dark:text-emerald-200">
                  <span className="font-bold block mb-1">Storage Instructions:</span>
                  1. Keep refrigerated for maximum shelf life.<br />
                  2. Wash thoroughly before consumption.<br />
                  3. Consume within 5-7 days of delivery.
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Specifications Tab */}
        <div className={activeTab === "specifications" ? "block" : "hidden"}>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-gray-600 dark:text-gray-300">
              <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                {product.weight && (
                  <tr className="hover:bg-gray-50/50 dark:hover:bg-gray-800/50 transition-colors">
                    <td className="py-4 px-2 font-bold w-1/3 text-gray-900 dark:text-white">Weight / Volume</td>
                    <td className="py-4 px-2 font-medium">{product.weight} {product.unit}</td>
                  </tr>
                )}
                
                {product.categories && product.categories.length > 0 && (
                  <tr className="hover:bg-gray-50/50 dark:hover:bg-gray-800/50 transition-colors">
                    <td className="py-4 px-2 font-bold w-1/3 text-gray-900 dark:text-white">Categories</td>
                    <td className="py-4 px-2 font-medium">{product.categories.map((c: any) => c.name).join(", ")}</td>
                  </tr>
                )}

                {product.brand && (
                  <tr className="hover:bg-gray-50/50 dark:hover:bg-gray-800/50 transition-colors">
                    <td className="py-4 px-2 font-bold w-1/3 text-gray-900 dark:text-white">Brand</td>
                    <td className="py-4 px-2 font-medium">{product.brand.name}</td>
                  </tr>
                )}

                {product.specifications && Array.isArray(product.specifications) && product.specifications.map((s: any, i: number) => (
                  <tr key={`spec-${i}`} className="hover:bg-gray-50/50 dark:hover:bg-gray-800/50 transition-colors">
                    <td className="py-4 px-2 font-bold w-1/3 text-gray-900 dark:text-white">{s.name}</td>
                    <td className="py-4 px-2 font-medium">{s.value}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Questions Tab (FAQs) */}
        <div className={activeTab === "questions" ? "block" : "hidden"}>
          <div className="space-y-8">
            {product.faqs && Array.isArray(product.faqs) && product.faqs.length > 0 && (
              <div className="grid grid-cols-1 gap-4" itemScope itemType="https://schema.org/FAQPage">
                {product.faqs.map((faq: any, i: number) => (
                  <div key={i} className="bg-gray-50 dark:bg-gray-800/40 p-6 rounded-2xl border border-gray-100 dark:border-gray-800 group" itemProp="mainEntity" itemScope itemType="https://schema.org/Question">
                    <div className="flex gap-4">
                      <div className="bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 p-2.5 h-fit rounded-xl">
                        <MessageCircleQuestion size={22} />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-black text-gray-900 dark:text-white text-lg mb-3 tracking-tight" itemProp="name">
                          {faq.question}
                        </h4>
                        <div className="text-gray-600 dark:text-gray-300 leading-relaxed font-medium bg-white dark:bg-gray-900/50 p-4 rounded-xl border border-gray-100 dark:border-gray-800/50 shadow-sm" itemProp="suggestedAnswer acceptedAnswer" itemScope itemType="https://schema.org/Answer">
                          <div itemProp="text">{faq.answer}</div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
            
            {/* Ask a Question section stays the same */}
            <div className="pt-8 border-t border-gray-100 dark:border-gray-800">
              <h3 className="text-xl font-black text-gray-900 dark:text-white mb-6 uppercase tracking-tight italic">Ask a Question</h3>
              <div className="flex flex-col sm:flex-row gap-3">
                <input 
                  type="text" 
                  placeholder="Type your question here..." 
                  className="flex-1 bg-white dark:bg-gray-800 border-2 border-gray-100 dark:border-gray-700 px-5 py-3.5 rounded-2xl text-sm font-medium focus:outline-none focus:border-emerald-500/50 focus:ring-4 focus:ring-emerald-500/10 transition-all text-gray-900 dark:text-white"
                />
                <button className="bg-emerald-600 hover:bg-emerald-700 text-white px-8 py-3.5 rounded-2xl font-black text-sm uppercase tracking-widest transition-all shadow-lg shadow-emerald-600/20 active:scale-95 flex items-center justify-center gap-2">
                  <Send size={18} /> Send
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Reviews Tab */}
        <div className={activeTab === "reviews" ? "block" : "hidden"}>
          {/* Reviews content stays mostly the same but rendered always */}
          <div className="flex items-center gap-6 mb-8 p-6 bg-emerald-50 dark:bg-emerald-900/20 rounded-2xl">
            <div className="text-center">
              <div className="text-5xl font-black text-emerald-600">4.8</div>
              <div className="flex items-center justify-center text-amber-500 my-1">
                {[...Array(5)].map((_, i) => <Star key={i} size={16} className={i < 4 ? "fill-current" : "fill-current opacity-50"} />)}
              </div>
              <div className="text-sm text-gray-500">Based on 24 reviews</div>
            </div>
            <div className="flex-1 hidden sm:block">
              {[5, 4, 3, 2, 1].map(num => (
                <div key={num} className="flex items-center gap-2 text-sm mb-1">
                  <div className="w-8 text-gray-500 font-medium">{num} Star</div>
                  <div className="flex-1 h-2 bg-gray-200 dark:bg-gray-800 rounded-full overflow-hidden">
                    <div className="h-full bg-amber-500" style={{ width: num === 5 ? '80%' : num === 4 ? '15%' : '5%' }}></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
