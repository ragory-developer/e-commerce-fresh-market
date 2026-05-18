"use client";

import Link from "next/link";
import { CheckCircle2, Package, ShoppingBag, ArrowRight } from "lucide-react";
import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { API_URL } from "@/lib/config";
import * as fpixel from "@/lib/fpixel";

function OrderSuccessContent() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get("orderId");
  const [mounted, setMounted] = useState(false);
  const [order, setOrder] = useState<any>(null);

  useEffect(() => {
    setMounted(true);
    if (orderId) {
      fetchOrder(orderId);
    }
  }, [orderId]);

  const fetchOrder = async (id: string) => {
    try {
      const token = localStorage.getItem('freshcart_access_token') || localStorage.getItem('token');
      const res = await fetch(`${API_URL}/api/orders/${id}`, {
        headers: { "Authorization": `Bearer ${token}` }
      });
      const json = await res.json();
      if (json.success) {
        setOrder(json.data);
        // Trigger Purchase event
        fpixel.event('Purchase', {
          content_ids: json.data.items.map((i: any) => i.productId),
          content_type: 'product',
          value: json.data.total,
          currency: 'BDT',
          num_items: json.data.items.length
        });
      }
    } catch (e) {
      console.error("Failed to fetch order for tracking:", e);
    }
  };

  if (!mounted) return null;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex items-center justify-center p-4">
      <div className="max-w-md w-full text-center">
        <div className="mb-8 flex justify-center">
          <div className="relative">
            <div className="absolute inset-0 bg-blue-100 dark:bg-blue-900/30 rounded-full animate-ping opacity-25"></div>
            <div className="relative bg-white dark:bg-gray-900 p-6 rounded-full shadow-2xl shadow-blue-500/10">
              <CheckCircle2 className="w-16 h-16 text-blue-600" />
            </div>
          </div>
        </div>

        <h1 className="text-4xl font-black text-gray-900 dark:text-white mb-4 tracking-tighter italic uppercase">
          Order Received!
        </h1>
        <p className="text-gray-500 dark:text-gray-400 mb-8 font-medium">
          Thank you for choosing FreshCart. Your order is being processed and will be delivered soon.
        </p>

        {orderId && (
          <div className="bg-white dark:bg-gray-900 rounded-3xl p-6 border border-gray-100 dark:border-gray-800 shadow-sm mb-8">
            <div className="text-xs font-black uppercase tracking-widest text-gray-400 mb-1">Order Identifier</div>
            <div className="text-lg font-mono font-bold text-gray-900 dark:text-white">#{orderId}</div>
          </div>
        )}

        <div className="grid grid-cols-1 gap-4">
          <Link 
            href="/"
            className="flex items-center justify-center gap-3 px-8 py-4 bg-gray-900 hover:bg-black dark:bg-white dark:hover:bg-gray-100 dark:text-black text-white rounded-2xl font-black uppercase tracking-wider transition-all shadow-xl hover:-translate-y-1 active:translate-y-0"
          >
            <ShoppingBag className="w-5 h-5" />
            <span>Continue Shopping</span>
          </Link>
          
          <Link 
            href="/profile/orders"
            className="flex items-center justify-center gap-2 text-sm font-bold text-gray-500 hover:text-blue-600 transition-colors py-2"
          >
            <span>View All Orders</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="mt-12 flex items-center justify-center gap-6 opacity-30">
          <Package className="w-6 h-6 text-gray-400" />
          <div className="h-px w-12 bg-gray-300 dark:bg-gray-700"></div>
          <CheckCircle2 className="w-6 h-6 text-gray-400" />
          <div className="h-px w-12 bg-gray-300 dark:bg-gray-700"></div>
          <ShoppingBag className="w-6 h-6 text-gray-400" />
        </div>
      </div>
    </div>
  );
}

export default function OrderSuccessPage() {
  return (
    <Suspense fallback={null}>
      <OrderSuccessContent />
    </Suspense>
  );
}
