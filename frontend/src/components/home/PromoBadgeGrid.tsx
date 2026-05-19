"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Gift, Package, Boxes, Sparkles } from "lucide-react";
import { ReactNode } from "react";

interface PromoBadge {
  title: string;
  subtitle: string;
  icon: ReactNode;
  bgColor: string;
  href: string;
}

interface PromoBadgeGridProps {
  badges?: PromoBadge[];
}

const defaultBadges: PromoBadge[] = [
  {
    title: "Buy 1 Get 1",
    subtitle: "Free",
    icon: <Gift size={28} />,
    bgColor: "from-blue-500 to-blue-700",
    href: "/products?offer=bogo",
  },
  {
    title: "Stock",
    subtitle: "Clearance",
    icon: <Package size={28} />,
    bgColor: "from-emerald-500 to-teal-700",
    href: "/products?offer=clearance",
  },
  {
    title: "Combo",
    subtitle: "Sale",
    icon: <Boxes size={28} />,
    bgColor: "from-purple-500 to-indigo-700",
    href: "/products?offer=combo",
  },
  {
    title: "Makeup",
    subtitle: "Sale",
    icon: <Sparkles size={28} />,
    bgColor: "from-rose-500 to-pink-700",
    href: "/products?offer=makeup",
  },
];

export default function PromoBadgeGrid({ badges = defaultBadges }: PromoBadgeGridProps) {
  return (
    <section className="py-8 lg:py-12 bg-white dark:bg-gray-950">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 lg:gap-6">
          {badges.map((badge, idx) => (
            <motion.div
              key={idx}
              initial={false}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: idx * 0.1 }}
            >
              <Link
                href={badge.href}
                className={`group relative block overflow-hidden rounded-2xl bg-gradient-to-br ${badge.bgColor} p-6 lg:p-8 text-white text-center transition-all hover:shadow-2xl hover:scale-[1.03] active:scale-[0.98]`}
              >
                {/* Shimmer overlay */}
                <div className="shimmer absolute inset-0 pointer-events-none" />

                {/* Icon */}
                <div className="bg-white/20 backdrop-blur-sm w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                  {badge.icon}
                </div>

                {/* Text */}
                <h3 className="text-xl lg:text-2xl font-black leading-tight">
                  {badge.title}
                </h3>
                <p className="text-white/80 font-bold text-sm uppercase tracking-wider mt-1">
                  {badge.subtitle}
                </p>

                {/* Decorative circle */}
                <div className="absolute -top-6 -right-6 w-24 h-24 bg-white/10 rounded-full" />
                <div className="absolute -bottom-4 -left-4 w-16 h-16 bg-white/10 rounded-full" />
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
