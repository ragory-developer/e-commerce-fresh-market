import Link from "next/link";
import { Leaf, Facebook, Twitter, Instagram, MapPin, Phone, Mail } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-gray-950 text-gray-300 pt-20 pb-10 border-t-4 border-emerald-500 mt-auto">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          
          {/* Brand & About */}
          <div className="space-y-6">
            <div className="flex items-center gap-2">
              <div className="bg-emerald-500 text-white p-2 rounded-xl">
                <Leaf size={28} />
              </div>
              <span className="text-2xl font-black text-white tracking-tight">
                FreshCart
              </span>
            </div>
            <p className="text-gray-400 leading-relaxed font-medium">
              We deliver the freshest groceries, organic vegetables, and daily essentials straight from farms to your home in just 30 minutes. Quality and freshness guaranteed.
            </p>
            <div className="flex gap-4">
              <a href="#" className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center hover:bg-emerald-500 hover:text-white transition-colors">
                <Facebook size={18} />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center hover:bg-emerald-500 hover:text-white transition-colors">
                <Twitter size={18} />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center hover:bg-emerald-500 hover:text-white transition-colors">
                <Instagram size={18} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white font-bold text-lg mb-6">Quick Links</h4>
            <ul className="space-y-4 font-medium text-gray-400">
              <li><Link href="/" prefetch={false} className="hover:text-emerald-400 transition-colors">Home</Link></li>
              <li><Link href="/products" prefetch={false} className="hover:text-emerald-400 transition-colors">All Products</Link></li>
              <li><Link href="/categories" prefetch={false} className="hover:text-emerald-400 transition-colors">Categories</Link></li>
              <li><Link href="/cart" prefetch={false} className="hover:text-emerald-400 transition-colors">Your Cart</Link></li>
            </ul>
          </div>

          {/* Customer Service */}
          <div>
            <h4 className="text-white font-bold text-lg mb-6">Customer Service</h4>
            <ul className="space-y-4 font-medium text-gray-400">
              <li><Link href="#" prefetch={false} className="hover:text-emerald-400 transition-colors">Help Center / FAQ</Link></li>
              <li><Link href="#" prefetch={false} className="hover:text-emerald-400 transition-colors">Delivery Options</Link></li>
              <li><Link href="#" prefetch={false} className="hover:text-emerald-400 transition-colors">Returns & Refunds</Link></li>
              <li><Link href="#" prefetch={false} className="hover:text-emerald-400 transition-colors">Terms of Service</Link></li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-white font-bold text-lg mb-6">Contact Us</h4>
            <ul className="space-y-5">
              <li className="flex gap-3 text-gray-400">
                <MapPin className="text-emerald-500 shrink-0 mt-1" size={20} />
                <span className="font-medium leading-relaxed">123 FreshCart Avenue, Suite 400<br/>New York, NY 10001</span>
              </li>
              <li className="flex gap-3 text-gray-400">
                <Phone className="text-emerald-500 shrink-0" size={20} />
                <span className="font-medium">+1 (800) 123-4567</span>
              </li>
              <li className="flex gap-3 text-gray-400">
                <Mail className="text-emerald-500 shrink-0" size={20} />
                <span className="font-medium">support@freshcart.test</span>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-gray-800 text-center md:flex md:justify-between md:text-left text-gray-500 text-sm font-medium">
          <p>&copy; {new Date().getFullYear()} FreshCart. All rights reserved.</p>
          <div className="mt-4 md:mt-0 space-x-4">
            <Link href="#" prefetch={false} className="hover:text-emerald-400 transition-colors">Privacy Policy</Link>
            <span>|</span>
            <Link href="#" prefetch={false} className="hover:text-emerald-400 transition-colors">Cookie Policy</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
