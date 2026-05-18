"use client";

import { useState, useEffect, useCallback } from "react";
import { useAuth } from "@/context/AuthContext";
import { API_URL } from "@/lib/config";
import { Loader2, Users, User, ShieldAlert, Plus, X, Pencil, Eye, SlidersHorizontal, RotateCcw, MapPin } from "lucide-react";
import Link from "next/link";

interface CustomerUser {
  id: string;
  name: string;
  email: string | null;
  phone: string | null;
  role: string;
  isGuest: boolean;
  createdAt: string;
  totalOrderAmount?: number;
  totalOrderCount?: number;
  rewardPoints?: number;
  area?: string | null;
  city?: string | null;
}

export default function AdminCustomersPage() {
  const { logout } = useAuth();
  const [customers, setCustomers] = useState<CustomerUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreate, setShowCreate] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState({ name: "", email: "", phone: "", password: "", isGuest: false, role: "USER" });
  const [editTarget, setEditTarget] = useState<CustomerUser | null>(null);
  
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    name: "",
    contact: "",     // matches email or phone
    location: "",   // matches city or area
    type: "ALL" as "ALL" | "REGISTERED" | "GUEST",
    minOrders: "",
    minSpend: "",
  });

  const setFilter = (key: keyof typeof filters, value: string) =>
    setFilters(f => ({ ...f, [key]: value }));

  const resetFilters = () =>
    setFilters({ name: "", contact: "", location: "", type: "ALL", minOrders: "", minSpend: "" });

  const activeFilterCount = Object.entries(filters).filter(([k, v]) => k !== 'type' ? v !== "" : v !== "ALL").length;

  const getToken = () => (typeof window !== "undefined" ? localStorage.getItem("freshcart_access_token") || "" : "");

  const handleForceLogout = useCallback(() => {
    logout();
  }, [logout]);

  const fetchCustomers = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/api/users`, {
        headers: { Authorization: `Bearer ${getToken()}` },
      });
      if (res.status === 401) return handleForceLogout();
      const data = await res.json();
      if (data.success) setCustomers(data.data);
    } finally {
      setLoading(false);
    }
  }, [handleForceLogout]);

  const handleUpdate = async () => {
    if (!editTarget) return;
    setSaving(true);
    setError("");
    try {
      const res = await fetch(`${API_URL}/api/users/${editTarget.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${getToken()}` },
        body: JSON.stringify({ name: form.name, role: form.role, password: form.password }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) throw new Error(data.message || data.error || "Failed to update customer");
      
      setEditTarget(null);
      setForm({ name: "", email: "", phone: "", password: "", isGuest: false, role: "USER" });
      fetchCustomers();
    } catch (e: any) {
      setError(e.message);
    } finally {
      setSaving(false);
    }
  };

  const openEdit = (customer: CustomerUser) => {
    setEditTarget(customer);
    setForm({ name: customer.name, email: customer.email || "", phone: customer.phone || "", password: "", isGuest: customer.isGuest, role: customer.role });
    setError("");
  };

  const closeModal = () => {
    setShowCreate(false);
    setEditTarget(null);
    setForm({ name: "", email: "", phone: "", password: "", isGuest: false, role: "USER" });
    setError("");
  };

  useEffect(() => { fetchCustomers(); }, [fetchCustomers]);

  const handleCreate = async () => {
    setSaving(true);
    setError("");
    try {
      const res = await fetch(`${API_URL}/api/users`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${getToken()}` },
        body: JSON.stringify({ ...form, isGuest: Boolean(form.isGuest) }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) throw new Error(data.message || data.error || "Failed to create customer");
      
      setShowCreate(false);
      setForm({ name: "", email: "", phone: "", password: "", isGuest: false, role: "USER" });
      fetchCustomers();
    } catch (e: any) {
      setError(e.message);
    } finally {
      setSaving(false);
    }
  };

  const filteredCustomers = customers.filter(c => {
    if (filters.type === "GUEST" && !c.isGuest) return false;
    if (filters.type === "REGISTERED" && c.isGuest) return false;

    if (filters.name && !c.name?.toLowerCase().includes(filters.name.toLowerCase())) return false;

    if (filters.contact) {
      const lower = filters.contact.toLowerCase();
      const matchEmail = c.email?.toLowerCase().includes(lower);
      const matchPhone = c.phone?.toLowerCase().includes(lower);
      if (!matchEmail && !matchPhone) return false;
    }

    if (filters.location) {
      const lower = filters.location.toLowerCase();
      const matchCity = c.city?.toLowerCase().includes(lower);
      const matchArea = c.area?.toLowerCase().includes(lower);
      if (!matchCity && !matchArea) return false;
    }

    if (filters.minOrders !== "" && (c.totalOrderCount || 0) < Number(filters.minOrders)) return false;
    if (filters.minSpend !== "" && (c.totalOrderAmount || 0) < Number(filters.minSpend)) return false;

    return true;
  });

  const hasActiveFilters = activeFilterCount > 0;

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-black text-gray-900 dark:text-white tracking-tight">Customers</h1>
          <p className="text-gray-500 text-sm mt-1">View all registered and guest customers on your platform.</p>
        </div>
        <button
          onClick={() => { setShowCreate(true); setError(""); }}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-bold px-4 py-2.5 rounded-xl transition-all shadow-lg shadow-blue-600/20"
        >
          <Plus size={18} /> Add Customer
        </button>
      </div>

      {/* Advanced Filters Toggle */}
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-3">
          <button
            onClick={() => setShowFilters(f => !f)}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-sm transition-all border shadow-sm ${
              showFilters || hasActiveFilters
                ? 'bg-blue-600 text-white border-blue-600 shadow-blue-500/20'
                : 'bg-white dark:bg-gray-900 text-gray-600 dark:text-gray-400 border-gray-100 dark:border-gray-800 hover:border-blue-300'
            }`}
          >
            <SlidersHorizontal size={16} />
            Filters
            {activeFilterCount > 0 && (
              <span className="ml-1 bg-white/30 text-white text-xs font-black px-1.5 py-0.5 rounded-full leading-none">
                {activeFilterCount}
              </span>
            )}
          </button>
          {hasActiveFilters && (
            <button
              onClick={resetFilters}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-bold text-gray-500 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-all border border-transparent hover:border-red-100"
            >
              <RotateCcw size={14} /> Reset
            </button>
          )}
          <span className="ml-auto text-xs font-bold text-gray-400 uppercase tracking-widest">
            {filteredCustomers.length} of {customers.length} customers
          </span>
        </div>

        {/* Filter Panel */}
        {showFilters && (
          <div className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-2xl p-5 shadow-sm">
            <p className="text-xs font-black text-gray-400 uppercase tracking-widest mb-4">Filter by</p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {/* Name */}
              <div>
                <label className="block text-xs font-bold text-gray-500 mb-1.5">Customer Name</label>
                <input
                  value={filters.name}
                  onChange={e => setFilter('name', e.target.value)}
                  placeholder="e.g. Rahat"
                  className="w-full px-3 py-2.5 text-sm bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 dark:text-white transition-all"
                />
              </div>
              {/* Phone / Email */}
              <div>
                <label className="block text-xs font-bold text-gray-500 mb-1.5">Phone or Email</label>
                <input
                  value={filters.contact}
                  onChange={e => setFilter('contact', e.target.value)}
                  placeholder="017XX... or user@email.com"
                  className="w-full px-3 py-2.5 text-sm bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 dark:text-white transition-all"
                />
              </div>
              {/* City / Area */}
              <div>
                <label className="block text-xs font-bold text-gray-500 mb-1.5 flex items-center gap-1"><MapPin size={12} /> City or Area</label>
                <input
                  value={filters.location}
                  onChange={e => setFilter('location', e.target.value)}
                  placeholder="e.g. Dhaka, Mirpur..."
                  className="w-full px-3 py-2.5 text-sm bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 dark:text-white transition-all"
                />
              </div>
              {/* Account Type */}
              <div>
                <label className="block text-xs font-bold text-gray-500 mb-1.5">Account Type</label>
                <select
                  value={filters.type}
                  onChange={e => setFilter('type', e.target.value)}
                  className="w-full px-3 py-2.5 text-sm bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 dark:text-white transition-all"
                >
                  <option value="ALL">All</option>
                  <option value="REGISTERED">Registered</option>
                  <option value="GUEST">Guest</option>
                </select>
              </div>
              {/* Min Orders */}
              <div>
                <label className="block text-xs font-bold text-gray-500 mb-1.5">Min. Order Count</label>
                <input
                  type="number"
                  min={0}
                  value={filters.minOrders}
                  onChange={e => setFilter('minOrders', e.target.value)}
                  placeholder="e.g. 3"
                  className="w-full px-3 py-2.5 text-sm bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 dark:text-white transition-all"
                />
              </div>
              {/* Min Spend */}
              <div>
                <label className="block text-xs font-bold text-gray-500 mb-1.5">Min. Total Spent (৳)</label>
                <input
                  type="number"
                  min={0}
                  value={filters.minSpend}
                  onChange={e => setFilter('minSpend', e.target.value)}
                  placeholder="e.g. 500"
                  className="w-full px-3 py-2.5 text-sm bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 dark:text-white transition-all"
                />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Table */}
      <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 overflow-hidden shadow-sm">
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="animate-spin text-emerald-500" size={32} />
          </div>
        ) : filteredCustomers.length === 0 ? (
          <div className="text-center py-20 text-gray-400">
            <Users size={48} className="mx-auto mb-4 opacity-30" />
            <p className="font-medium">No customers found matching criteria.</p>
          </div>
        ) : (
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-800/50">
                <th className="text-left px-6 py-3 text-xs font-black uppercase tracking-widest text-gray-500">Customer</th>
                <th className="text-left px-6 py-3 text-xs font-black uppercase tracking-widest text-gray-500">Contact</th>
                <th className="text-left px-6 py-3 text-xs font-black uppercase tracking-widest text-gray-500">Account Type</th>
                <th className="text-left px-6 py-3 text-xs font-black uppercase tracking-widest text-gray-500">Location</th>
                <th className="text-left px-6 py-3 text-xs font-black uppercase tracking-widest text-gray-500">Total Spent</th>
                <th className="text-left px-6 py-3 text-xs font-black uppercase tracking-widest text-gray-500">Reward Points</th>
                <th className="text-left px-6 py-3 text-xs font-black uppercase tracking-widest text-gray-500">Joined</th>
                <th className="text-right px-6 py-3 text-xs font-black uppercase tracking-widest text-gray-500">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredCustomers.map((customer) => (
                <tr key={customer.id} className="border-b border-gray-50 dark:border-gray-800/50 hover:bg-gray-50 dark:hover:bg-gray-800/30 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className={`w-9 h-9 rounded-xl flex items-center justify-center text-white font-black text-sm p-1 ${customer.isGuest ? 'bg-orange-400' : 'bg-blue-500'}`}>
                        {customer.isGuest ? <ShieldAlert size={18} /> : <User size={18} />}
                      </div>
                      <div>
                        <p className="font-bold text-gray-900 dark:text-white text-sm">{customer.name}</p>
                        {customer.role !== 'USER' && (
                          <p className="text-xs text-emerald-600 dark:text-emerald-400 font-semibold">{customer.role}</p>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm">
                      {customer.phone && <p className="text-gray-900 dark:text-white font-medium">{customer.phone}</p>}
                      {customer.email && <p className="text-gray-500 text-xs mt-0.5">{customer.email}</p>}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    {customer.isGuest ? (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-orange-50 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400 text-xs font-bold">
                        Guest Checkout
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 text-xs font-bold">
                        Registered User
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <p className="font-bold text-gray-900 dark:text-white text-sm">{customer.area || <span className="text-gray-400 italic font-normal">N/A</span>}</p>
                    {customer.city && <p className="text-xs text-gray-500 mt-0.5">{customer.city}</p>}
                  </td>
                  <td className="px-6 py-4">
                    <p className="font-black text-gray-900 dark:text-white">৳{(customer.totalOrderAmount || 0).toLocaleString()}</p>
                    <p className="font-bold text-xs text-gray-500 mt-1">{customer.totalOrderCount || 0} Orders</p>
                  </td>
                  <td className="px-6 py-4">
                    <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 font-bold text-sm">
                      {customer.rewardPoints || 0}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm font-bold text-gray-500">
                    {new Date(customer.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Link 
                        href={`/admin/customers/${customer.id}`}
                        className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-500 hover:text-emerald-500 transition-colors inline-block"
                        title="View Orders"
                      >
                        <Eye size={16} />
                      </Link>
                      <button 
                        onClick={() => openEdit(customer)}
                        className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-500 hover:text-blue-500 transition-colors inline-block"
                        title="Edit Customer"
                      >
                        <Pencil size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Create/Edit Modal */}
      {(showCreate || editTarget) && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={closeModal} />
          <div className="relative w-full max-w-lg bg-white dark:bg-gray-950 rounded-3xl border border-gray-100 dark:border-gray-800 shadow-2xl p-8 max-h-[90vh] overflow-y-auto [&::-webkit-scrollbar]:hidden">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-black dark:text-white">{editTarget ? "Edit Customer" : "New Customer Signup"}</h2>
              <button onClick={closeModal} className="text-gray-400 hover:text-gray-900 dark:hover:text-white"><X size={20} /></button>
            </div>

            {error && <div className="bg-red-50 dark:bg-red-900/20 text-red-600 px-4 py-3 rounded-xl mb-5 text-sm">{error}</div>}

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">Name</label>
                <input value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                  className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-gray-900 dark:text-white"
                  placeholder="Full name" />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">Email (Optional)</label>
                <input type="email" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                  className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-gray-900 dark:text-white"
                  placeholder="customer@example.com" />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">Phone Number (Optional)</label>
                <input type="tel" value={form.phone} onChange={e => setForm(f => ({ ...f, phone: e.target.value }))}
                  className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-gray-900 dark:text-white"
                  placeholder="e.g. 017XXXXXXX" />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">Password {editTarget && "(Leave blank to keep same)"}</label>
                <input type="text" value={form.password} onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
                  className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-gray-900 dark:text-white"
                  placeholder={editTarget ? "New Password" : "Leave empty to auto-generate"} />
              </div>
              {editTarget && (
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">Role</label>
                  <select value={form.role} onChange={e => setForm(f => ({ ...f, role: e.target.value }))}
                    className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-gray-900 dark:text-white">
                    <option value="USER">Customer</option>
                    <option value="ADMIN">Admin</option>
                    <option value="SUPER_ADMIN">Super Admin</option>
                  </select>
                </div>
              )}
              {!editTarget && (
                <div className="pt-2">
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input type="checkbox" checked={form.isGuest} onChange={e => setForm(f => ({ ...f, isGuest: e.target.checked }))} className="w-5 h-5 rounded text-blue-600 focus:ring-blue-500 bg-gray-50 dark:bg-gray-900 border-gray-200 dark:border-gray-700" />
                    <span className="text-sm font-bold text-gray-700 dark:text-gray-300">Mark as Guest User <span className="font-normal text-gray-400 italic">(Useful for phone orders)</span></span>
                  </label>
                </div>
              )}
            </div>

            <div className="flex gap-3 mt-8">
              <button onClick={closeModal} className="flex-1 px-4 py-3 border border-gray-200 dark:border-gray-700 rounded-xl font-bold text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800">
                Cancel
              </button>
              <button onClick={editTarget ? handleUpdate : handleCreate} disabled={saving || !form.name}
                className="flex-1 px-4 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl transition-all disabled:opacity-50 flex items-center justify-center gap-2">
                {saving ? <Loader2 size={16} className="animate-spin" /> : null}
                {editTarget ? "Save Changes" : "Create Customer"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
