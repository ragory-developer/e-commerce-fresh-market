"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { ShoppingCart, User, Search, Menu, Leaf, X } from "lucide-react";
import { useCartStore } from "@/store/cartStore";
import { motion, AnimatePresence } from "framer-motion";

import { useAuth } from "@/context/AuthContext";
import { LogOut, LayoutDashboard, User as UserIcon } from "lucide-react";

export default function Navbar() {
  const { user, logout } = useAuth();
  const cartItems = useCartStore((state) => state.items);
  const [mounted, setMounted] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  // Prevent hydration mismatch for Zustand
  useEffect(() => {
    setMounted(true);
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const cartCount = mounted ? cartItems.reduce((acc, item) => acc + item.quantity, 0) : 0;

  return (
    <>
      <header 
        className={`sticky top-0 z-50 transition-all duration-300 ${
          isScrolled 
            ? "glass shadow-sm border-b border-gray-200 dark:border-gray-800 py-3" 
            : "bg-white dark:bg-gray-950 py-4 border-b border-transparent dark:border-gray-900"
        }`}
      >
        <div className="container mx-auto px-4 flex items-center justify-between">
          
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group z-50">
            <div className="bg-primary text-white p-2 rounded-xl shadow-lg shadow-primary/30 group-hover:scale-105 transition-transform duration-300">
              <Leaf size={24} />
            </div>
            <span className="text-2xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-emerald-600 to-teal-500">
              FreshCart
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8 font-medium">
            <Link href="/" className="text-gray-600 dark:text-gray-300 hover:text-primary dark:hover:text-primary transition-colors">Home</Link>
            <Link href="/products" className="text-gray-600 dark:text-gray-300 hover:text-primary dark:hover:text-primary transition-colors">Shop</Link>
            <Link href="/categories" prefetch={false} className="text-gray-600 dark:text-gray-300 hover:text-primary dark:hover:text-primary transition-colors">Categories</Link>
            <Link href="/about" prefetch={false} className="text-gray-600 dark:text-gray-300 hover:text-primary dark:hover:text-primary transition-colors">About Us</Link>
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-3 desktop-actions">
            <button className="w-10 h-10 flex items-center justify-center text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors hidden sm:flex">
              <Search size={20} />
            </button>
            
            <button 
              onClick={useCartStore((state) => state.openCart)}
              className="w-10 h-10 flex items-center justify-center text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors relative"
            >
              <ShoppingCart size={20} />
              <AnimatePresence>
                {cartCount > 0 && (
                  <motion.span 
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    exit={{ scale: 0 }}
                    className="absolute -top-1 -right-1 h-5 w-5 bg-rose-500 text-white text-[11px] font-bold flex items-center justify-center rounded-full border-2 border-white dark:border-gray-950 shadow-sm"
                  >
                    {cartCount}
                  </motion.span>
                )}
              </AnimatePresence>
            </button>
            
            {user ? (
              <div className="relative">
                <button 
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="w-10 h-10 flex items-center justify-center text-primary bg-primary/10 hover:bg-primary/20 rounded-full transition-colors"
                >
                  <UserIcon size={20} />
                </button>
                <AnimatePresence>
                  {userMenuOpen && (
                    <>
                      <div className="fixed inset-0 z-10" onClick={() => setUserMenuOpen(false)}></div>
                      <motion.div 
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                        className="absolute right-0 mt-2 w-56 bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-2xl shadow-xl z-20 py-2 overflow-hidden"
                      >
                        <div className="px-4 py-3 border-b border-gray-100 dark:border-gray-800">
                          <p className="text-sm font-bold text-gray-900 dark:text-white truncate">{user?.name}</p>
                          <p className="text-xs text-gray-500 truncate">{user?.role}</p>
                        </div>
                        <Link 
                          href="/dashboard"
                          onClick={() => setUserMenuOpen(false)}
                          className="flex items-center gap-3 px-4 py-3 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors font-medium"
                        >
                          <LayoutDashboard size={16} />
                          Dashboard
                        </Link>
                        <button 
                          onClick={() => { logout(); setUserMenuOpen(false); }}
                          className="w-full flex items-center gap-3 px-4 py-2 text-sm text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-900/20 transition-colors"
                        >
                          <LogOut size={16} />
                          Logout
                        </button>
                      </motion.div>
                    </>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <Link href="/login" prefetch={false} className="w-10 h-10 flex flex-col items-center justify-center text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors hidden sm:flex">
                <UserIcon size={20} />
              </Link>
            )}

            <button 
              className="md:hidden w-10 h-10 flex items-center justify-center text-gray-900 dark:text-white rounded-full bg-gray-100 dark:bg-gray-800 z-50"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed inset-0 z-40 bg-white dark:bg-gray-950 pt-24 px-6 flex flex-col gap-6 md:hidden overflow-y-auto"
          >
            <Link href="/" onClick={() => setMobileMenuOpen(false)} className="text-2xl font-bold border-b border-gray-100 dark:border-gray-800 pb-4">Home</Link>
            <Link href="/products" onClick={() => setMobileMenuOpen(false)} className="text-2xl font-bold border-b border-gray-100 dark:border-gray-800 pb-4">Shop All</Link>
            <Link href="/categories" onClick={() => setMobileMenuOpen(false)} prefetch={false} className="text-2xl font-bold border-b border-gray-100 dark:border-gray-800 pb-4">Categories</Link>
            {user ? (
              <div className="flex flex-col gap-8 pt-8">
                <div className="border-b border-gray-100 dark:border-gray-800 pb-4">
                  <p className="text-sm text-gray-500 mb-1">Logged in as</p>
                  <p className="text-xl font-bold">{user.name}</p>
                </div>
                <button 
                  onClick={() => { logout(); setMobileMenuOpen(false); }}
                  className="text-2xl font-bold text-rose-600 text-left border-b border-gray-100 dark:border-gray-800 pb-4 flex items-center gap-3"
                >
                  <LogOut size={24} />
                  Logout
                </button>
              </div>
            ) : (
              <div className="flex flex-col gap-8 pt-8">
                <Link href="/login" onClick={() => setMobileMenuOpen(false)} className="text-4xl font-black hover:text-emerald-500 transition-colors">LOGIN</Link>
                <Link href="/register" onClick={() => setMobileMenuOpen(false)} className="text-4xl font-black hover:text-emerald-500 transition-colors">REGISTER</Link>
              </div>
            )}
            <div className="mt-auto pb-12">
              <div className="p-4 bg-emerald-50 dark:bg-emerald-900/30 rounded-2xl flex items-center gap-4">
                <div className="bg-emerald-100 dark:bg-emerald-800 p-3 rounded-full text-emerald-600 dark:text-emerald-300">
                  <Leaf size={24} />
                </div>
                <div>
                  <h4 className="font-bold">FreshCart Promise</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">100% Organic & Fresh delivery to your door.</p>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
