"use client";

import { useEffect, useState } from "react";
import { API_URL } from "@/lib/config";
import { Package, Search, Calendar, User, Phone, Mail, X, MapPin, CreditCard, ChevronRight, CheckCircle2, Truck, Clock, AlertCircle, ChevronLeft, ChevronsLeft, ChevronsRight, Filter } from "lucide-react";
import { useSearchParams, useRouter } from "next/navigation";

// Added a generic fallback wrapper for Suspense in Next.js when using useSearchParams
import { Suspense } from "react";

interface OrderItem {
  id: string;
  quantity: number;
  product: { name: string };
  price: number;
}

interface Order {
  id: string;
  status: string;
  total: number;
  subtotal: number;
  discount: number;
  customerName: string | null;
  customerPhone: string | null;
  couponCode: string | null;
  createdAt: string;
  user: {
    name: string;
    email: string;
    phone: string;
    isGuest: boolean;
  };
  items: OrderItem[];
  deliveryAddress: string;
  deliveryCity: string | null;
  deliveryArea: string | null;
  deliveryState: string | null;
  deliveryFee: number;
  paymentMethod: string;
  paymentStatus: string;
  notes: string | null;
}

function AdminOrdersContent() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [updatingStatus, setUpdatingStatus] = useState(false);
  
  // DataTable States
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(25);
  const [pagination, setPagination] = useState({
    total: 0,
    totalPages: 1
  });

  const searchParams = useSearchParams();
  const router = useRouter();
  
  const couponCode = searchParams.get('couponCode');
  const currentStatus = searchParams.get('status') || 'ALL';

  const statuses = [
    { label: 'All Orders', value: 'ALL' },
    { label: 'Pending', value: 'PENDING' },
    { label: 'Processing', value: 'PROCESSING' },
    { label: 'Shipped', value: 'SHIPPED' },
    { label: 'Delivered', value: 'DELIVERED' },
    { label: 'Cancelled', value: 'CANCELLED' },
  ];

  // Debounce search input
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchQuery);
      setPage(1); // Reset to page 1 on search
    }, 400);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  useEffect(() => {
    const fetchOrders = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem('freshcart_access_token') || localStorage.getItem('token');
        const url = new URL(`${API_URL}/api/orders`);
        url.searchParams.append('page', page.toString());
        url.searchParams.append('limit', limit.toString());
        
        if (couponCode) url.searchParams.append('couponCode', couponCode);
        if (currentStatus !== 'ALL') url.searchParams.append('status', currentStatus);
        if (debouncedSearch) url.searchParams.append('search', debouncedSearch);
        
        const res = await fetch(url.toString(), {
          headers: { "Authorization": `Bearer ${token}` }
        });
        const json = await res.json();
        
        if (json.success) {
          setOrders(json.data);
          if (json.pagination) {
            setPagination({
              total: json.pagination.total,
              totalPages: json.pagination.totalPages
            });
          }
        }
      } catch (err) {
        console.error("Failed to fetch orders", err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchOrders();
  }, [couponCode, currentStatus, debouncedSearch, page, limit]);

  const updateOrderStatus = async (orderId: string, newStatus: string) => {
    setUpdatingStatus(true);
    try {
      const token = localStorage.getItem('freshcart_access_token') || localStorage.getItem('token');
      const res = await fetch(`${API_URL}/api/orders/${orderId}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ status: newStatus })
      });
      const data = await res.json();
      if (data.success) {
        setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status: newStatus } : o));
        if (selectedOrder?.id === orderId) {
          setSelectedOrder(prev => prev ? { ...prev, status: newStatus } : null);
        }
      }
    } catch (err) {
      console.error("Failed to update status", err);
    } finally {
      setUpdatingStatus(false);
    }
  };

  const handleStatusFilter = (status: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (status === 'ALL') params.delete('status');
    else params.set('status', status);
    router.push(`/admin/orders?${params.toString()}`);
  };

  return (
    <div className="max-w-7xl mx-auto space-y-8 pb-12">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-3 tracking-tight">
            <Package size={28} className="text-emerald-600" /> 
            {couponCode ? `Orders: ${couponCode}` : currentStatus === 'ALL' ? "All Orders" : `${currentStatus} Orders`}
          </h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1 text-sm">
            Manage and track all customer orders from one place
          </p>
        </div>
      </div>

      {/* Toolbar: Search & Records Dropdown */}
      <div className="flex flex-col lg:flex-row gap-4 items-center">
        {/* Live Search */}
        <div className="relative w-full lg:max-w-md">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input 
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by ID, Name or Mobile Number..."
            className="w-full pl-12 pr-4 py-3.5 bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-2xl text-sm font-medium text-gray-900 dark:text-white focus:ring-2 focus:ring-emerald-500/20 outline-none transition-all shadow-sm"
          />
        </div>

        {/* Results Per Page Dropdown */}
        <div className="flex items-center gap-3 ml-auto">
          <span className="text-xs font-bold text-gray-500 uppercase tracking-widest hidden md:block">Records:</span>
          <select 
            value={limit}
            onChange={(e) => setLimit(Number(e.target.value))}
            className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-xl px-4 py-3 text-sm font-bold focus:ring-2 focus:ring-emerald-500/20 outline-none cursor-pointer transition-all shadow-sm"
          >
            <option value={10}>10 results</option>
            <option value={25}>25 results</option>
            <option value={50}>50 results</option>
            <option value={100}>100 results</option>
          </select>
        </div>
      </div>

      {/* Status Filter Tabs (Condensed) */}
      <div className="flex flex-wrap gap-2 pb-2">
        {statuses.map((s) => (
          <button
            key={s.value}
            onClick={() => handleStatusFilter(s.value)}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all border ${
              currentStatus === s.value
                ? 'bg-emerald-600 border-emerald-600 text-white shadow-lg shadow-emerald-500/20'
                : 'bg-white dark:bg-gray-900 text-gray-600 dark:text-gray-400 border-gray-100 dark:border-gray-800 hover:border-emerald-300'
            }`}
          >
            {s.label}
          </button>
        ))}
      </div>

      <div className="bg-white dark:bg-gray-900 rounded-[3rem] border border-gray-100 dark:border-gray-800 p-8 shadow-sm min-h-[60vh]">
        {loading ? (
          <div className="py-32 flex flex-col items-center justify-center">
            <div className="w-8 h-8 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin mb-4" />
            <p className="text-gray-500 font-medium">Loading orders...</p>
          </div>
        ) : orders.length === 0 ? (
          <div className="py-32 text-center flex flex-col items-center justify-center">
             <Package size={64} className="text-gray-200 dark:text-gray-800 mb-6" />
             <p className="text-xl font-bold text-gray-400 dark:text-gray-500 tracking-tight">No orders found.</p>
             {couponCode && <p className="text-sm mt-2 text-gray-400">Try a different coupon or check again later.</p>}
          </div>
        ) : (
          <>
            <div className="overflow-x-auto -mx-8">
              <table className="w-full text-left border-collapse min-w-[1000px]">
                <thead>
                  <tr className="bg-gray-50/50 dark:bg-gray-900/50 border-y border-gray-100 dark:border-gray-800">
                    <th className="px-8 py-4 text-[10px] font-black uppercase tracking-[0.2em] text-gray-500">Order ID & Date</th>
                    <th className="px-8 py-4 text-[10px] font-black uppercase tracking-[0.2em] text-gray-500">Customer Details</th>
                    <th className="px-8 py-4 text-[10px] font-black uppercase tracking-[0.2em] text-gray-500">Total & Payment</th>
                    <th className="px-8 py-4 text-[10px] font-black uppercase tracking-[0.2em] text-gray-500">Status</th>
                    <th className="px-8 py-4 text-[10px] font-black uppercase tracking-[0.2em] text-gray-500">Details</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50 dark:divide-gray-800/50 text-sm">
                  {orders.map((order) => (
                    <tr key={order.id} className="hover:bg-gray-50/50 dark:hover:bg-emerald-500/[0.02] transition-colors group">
                      <td className="px-8 py-6">
                        <div className="font-bold text-gray-900 dark:text-white break-all max-w-[120px]">{order.id}</div>
                        <div className="text-[10px] text-gray-500 font-bold mt-1 flex items-center gap-1">
                          <Calendar size={12} className="shrink-0" />
                          {new Date(order.createdAt).toLocaleDateString()}
                          <span className="opacity-50">•</span>
                          {new Date(order.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </div>
                      </td>
                      <td className="px-8 py-6">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-400 flex items-center justify-center font-black text-xs">
                            {order.user?.name ? order.user.name[0].toUpperCase() : 'G'}
                          </div>
                          <div>
                            <p className="font-bold text-gray-900 dark:text-white">
                              {order.customerName || order.user?.name || "Guest"}
                              {order.user?.isGuest && <span className="ml-2 text-[8px] font-black uppercase bg-orange-100 text-orange-600 px-1.5 py-0.5 rounded-md">GUEST</span>}
                            </p>
                            <p className="text-[10px] text-gray-500 font-bold mt-0.5">{order.customerPhone || order.user?.phone || "No phone"}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-8 py-6">
                        <p className="text-lg font-black text-gray-900 dark:text-white">৳{order.total.toFixed(2)}</p>
                        <p className="text-[10px] text-gray-500 font-bold mt-0.5 flex items-center gap-1">
                          {order.paymentMethod} <span className="opacity-50">•</span> {order.paymentStatus}
                        </p>
                      </td>
                      <td className="px-8 py-6">
                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${
                          order.status === 'DELIVERED' ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400' :
                          order.status === 'CANCELLED' ? 'bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-400' :
                          'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'
                        }`}>
                          {order.status}
                        </span>
                      </td>
                      <td className="px-8 py-6">
                        <button 
                           onClick={() => setSelectedOrder(order)}
                           className="p-2.5 rounded-xl bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-emerald-600 hover:text-white dark:hover:bg-emerald-600 transition-all flex items-center gap-2 group-hover:scale-105"
                        >
                           <ChevronRight size={18} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination Footer */}
            <div className="mt-8 pt-8 border-t border-gray-100 dark:border-gray-800 flex flex-col sm:flex-row items-center justify-between gap-6">
              <div className="text-xs font-bold text-gray-500 uppercase tracking-widest">
                Showing <span className="text-gray-900 dark:text-white">{Math.min((page - 1) * limit + 1, pagination.total)}</span> to <span className="text-gray-900 dark:text-white">{Math.min(page * limit, pagination.total)}</span> of <span className="text-gray-900 dark:text-white">{pagination.total}</span> orders
              </div>
              
              <div className="flex items-center gap-2">
                <button 
                  onClick={() => setPage(1)} 
                  disabled={page === 1}
                  className="p-2.5 rounded-xl border border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800 disabled:opacity-30 transition-all"
                >
                  <ChevronsLeft size={16} />
                </button>
                <button 
                  onClick={() => setPage(p => Math.max(1, p - 1))} 
                  disabled={page === 1}
                  className="p-2.5 rounded-xl border border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800 disabled:opacity-30 transition-all font-bold text-xs flex items-center gap-2"
                >
                  <ChevronLeft size={16} /> Previous
                </button>
                
                <div className="flex items-center px-4 py-2 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400 rounded-xl font-black text-xs uppercase tracking-widest border border-emerald-100 dark:border-emerald-800">
                  Page {page} of {pagination.totalPages}
                </div>

                <button 
                  onClick={() => setPage(p => Math.min(pagination.totalPages, p + 1))} 
                  disabled={page === pagination.totalPages}
                  className="p-2.5 rounded-xl border border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800 disabled:opacity-30 transition-all font-bold text-xs flex items-center gap-2"
                >
                  Next <ChevronRight size={16} />
                </button>
                <button 
                  onClick={() => setPage(pagination.totalPages)} 
                  disabled={page === pagination.totalPages}
                  className="p-2.5 rounded-xl border border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800 disabled:opacity-30 transition-all"
                >
                  <ChevronsRight size={16} />
                </button>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Order Details Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setSelectedOrder(null)} />
          <div className="relative bg-white dark:bg-gray-900 w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-[2.5rem] shadow-2xl border border-white/10 slide-up">
            
            {/* Modal Header */}
            <div className="sticky top-0 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border-b border-gray-100 dark:border-gray-800 p-6 flex justify-between items-center z-10">
              <div>
                <h2 className="text-xl font-black text-gray-900 dark:text-white uppercase tracking-tighter italic">Order #{selectedOrder.id}</h2>
                <p className="text-xs text-gray-500 font-bold uppercase tracking-widest mt-1">{new Date(selectedOrder.createdAt).toLocaleString()}</p>
              </div>
              <button onClick={() => setSelectedOrder(null)} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors">
                <X size={24} />
              </button>
            </div>

            <div className="p-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                {/* Left: Shipping & Method */}
                <div className="space-y-6">
                  <div className="bg-gray-50 dark:bg-gray-800/50 p-6 rounded-3xl border border-gray-100 dark:border-gray-800">
                    <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                      <MapPin size={14} /> Shipping Information
                    </h3>
                    <div className="space-y-4">
                      {/* Customer Snapshot */}
                      <div className="pb-4 border-b border-gray-200 dark:border-gray-700">
                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Customer</p>
                        <p className="text-base font-black text-gray-900 dark:text-white">{selectedOrder.customerName || selectedOrder.user?.name || "Guest"}</p>
                        <p className="text-xs text-gray-500 font-bold">{selectedOrder.customerPhone || selectedOrder.user?.phone || "No phone"}</p>
                      </div>

                      <div className="space-y-3 pt-2">
                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Delivery Address</p>
                        <p className="text-sm font-bold text-gray-900 dark:text-white leading-snug">{selectedOrder.deliveryAddress}</p>
                        <p className="text-xs text-gray-600 dark:text-gray-400 font-medium whitespace-pre-line leading-relaxed">
                          {[selectedOrder.deliveryArea, selectedOrder.deliveryCity, selectedOrder.deliveryState].filter(Boolean).join(", ")}
                        </p>
                      </div>
                      {selectedOrder.notes && (
                        <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                           <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Customer Note</p>
                           <p className="text-xs text-gray-700 dark:text-gray-300 italic">"{selectedOrder.notes}"</p>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="bg-gray-50 dark:bg-gray-800/50 p-6 rounded-3xl border border-gray-100 dark:border-gray-800">
                    <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                      <CreditCard size={14} /> Payment & Status
                    </h3>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Method</p>
                        <p className="text-sm font-bold text-gray-900 dark:text-white mt-1">{selectedOrder.paymentMethod}</p>
                      </div>
                      <div>
                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Status</p>
                        <p className="text-sm font-bold text-gray-900 dark:text-white mt-1 uppercase">{selectedOrder.paymentStatus}</p>
                      </div>
                    </div>
                    <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
                      <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-3">Update Order Status</p>
                      <div className="grid grid-cols-2 gap-2">
                        {['PENDING', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'CANCELLED'].map((stat) => (
                           <button 
                             key={stat}
                             onClick={() => updateOrderStatus(selectedOrder.id, stat)}
                             disabled={updatingStatus || selectedOrder.status === stat}
                             className={`px-3 py-2 rounded-lg text-[10px] font-bold transition-all border ${
                               selectedOrder.status === stat 
                                ? 'bg-emerald-600 text-white border-emerald-600 shadow-md' 
                                : 'bg-white dark:bg-gray-900 text-gray-600 dark:text-gray-400 border-gray-200 dark:border-gray-700 hover:border-emerald-300'
                             }`}
                           >
                             {stat}
                           </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Right: Items Table */}
                <div className="bg-gray-900 dark:bg-black rounded-3xl p-6 shadow-2xl overflow-hidden self-start">
                  <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest mb-6 flex items-center gap-2">
                    <Package size={14} /> Order Items
                  </h3>
                  <div className="space-y-4 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
                    {selectedOrder.items.map((item, idx) => (
                      <div key={idx} className="flex items-center justify-between pb-4 border-b border-white/5 last:border-0 last:pb-0">
                        <div className="flex flex-col">
                          <span className="text-sm font-bold text-white leading-tight">{item.product.name}</span>
                          <span className="text-[10px] text-gray-500 font-bold uppercase tracking-widest mt-1">Qty: {item.quantity} × ৳{item.price.toFixed(2)}</span>
                        </div>
                        <span className="text-sm font-black text-emerald-400">৳{(item.quantity * item.price).toFixed(2)}</span>
                      </div>
                    ))}
                  </div>

                  <div className="mt-8 pt-6 border-t border-white/10 space-y-2">
                    <div className="flex justify-between text-xs text-gray-400 font-bold">
                       <span>SUBTOTAL</span>
                       <span>৳{selectedOrder.subtotal.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-xs text-gray-100 font-bold">
                       <span>DELIVERY FEE</span>
                       <span>৳{selectedOrder.deliveryFee.toFixed(2)}</span>
                    </div>
                    {selectedOrder.discount > 0 && (
                      <div className="flex justify-between text-xs text-emerald-400 font-bold">
                        <span>DISCOUNT {selectedOrder.couponCode && `(${selectedOrder.couponCode})`}</span>
                        <span>-৳{selectedOrder.discount.toFixed(2)}</span>
                      </div>
                    )}
                    <div className="flex justify-between items-center pt-4 mt-2 border-t border-white/20">
                       <span className="text-sm font-black text-white uppercase tracking-widest">Grand Total</span>
                       <span className="text-2xl font-black text-emerald-400 tracking-tight">৳{selectedOrder.total.toFixed(2)}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function AdminOrdersPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <AdminOrdersContent />
    </Suspense>
  );
}
