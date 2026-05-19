"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { ArrowRight, Sparkles } from "lucide-react";

interface NewArrival {
  name: string;
  price: string;
  image: string;
  badge?: string;
}

interface NewArrivalsSectionProps {
  title?: string;
  subtitle?: string;
  items?: NewArrival[];
  ctaHref?: string;
}

const defaultItems: NewArrival[] = [
  {
    name: "Retinol Night Cream",
    price: "৳2,450",
    image: "https://images.unsplash.com/photo-1611930022073-b7a4ba5fcccd?auto=format&fit=crop&w=400&q=80",
    badge: "New",
  },
  {
    name: "Hyaluronic Acid Serum",
    price: "৳1,890",
    image: "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&w=400&q=80",
    badge: "Trending",
  },
  {
    name: "Vitamin E Oil",
    price: "৳990",
    image: "https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?auto=format&fit=crop&w=400&q=80",
  },
  {
    name: "Collagen Face Mask",
    price: "৳750",
    image: "https://images.unsplash.com/photo-1596755389378-c31d21fd1273?auto=format&fit=crop&w=400&q=80",
    badge: "Hot",
  },
];

export default function NewArrivalsSection({
  title = "Just Dropped",
  subtitle = "NEW ARRIVALS",
  items = defaultItems,
  ctaHref = "/products?sort=newest",
}: NewArrivalsSectionProps) {
  return (
    <section className="py-12 lg:py-20 bg-gray-900 text-white relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-purple-600/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl" />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10">
          <motion.div
            initial={false}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <span className="text-emerald-400 font-bold text-sm uppercase tracking-widest mb-2 block">
              {subtitle}
            </span>
            <h2 className="text-3xl lg:text-5xl font-black leading-tight">
              {title}
            </h2>
          </motion.div>
          <Link
            href={ctaHref}
            className="inline-flex items-center gap-2 text-emerald-400 hover:text-emerald-300 font-bold transition-colors"
          >
            View All <ArrowRight size={18} />
          </Link>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
          {items.map((item, idx) => (
            <motion.div
              key={idx}
              initial={false}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: idx * 0.1 }}
            >
              <Link
                href={ctaHref}
                className="group block bg-gray-800/50 backdrop-blur-sm rounded-2xl overflow-hidden border border-gray-700/50 hover:border-emerald-500/30 transition-all hover:shadow-2xl hover:shadow-emerald-500/10"
              >
                {/* Image */}
                <div className="aspect-square relative overflow-hidden">
                  <Image
                    src={item.image}
                    alt={item.name}
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-500"
                    unoptimized
                  />
                  {item.badge && (
                    <span className="absolute top-3 left-3 bg-emerald-500 text-white text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1 shadow-lg">
                      <Sparkles size={12} /> {item.badge}
                    </span>
                  )}
                </div>

                {/* Info */}
                <div className="p-4">
                  <h3 className="font-bold text-white text-sm mb-1 line-clamp-1 group-hover:text-emerald-400 transition-colors">
                    {item.name}
                  </h3>
                  <p className="text-emerald-400 font-extrabold text-lg">
                    {item.price}
                  </p>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
