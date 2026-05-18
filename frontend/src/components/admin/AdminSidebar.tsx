"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  FolderTree,
  Tag,
  ShoppingBag,
  Package,
  PlusCircle,
  ImageIcon,
  ChevronLeft,
  ChevronRight,
  Leaf,
  SlidersHorizontal,
  Layers,
  Download,
  Settings,
  Users,
  LogOut,
  MapPin,
  Ticket,
  ShieldCheck,
  Percent,
} from "lucide-react";
import { useState } from "react";

import { useAuth } from "@/context/AuthContext";

const navItems = [
  { label: "Dashboard", href: "/admin", icon: LayoutDashboard, permission: "DASHBOARD" },
  { label: "Add Product", href: "/admin/products/create", icon: PlusCircle, permission: "PRODUCTS" },
  { label: "Media", href: "/admin/media", icon: ImageIcon, permission: "MEDIA" },
  { label: "Categories", href: "/admin/categories", icon: FolderTree, permission: "CATEGORIES" },
  { label: "Brands", href: "/admin/brands", icon: Tag, permission: "BRANDS" },
  { label: "Specifications", href: "/admin/specifications", icon: SlidersHorizontal, permission: "SPECIFICATIONS" },
  { label: "Variations", href: "/admin/variations", icon: Layers, permission: "VARIATIONS" },
  { label: "Products", href: "/admin/products", icon: ShoppingBag, permission: "PRODUCTS" },
  { label: "Promotions", href: "/admin/promotions", icon: Percent, permission: "PRODUCTS" },
  { label: "Orders", href: "/admin/orders", icon: Package, permission: "ORDERS" },
  { label: "Locations", href: "/admin/locations", icon: MapPin, permission: "SETTINGS" },
  { label: "Coupons", href: "/admin/coupons", icon: Ticket, permission: "SETTINGS" },
  { label: "WP Import", href: "/admin/wp-import", icon: Download, permission: "IMPORT" },
  { label: "Pages", href: "/admin/pages", icon: LayoutDashboard, permission: "PAGES" },
  { label: "Home Builder", href: "/admin/home-builder", icon: LayoutDashboard, permission: "PAGES" },
  { label: "Settings", href: "/admin/settings", icon: Settings, permission: "SETTINGS" },
  { label: "Customers", href: "/admin/customers", icon: Users, permission: "USERS" },
  { label: "Admin Users", href: "/admin/users", icon: ShieldCheck, permission: "USERS" },
];

export default function AdminSidebar() {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);
  const { user, logout } = useAuth();

  const filteredNavItems = navItems.filter(item => {
    if (!user) return false;
    if (user.role === 'SUPER_ADMIN') return true;
    // Safely handle permissions whether stored as array or legacy JSON string
    const perms: string[] = Array.isArray(user.permissions)
      ? user.permissions
      : (typeof user.permissions === 'string' ? (() => { try { return JSON.parse(user.permissions as unknown as string); } catch { return []; } })() : []);
    if (perms.includes('ALL')) return true;
    return perms.includes(item.permission);
  });

  return (
    <aside
      className={`fixed top-0 left-0 h-screen bg-gray-900 text-white flex flex-col transition-all duration-300 z-40 ${
        collapsed ? "w-[72px]" : "w-[260px]"
      }`}
    >
      {/* Logo */}
      <div className="p-5 flex items-center gap-3 border-b border-gray-800">
        <div className="bg-emerald-500 p-2 rounded-xl shrink-0">
          <Leaf size={20} />
        </div>
        {!collapsed && (
          <span className="text-lg font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 to-teal-300">
            FreshCart
          </span>
        )}
      </div>

      {/* Nav */}
      <nav className="flex-1 py-4 px-3 space-y-1 overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
        {filteredNavItems.map((item) => {
          const isActive =
            item.href === "/admin"
              ? pathname === "/admin"
              : pathname === item.href || (pathname.startsWith(item.href + "/") && !filteredNavItems.some(other => other.href !== item.href && other.href.startsWith(item.href + "/") && pathname.startsWith(other.href)));

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                isActive
                  ? "bg-emerald-600/20 text-emerald-400"
                  : "text-gray-400 hover:text-white hover:bg-gray-800"
              }`}
              title={collapsed ? item.label : undefined}
            >
              <item.icon size={20} className="shrink-0" />
              {!collapsed && <span>{item.label}</span>}
            </Link>
          );
        })}
      </nav>

      {/* Footer Actions */}
      <div className="border-t border-gray-800 flex flex-col">
        <button
          onClick={() => logout()}
          className="flex items-center gap-3 p-3 text-gray-400 hover:bg-rose-500/10 hover:text-rose-500 transition-colors"
          title={collapsed ? "Logout" : undefined}
        >
          <LogOut size={20} className="shrink-0 mx-auto" />
          {!collapsed && <span className="font-medium text-sm text-left flex-1">Logout</span>}
        </button>
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="p-3 border-t border-gray-800 flex items-center justify-center text-gray-500 hover:text-white transition-colors"
          title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {collapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
        </button>
      </div>
    </aside>
  );
}
