"use client";

import { Gift, Heart, ShoppingBag } from "lucide-react";

interface StatsProps {
  rewardPoints: number;
  wishlistCount: number;
  orderCount: number;
}

export default function DashboardStats({ rewardPoints, wishlistCount, orderCount }: StatsProps) {
  const stats = [
    {
      label: "Reward Balance",
      value: rewardPoints,
      sublabel: "Points Available",
      icon: Gift,
      color: "bg-blue-600",
      bgSubtle: "bg-blue-50 dark:bg-blue-900/10",
      accent: "text-blue-600",
    },
    {
      label: "Wishlist Items",
      value: wishlistCount,
      sublabel: "Saved for Later",
      icon: Heart,
      color: "bg-rose-500",
      bgSubtle: "bg-rose-50 dark:bg-rose-900/10",
      accent: "text-rose-500",
    },
    {
      label: "Total Orders",
      value: orderCount,
      sublabel: "Completed Purchases",
      icon: ShoppingBag,
      color: "bg-emerald-500",
      bgSubtle: "bg-emerald-50 dark:bg-emerald-900/10",
      accent: "text-emerald-500",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {stats.map((stat, i) => {
        const Icon = stat.icon;
        return (
          <div 
            key={i} 
            className="group relative bg-white dark:bg-gray-900 p-8 rounded-[2.5rem] border border-transparent hover:border-gray-100 dark:hover:border-gray-800 shadow-xl shadow-gray-200/40 dark:shadow-none transition-all duration-500 overflow-hidden"
          >
            {/* Background Accent */}
            <div className={`absolute top-0 right-0 w-32 h-32 ${stat.bgSubtle} rounded-bl-[5rem] -mr-8 -mt-8 transition-transform group-hover:scale-110 duration-700`} />
            
            <div className="relative z-10 flex flex-col h-full">
              <div className="flex items-center justify-between mb-8">
                <div className={`${stat.color} w-14 h-14 rounded-2xl flex items-center justify-center shadow-lg transform group-hover:-rotate-6 transition-transform duration-500`}>
                  <Icon size={28} className="text-white" />
                </div>
                <div className="text-right">
                   <p className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 mb-1">{stat.sublabel}</p>
                   <p className={`text-sm font-bold ${stat.accent}`}>Live Update</p>
                </div>
              </div>

              <div className="mt-auto">
                <h3 className="text-5xl font-black text-gray-900 dark:text-white tracking-tighter mb-1">
                  {stat.value}
                </h3>
                <p className="text-sm font-bold text-gray-400 uppercase tracking-widest">
                  {stat.label}
                </p>
              </div>
            </div>

            {/* Subtle Patterns */}
            <div className="absolute left-0 bottom-0 opacity-[0.03] dark:opacity-[0.05] pointer-events-none">
               <svg width="100" height="100" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <circle cx="20" cy="80" r="40" stroke="currentColor" strokeWidth="2" />
               </svg>
            </div>
          </div>
        );
      })}
    </div>
  );
}
