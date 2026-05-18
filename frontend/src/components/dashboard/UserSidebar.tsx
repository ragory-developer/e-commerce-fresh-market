"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  LayoutDashboard, 
  ShoppingBag, 
  Settings, 
  LogOut, 
  User as UserIcon,
  ChevronRight
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";

export default function UserSidebar() {
  const pathname = usePathname();
  const { user, logout } = useAuth();

  const menuItems = [
    { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    { label: "Purchase History", href: "/profile/orders", icon: ShoppingBag },
    { label: "Settings", href: "/settings", icon: Settings },
  ];

  return (
    <div className="bg-white dark:bg-gray-900 rounded-[2rem] shadow-sm border border-gray-100 dark:border-gray-800 p-6 flex flex-col gap-8 h-fit lg:sticky lg:top-24">
      {/* Profile Header */}
      <div className="flex flex-col items-center text-center px-2">
        <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-blue-100 to-blue-50 dark:from-blue-900/30 dark:to-blue-800/20 flex items-center justify-center mb-4 border-4 border-white dark:border-gray-800 shadow-xl overflow-hidden">
          {user?.name ? (
            <span className="text-2xl font-black text-blue-600 uppercase">
              {user.name.charAt(0)}
            </span>
          ) : (
            <UserIcon className="text-blue-500" size={32} />
          )}
        </div>
        <div>
          <h3 className="text-lg font-black text-gray-900 dark:text-white truncate max-w-[180px]">
            {user?.name || "User Name"}
          </h3>
          <p className="text-sm text-gray-500 dark:text-gray-400 truncate max-w-[180px]">
            {user?.email || user?.phone || "user@example.com"}
          </p>
          <Link 
            href="/profile" 
            className="text-xs font-bold text-blue-600 hover:underline mt-1 inline-block"
          >
            View Profile
          </Link>
        </div>
      </div>

      {/* Navigation Menu */}
      <nav className="flex flex-col gap-2">
        {menuItems.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;
          
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center justify-between px-4 py-3.5 rounded-2xl transition-all duration-300 group ${
                isActive 
                  ? "bg-blue-600 text-white shadow-lg shadow-blue-600/30 translate-x-1" 
                  : "text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-white"
              }`}
            >
              <div className="flex items-center gap-3">
                <Icon size={20} className={isActive ? "text-white" : "text-gray-400 group-hover:text-blue-500"} />
                <span className="font-bold text-sm tracking-tight">{item.label}</span>
              </div>
              {isActive && <ChevronRight size={16} />}
            </Link>
          );
        })}
        
        <button
          onClick={logout}
          className="flex items-center gap-3 px-4 py-3.5 rounded-2xl text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-all duration-300 mt-2 group"
        >
          <LogOut size={20} className="group-hover:-translate-x-0.5 transition-transform" />
          <span className="font-bold text-sm tracking-tight">Logout</span>
        </button>
      </nav>
    </div>
  );
}
