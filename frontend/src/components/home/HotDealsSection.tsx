"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { Clock, Flame, ArrowRight } from "lucide-react";

interface HotDeal {
  name: string;
  originalPrice: string;
  salePrice: string;
  discount: string;
  image: string;
  endsIn?: string;
}

interface HotDealsSectionProps {
  title?: string;
  subtitle?: string;
  deals?: HotDeal[];
}

const defaultDeals: HotDeal[] = [
  {
    name: "Premium Face Wash Bundle",
    originalPrice: "৳1,800",
    salePrice: "৳999",
    discount: "45% OFF",
    image: "https://images.unsplash.com/photo-1556228578-0d85b1a4d571?auto=format&fit=crop&w=400&q=80",
    endsIn: "2d 14h",
  },
  {
    name: "Korean Skincare Set",
    originalPrice: "৳3,500",
    salePrice: "৳2,100",
    discount: "40% OFF",
    image: "https://images.unsplash.com/photo-1571781926291-c477ebfd024b?auto=format&fit=crop&w=400&q=80",
    endsIn: "1d 8h",
  },
  {
    name: "Anti-Aging Combo Pack",
    originalPrice: "৳4,200",
    salePrice: "৳2,520",
    discount: "40% OFF",
    image: "https://images.unsplash.com/photo-1596755389378-c31d21fd1273?auto=format&fit=crop&w=400&q=80",
    endsIn: "3d 5h",
  },
  {
    name: "SPF Protection Kit",
    originalPrice: "৳2,000",
    salePrice: "৳1,200",
    discount: "40% OFF",
    image: "https://images.unsplash.com/photo-1611930022073-b7a4ba5fcccd?auto=format&fit=crop&w=400&q=80",
    endsIn: "5h 30m",
  },
];

export default function HotDealsSection({
  title = "Hot Deals",
  subtitle = "Grab them before they're gone!",
  deals = defaultDeals,
}: HotDealsSectionProps) {
  return (
    <section className="py-12 lg:py-20 bg-gradient-to-b from-white to-gray-50 dark:from-gray-950 dark:to-gray-900">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10">
          <motion.div
            initial={false}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <div className="flex items-center gap-2 mb-2">
              <Flame size={24} className="text-red-500" />
              <h2 className="text-3xl lg:text-4xl font-black text-gray-900 dark:text-white">
                {title}
              </h2>
            </div>
            <p className="text-gray-500 dark:text-gray-400 text-lg">
              {subtitle}
            </p>
          </motion.div>
          <Link
            href="/products?sort=discount"
            className="inline-flex items-center gap-2 text-red-500 hover:text-red-600 font-bold transition-colors"
          >
            All Deals <ArrowRight size={18} />
          </Link>
        </div>

        {/* Deal Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
          {deals.map((deal, idx) => (
            <motion.div
              key={idx}
              initial={false}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: idx * 0.1 }}
            >
              <Link
                href="/products"
                className="group block bg-white dark:bg-gray-800 rounded-2xl overflow-hidden border border-gray-100 dark:border-gray-700 hover:shadow-xl hover:border-red-200 dark:hover:border-red-900/50 transition-all"
              >
                {/* Image */}
                <div className="aspect-square relative overflow-hidden">
                  <Image
                    src={deal.image}
                    alt={deal.name}
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-500"
                    unoptimized
                  />
                  {/* Discount badge */}
                  <span className="absolute top-3 left-3 bg-red-500 text-white text-xs font-black px-3 py-1.5 rounded-full shadow-lg">
                    {deal.discount}
                  </span>
                  {/* Timer */}
                  {deal.endsIn && (
                    <span className="absolute bottom-3 right-3 bg-black/70 backdrop-blur-sm text-white text-xs font-bold px-3 py-1.5 rounded-full flex items-center gap-1">
                      <Clock size={12} /> {deal.endsIn}
                    </span>
                  )}
                </div>

                {/* Info */}
                <div className="p-4">
                  <h3 className="font-bold text-gray-900 dark:text-white text-sm mb-2 line-clamp-1 group-hover:text-red-500 transition-colors">
                    {deal.name}
                  </h3>
                  <div className="flex items-center gap-2">
                    <span className="text-red-500 font-extrabold text-lg">
                      {deal.salePrice}
                    </span>
                    <span className="text-gray-400 line-through text-sm">
                      {deal.originalPrice}
                    </span>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
