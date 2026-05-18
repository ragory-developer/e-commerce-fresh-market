"use client";

import { useState, useEffect } from "react";
import { MapPin, Loader2, Plus, CheckCircle2, ChevronDown, Pencil, Trash2, X } from "lucide-react";
import { API_URL } from "@/lib/config";
import SearchableDropdown from "@/components/ui/SearchableDropdown";

interface Address {
  id: string;
  label: string;
  address: string;
  city: string;
  area: string;
  state?: string;
  stateId?: string;
  cityId?: string;
  areaId?: string;
  recipientName?: string;
  recipientPhone?: string;
}

interface LocationItem {
  id: string;
  name: string;
}

interface AddressFormProps {
  onAddressSelect: (address: Address | null) => void;
  user: any;
}

const emptyForm = {
  label: "Home",
  address: "",
  state: "",
  stateId: "",
  city: "",
  cityId: "",
  area: "",
  areaId: "",
  phone: "",
  recipientName: "",
  recipientPhone: "",
};

export default function AddressForm({ onAddressSelect, user }: AddressFormProps) {
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const [states, setStates] = useState<LocationItem[]>([]);
  const [cities, setCities] = useState<LocationItem[]>([]);
  const [areas, setAreas] = useState<LocationItem[]>([]);
  const [loadingCities, setLoadingCities] = useState(false);
  const [loadingAreas, setLoadingAreas] = useState(false);

  const [formData, setFormData] = useState({ 
    ...emptyForm, 
    phone: user?.phone || "",
    recipientName: user?.name || "",
    recipientPhone: user?.phone || ""
  });

  const getToken = () => localStorage.getItem('freshcart_access_token') || localStorage.getItem('token') || '';

  useEffect(() => {
    fetchStates();
    if (!user?.isGuest) fetchAddresses();
    else { setLoading(false); setShowForm(true); }
  }, [user]);

  // Pre-fill cities/areas when editing an existing address
  useEffect(() => {
    if (formData.stateId) fetchCities(formData.stateId, false);
  }, [formData.stateId]);

  useEffect(() => {
    if (formData.cityId) fetchAreas(formData.cityId, false);
  }, [formData.cityId]);



  const fetchStates = async () => {
    try {
      const res = await fetch(`${API_URL}/api/locations/states`);
      const data = await res.json();
      if (data.success) setStates(data.data);
    } catch {}
  };

  /** fetch cities — optionally reset child selections */
  const fetchCities = async (stateId: string, resetChildren = true) => {
    if (!stateId) { setCities([]); setAreas([]); return; }
    setLoadingCities(true);
    try {
      const res = await fetch(`${API_URL}/api/locations/cities?stateId=${stateId}`);
      const data = await res.json();
      if (data.success) setCities(data.data);
    } finally { setLoadingCities(false); }
    if (resetChildren) { setAreas([]); setFormData(f => ({ ...f, cityId: "", city: "", areaId: "", area: "" })); }
  };

  const fetchAreas = async (cityId: string, resetChildren = true) => {
    if (!cityId) { setAreas([]); return; }
    setLoadingAreas(true);
    try {
      const res = await fetch(`${API_URL}/api/locations/areas?cityId=${cityId}`);
      const data = await res.json();
      if (data.success) setAreas(data.data);
    } finally { setLoadingAreas(false); }
    if (resetChildren) setFormData(f => ({ ...f, areaId: "", area: "" }));
  };

  const fetchAddresses = async () => {
    try {
      const res = await fetch(`${API_URL}/api/users/addresses`, {
        headers: { Authorization: `Bearer ${getToken()}` }
      });
      const data = await res.json();
      if (data.success && data.data?.length > 0) {
        setAddresses(data.data);
        setShowForm(false);
        handleSelect(data.data[0]);
      } else {
        setShowForm(true);
      }
    } catch { setShowForm(true); }
    finally { setLoading(false); }
  };

  const handleSelect = (addr: Address) => {
    setSelectedId(addr.id);
    onAddressSelect(addr);
  };

  const startEdit = (addr: Address) => {
    setEditingId(addr.id);
    setFormData({
      label: addr.label,
      address: addr.address,
      state: addr.state || "",
      stateId: addr.stateId || "",
      city: addr.city || "",
      cityId: addr.cityId || "",
      area: addr.area || "",
      areaId: addr.areaId || "",
      phone: user?.phone || "",
      recipientName: addr.recipientName || user?.name || "",
      recipientPhone: addr.recipientPhone || user?.phone || "",
    });
    setShowForm(true);
  };

  const resetForm = () => {
    setFormData({ 
      ...emptyForm, 
      phone: user?.phone || "",
      recipientName: user?.name || "",
      recipientPhone: user?.phone || ""
    });
    setEditingId(null);
    setShowForm(false);
    setCities([]); setAreas([]);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (user?.isGuest) {
      // Guest: just use the form data as is (no DB save needed - order stores it directly)
      const mockAddr: Address = { ...formData, id: 'guest-addr-temp' };
      setAddresses([mockAddr]);
      setSelectedId(mockAddr.id);
      onAddressSelect(mockAddr);
      setShowForm(false);
      return;
    }

    setSaving(true);
    try {
      const isEditing = !!editingId;
      const url = isEditing
        ? `${API_URL}/api/users/addresses/${editingId}`
        : `${API_URL}/api/users/addresses`;
      const res = await fetch(url, {
        method: isEditing ? "PUT" : "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${getToken()}` },
        body: JSON.stringify(formData)
      });
      const data = await res.json();
      if (data.success) {
        if (isEditing) {
          const updated = addresses.map(a => a.id === editingId ? data.data : a);
          setAddresses(updated);
          handleSelect(data.data);
        } else {
          const next = [...addresses, data.data];
          setAddresses(next);
          handleSelect(data.data);
        }
        resetForm();
      } else {
        alert(data.message || "Failed to save address.");
      }
    } catch { alert("Network error. Please try again."); }
    finally { setSaving(false); }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this address?")) return;
    try {
      await fetch(`${API_URL}/api/users/addresses/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${getToken()}` }
      });
      const next = addresses.filter(a => a.id !== id);
      setAddresses(next);
      if (selectedId === id) {
        onAddressSelect(null);
        setSelectedId(null);
        if (next.length > 0) handleSelect(next[0]);
        else setShowForm(true);
      }
    } catch { alert("Network error"); }
  };

  const inputClass = "w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 outline-none focus:border-blue-500 text-sm transition-colors";

  if (loading) return (
    <div className="flex justify-center p-8"><Loader2 className="animate-spin text-blue-500" /></div>
  );

  return (
    <div className="bg-white dark:bg-gray-800 rounded-3xl p-8 shadow-sm border border-gray-100 dark:border-gray-700">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-black text-gray-900 dark:text-white uppercase tracking-tighter italic">
            Delivery Address
          </h2>
          <p className="text-gray-500 dark:text-gray-400 mt-1 text-sm flex items-center gap-2">
            <MapPin size={14} /> Where should we deliver your order?
          </p>
        </div>
        {!showForm && !user?.isGuest && (
          <button onClick={() => setShowForm(true)} className="flex items-center gap-1.5 text-sm font-bold text-blue-600 hover:text-blue-700 transition-colors">
            <Plus size={16} /> Add New
          </button>
        )}
        {showForm && (editingId || addresses.length > 0) && (
          <button onClick={resetForm} className="flex items-center gap-1.5 text-sm font-medium text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 transition-colors">
            <X size={16} /> Cancel
          </button>
        )}
      </div>

      {/* Saved address cards */}
      {!showForm && addresses.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-2">
          {addresses.map(addr => (
            <div
              key={addr.id}
              onClick={() => handleSelect(addr)}
              className={`p-4 rounded-2xl border-2 cursor-pointer transition-all group relative ${
                selectedId === addr.id
                  ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                  : 'border-gray-100 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-700'
              }`}
            >
              <div className="flex justify-between items-start mb-2">
                <div className="flex items-center gap-2">
                  <p className="text-sm font-black text-gray-900 dark:text-white uppercase tracking-tight">{addr.recipientName || "Guest"}</p>
                  <span className="inline-block px-1.5 py-0.5 bg-gray-100 dark:bg-gray-800 text-[10px] font-bold rounded-md text-gray-500 uppercase tracking-widest">{addr.label}</span>
                </div>
                {selectedId === addr.id && <CheckCircle2 size={18} className="text-blue-500" />}
              </div>
              <p className="text-sm font-semibold text-gray-900 dark:text-white mt-2">{addr.address}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                {[addr.area, addr.city, addr.state].filter(Boolean).join(", ")}
              </p>
              <p className="text-[10px] font-bold text-gray-400 mt-1 uppercase tracking-widest">{addr.recipientPhone}</p>
              {/* Edit / Delete actions */}
              <div className="flex gap-2 mt-3 opacity-0 group-hover:opacity-100 transition-opacity" onClick={e => e.stopPropagation()}>
                <button
                  onClick={() => startEdit(addr)}
                  className="flex items-center gap-1 text-xs font-bold text-blue-600 hover:text-blue-700 transition-colors"
                >
                  <Pencil size={12} /> Edit
                </button>
                <button
                  onClick={() => handleDelete(addr.id)}
                  className="flex items-center gap-1 text-xs font-bold text-red-500 hover:text-red-600 transition-colors"
                >
                  <Trash2 size={12} /> Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* New / Edit address form */}
      {showForm && (
        <form onSubmit={handleSubmit} className="space-y-4 mt-2">
          <div className="grid grid-cols-2 gap-4">
            {/* Recipient Name */}
            <div>
              <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1.5">Recipient Name</label>
              <input
                required
                type="text"
                value={formData.recipientName}
                onChange={e => setFormData({ ...formData, recipientName: e.target.value })}
                placeholder="Name of person receiving"
                className={inputClass}
              />
            </div>

            {/* Recipient Mobile */}
            <div>
              <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1.5">Recipient Mobile</label>
              <input
                required
                type="tel"
                value={formData.recipientPhone}
                onChange={e => setFormData({ ...formData, recipientPhone: e.target.value })}
                placeholder="Mobile of person receiving"
                className={inputClass}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {/* Label */}
            <div>
              <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1.5">Address Label</label>
              <div className="relative">
                <select value={formData.label} onChange={e => setFormData({ ...formData, label: e.target.value })} className={inputClass}>
                  <option value="Home">Home</option>
                  <option value="Work">Work</option>
                  <option value="Other">Other</option>
                </select>
                <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
              </div>
            </div>

            {/* Division */}
            <div>
              <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1.5">Division</label>
              <SearchableDropdown
                value={formData.stateId}
                onChange={v => {
                  const state = states.find(s => s.id === v);
                  setFormData(f => ({ ...f, stateId: v, state: state?.name || "", cityId: "", city: "", areaId: "", area: "" }));
                  fetchCities(v, true);
                }}
                options={states.map(s => ({ value: s.id, label: s.name }))}
                placeholder="Select division..."
                searchPlaceholder="Search division..."
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {/* City */}
            <div>
              <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1.5">City / District</label>
              {loadingCities ? (
                <div className={`${inputClass} flex items-center gap-2 text-gray-400`}><Loader2 size={14} className="animate-spin" /> Loading...</div>
              ) : (
                <SearchableDropdown
                  value={formData.cityId}
                  onChange={v => {
                    const city = cities.find(c => c.id === v);
                    setFormData(f => ({ ...f, cityId: v, city: city?.name || "", areaId: "", area: "" }));
                    fetchAreas(v, true);
                  }}
                  options={cities.map(c => ({ value: c.id, label: c.name }))}
                  placeholder={!formData.stateId ? "Select division first" : "Select city..."}
                  searchPlaceholder="Search city..."
                  disabled={!formData.stateId}
                />
              )}
            </div>

            {/* Area */}
            <div>
              <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1.5">Area / Upazila</label>
              {loadingAreas ? (
                <div className={`${inputClass} flex items-center gap-2 text-gray-400`}><Loader2 size={14} className="animate-spin" /> Loading...</div>
              ) : (
                <SearchableDropdown
                  value={formData.areaId}
                  onChange={v => {
                    const area = areas.find(a => a.id === v);
                    setFormData(f => ({ ...f, areaId: v, area: area?.name || "" }));
                  }}
                  options={areas.map(a => ({ value: a.id, label: a.name }))}
                  placeholder={!formData.cityId ? "Select city first" : "Select area..."}
                  searchPlaceholder="Search area..."
                  disabled={!formData.cityId}
                />
              )}
            </div>
          </div>



          <div>
            <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1.5">Street Address</label>
            <textarea
              required
              rows={2}
              value={formData.address}
              onChange={e => setFormData({ ...formData, address: e.target.value })}
              placeholder="House no., road, building, floor..."
              className={inputClass + " resize-none"}
            />
          </div>

          {/* Phone for guests who don't have it */}
          {user?.isGuest && !user?.phone && (
            <div>
              <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1.5">Phone Number</label>
              <input
                required type="tel"
                value={formData.phone}
                onChange={e => setFormData({ ...formData, phone: e.target.value })}
                placeholder="01XXX-XXXXXX"
                className={inputClass}
              />
            </div>
          )}

          <div className="flex gap-3 pt-1">
            <button type="submit" disabled={saving} className="flex-1 py-3 bg-gray-900 hover:bg-black dark:bg-white dark:hover:bg-gray-100 dark:text-black text-white rounded-xl font-bold transition-colors disabled:opacity-50 flex items-center justify-center gap-2">
              {saving ? <Loader2 size={18} className="animate-spin" /> : (user?.isGuest ? "Use this Address" : editingId ? "Update Address" : "Save Address")}
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
