"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { API_URL } from "@/lib/config";
import UserSidebar from "@/components/dashboard/UserSidebar";
import AddressModal from "@/components/dashboard/AddressModal";
import PhoneVerificationModal from "@/components/dashboard/PhoneVerificationModal";
import { 
  User, 
  Bell, 
  Shield, 
  MapPin, 
  CreditCard, 
  ChevronRight, 
  Plus, 
  Trash2, 
  Edit3, 
  CheckCircle2, 
  AlertCircle,
  Loader2,
  Phone,
  Mail,
  Save,
  Cake,
  Users
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function SettingsPage() {
  const { user, refreshProfile, loading: authLoading } = useAuth();
  const [activeTab, setActiveTab] = useState('profile');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  // Profile Form State
  const [profileData, setProfileData] = useState({
    name: "",
    phone: "",
    email: "",
    gender: "",
    dateOfBirth: ""
  });

  // Addresses State
  const [addresses, setAddresses] = useState<any[]>([]);
  const [addressesLoading, setAddressesLoading] = useState(false);
  const [isAddressModalOpen, setIsAddressModalOpen] = useState(false);
  const [editingAddress, setEditingAddress] = useState<any>(null);

  // Phone Change Verification State
  const [isPhoneModalOpen, setIsPhoneModalOpen] = useState(false);

  useEffect(() => {
    if (user) {
      setProfileData({
        name: user.name || "",
        phone: user.phone || "",
        email: user.email || "",
        gender: user.gender || "",
        dateOfBirth: user.dateOfBirth ? new Date(user.dateOfBirth).toISOString().split('T')[0] : ""
      });
      fetchAddresses();
    }
  }, [user]);

  const fetchAddresses = async () => {
    setAddressesLoading(true);
    try {
      const token = localStorage.getItem("freshcart_access_token") || localStorage.getItem("token");
      const res = await fetch(`${API_URL}/api/users/addresses`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const json = await res.json();
      if (json.success) {
        setAddresses(json.data);
      }
    } catch (err) {
      console.error("Failed to fetch addresses", err);
    } finally {
      setAddressesLoading(false);
    }
  };

  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    // If phone number is changed, we need OTP verification first
    if (profileData.phone !== user?.phone) {
      try {
        const token = localStorage.getItem("freshcart_access_token") || localStorage.getItem("token");
        const res = await fetch(`${API_URL}/api/users/request-phone-change`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
          },
          body: JSON.stringify({ newPhone: profileData.phone })
        });
        const json = await res.json();
        if (json.success) {
          setIsPhoneModalOpen(true);
          setLoading(false);
          return;
        } else {
          setMessage({ type: 'error', text: json.message || "Failed to initiate phone change" });
          setLoading(false);
          return;
        }
      } catch (err) {
        setMessage({ type: 'error', text: "Failed to initiate phone verification" });
        setLoading(false);
        return;
      }
    }

    try {
      const token = localStorage.getItem("freshcart_access_token") || localStorage.getItem("token");
      const res = await fetch(`${API_URL}/api/users/profile`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({
          name: profileData.name,
          phone: profileData.phone,
          gender: profileData.gender,
          dateOfBirth: profileData.dateOfBirth
        })
      });

      const json = await res.json();
      if (json.success) {
        await refreshProfile();
        setMessage({ type: 'success', text: "Profile updated successfully!" });
      } else {
        setMessage({ type: 'error', text: json.message || "Failed to update profile" });
      }
    } catch (err) {
      setMessage({ type: 'error', text: "An error occurred. Please try again." });
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAddress = async (id: string) => {
    if (!confirm("Are you sure you want to delete this address?")) return;
    
    try {
      const token = localStorage.getItem("freshcart_access_token") || localStorage.getItem("token");
      const res = await fetch(`${API_URL}/api/users/addresses/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        fetchAddresses();
      }
    } catch (err) {
      alert("Failed to delete address");
    }
  };

  const tabs = [
    { id: 'profile', title: 'Profile', icon: User },
    { id: 'addresses', title: 'Addresses', icon: MapPin },
    { id: 'notifications', title: 'Notifications', icon: Bell },
    { id: 'security', title: 'Security', icon: Shield },
  ];

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="animate-spin text-blue-600" size={48} />
      </div>
    );
  }

  return (
    <div className="bg-[#f8fafc] dark:bg-gray-950 min-h-screen py-12">
      {isAddressModalOpen && (
        <AddressModal 
          address={editingAddress}
          onClose={() => { setIsAddressModalOpen(false); setEditingAddress(null); }}
          onSuccess={fetchAddresses}
        />
      )}

      <div className="container mx-auto px-4">
        <div className="flex flex-col lg:flex-row gap-8">
          <aside className="w-full lg:w-80 shrink-0">
            <UserSidebar />
          </aside>

          <main className="flex-grow">
            <div className="mb-8">
              <h1 className="text-4xl font-black text-gray-900 dark:text-white tracking-tighter uppercase italic">
                Settings
              </h1>
              <p className="text-gray-500 dark:text-gray-400 font-medium mt-1">
                Configure your account and preferences
              </p>
            </div>

            {/* Tabs Navigation */}
            <div className="flex items-center gap-2 mb-8 bg-white dark:bg-gray-900 p-2 rounded-[2rem] border border-gray-100 dark:border-gray-800 shadow-sm overflow-x-auto pb-2 md:pb-2">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-6 py-3 rounded-2xl font-black uppercase tracking-widest text-[10px] transition-all whitespace-nowrap ${
                    activeTab === tab.id 
                      ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20' 
                      : 'text-gray-500 hover:bg-gray-50 dark:hover:bg-gray-800'
                  }`}
                >
                  <tab.icon size={14} />
                  {tab.title}
                </button>
              ))}
            </div>

            {/* Content Area */}
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
              >
                {activeTab === 'profile' && (
                  <div className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-[2.5rem] p-8 md:p-12 shadow-xl shadow-gray-200/20 dark:shadow-none">
                    <h2 className="text-2xl font-black text-gray-900 dark:text-white mb-8 uppercase tracking-tight italic">Personal Information</h2>
                    
                    {message && (
                      <div className={`mb-8 p-4 rounded-2xl text-sm font-bold flex items-center gap-3 ${
                        message.type === 'success' ? 'bg-green-50 text-green-600 border border-green-100' : 'bg-red-50 text-red-600 border border-red-100'
                      }`}>
                        {message.type === 'success' ? <CheckCircle2 size={18} /> : <AlertCircle size={18} />}
                        {message.text}
                      </div>
                    )}

                    <form onSubmit={handleProfileSubmit} className="space-y-6 max-w-2xl">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <label className="block text-xs font-black text-gray-400 uppercase tracking-[0.2em] mb-2 ml-1">Full Name</label>
                          <div className="relative">
                            <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                            <input 
                              type="text"
                              required
                              value={profileData.name}
                              onChange={e => setProfileData({...profileData, name: e.target.value})}
                              className="w-full pl-12 pr-4 py-4 bg-gray-50 dark:bg-gray-950 border border-gray-100 dark:border-gray-800 rounded-2xl outline-none focus:border-blue-500 font-bold text-gray-900 dark:text-white transition-all"
                              placeholder="Your Name"
                            />
                          </div>
                        </div>
                        <div>
                          <label className="block text-xs font-black text-gray-400 uppercase tracking-[0.2em] mb-2 ml-1">Phone Number</label>
                          <div className="relative">
                            <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                            <input 
                              type="tel"
                              required
                              value={profileData.phone}
                              onChange={e => setProfileData({...profileData, phone: e.target.value})}
                              className="w-full pl-12 pr-4 py-4 bg-gray-50 dark:bg-gray-950 border border-gray-100 dark:border-gray-800 rounded-2xl outline-none focus:border-blue-500 font-bold text-gray-900 dark:text-white transition-all"
                              placeholder="Your Phone"
                            />
                          </div>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <label className="block text-xs font-black text-gray-400 uppercase tracking-[0.2em] mb-2 ml-1">Gender</label>
                          <div className="relative">
                            <Users className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                            <select 
                              value={profileData.gender}
                              onChange={e => setProfileData({...profileData, gender: e.target.value})}
                              className="w-full pl-12 pr-4 py-4 bg-gray-50 dark:bg-gray-950 border border-gray-100 dark:border-gray-800 rounded-2xl outline-none focus:border-blue-500 font-bold text-gray-900 dark:text-white transition-all appearance-none"
                            >
                              <option value="">Select Gender</option>
                              <option value="Male">Male</option>
                              <option value="Female">Female</option>
                              <option value="Other">Other</option>
                            </select>
                            <ChevronRight className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 rotate-90 pointer-events-none" size={16} />
                          </div>
                        </div>
                        <div>
                          <label className="block text-xs font-black text-gray-400 uppercase tracking-[0.2em] mb-2 ml-1">Date of Birth</label>
                          <div className="relative">
                            <Cake className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                            <input 
                              type="date"
                              value={profileData.dateOfBirth}
                              onChange={e => setProfileData({...profileData, dateOfBirth: e.target.value})}
                              className="w-full pl-12 pr-4 py-4 bg-gray-50 dark:bg-gray-950 border border-gray-100 dark:border-gray-800 rounded-2xl outline-none focus:border-blue-500 font-bold text-gray-900 dark:text-white transition-all uppercase text-xs tracking-widest"
                            />
                          </div>
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-black text-gray-400 uppercase tracking-[0.2em] mb-2 ml-1">Email Address (Read-only)</label>
                        <div className="relative opacity-60">
                          <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                          <input 
                            type="email"
                            disabled
                            value={profileData.email}
                            className="w-full pl-12 pr-4 py-4 bg-gray-100 dark:bg-gray-950 border border-gray-200 dark:border-gray-800 rounded-2xl font-bold text-gray-500 dark:text-gray-400 cursor-not-allowed"
                          />
                        </div>
                      </div>

                      <button 
                        type="submit"
                        disabled={loading}
                        className="mt-4 px-10 py-5 bg-gray-900 border-none dark:bg-blue-600 text-white rounded-2xl font-black uppercase tracking-widest text-sm transition-all shadow-xl hover:-translate-y-1 active:translate-y-0 disabled:opacity-50 flex items-center justify-center gap-3"
                      >
                        {loading ? <Loader2 className="animate-spin" size={20} /> : <><Save size={20} /> Save Changes</>}
                      </button>
                    </form>
                  </div>
                )}

                {activeTab === 'addresses' && (
                  <div className="space-y-6">
                    <div className="flex items-center justify-between gap-4">
                       <h2 className="text-2xl font-black text-gray-900 dark:text-white uppercase tracking-tight italic">Saved Addresses</h2>
                       <button 
                        onClick={() => setIsAddressModalOpen(true)}
                        className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-xl font-black uppercase tracking-widest text-[10px] shadow-lg shadow-blue-600/20 hover:scale-105 transition-transform"
                       >
                         <Plus size={16} /> Add New
                       </button>
                    </div>

                    {addressesLoading ? (
                      <div className="p-12 flex justify-center">
                        <Loader2 className="animate-spin text-blue-600" size={32} />
                      </div>
                    ) : addresses.length === 0 ? (
                      <div className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-3xl p-12 text-center">
                        <MapPin className="mx-auto text-gray-200 dark:text-gray-800 mb-4" size={48} />
                        <p className="text-gray-500 font-bold">No saved addresses found.</p>
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {addresses.map((addr) => (
                           <div key={addr.id} className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-[2rem] p-6 group hover:border-blue-500/30 transition-all">
                              <div className="flex items-start justify-between mb-4">
                                <div className="flex items-center gap-3">
                                   <div className="p-2.5 bg-gray-50 dark:bg-gray-800 rounded-xl">
                                      <MapPin size={18} className="text-blue-600" />
                                   </div>
                                   <div>
                                      <span className="text-[10px] font-black uppercase tracking-widest text-gray-400 block mb-0.5">{addr.label}</span>
                                      <span className="text-xs font-black uppercase tracking-tight text-gray-900 dark:text-white">
                                        {addr.isDefault && <CheckCircle2 size={12} className="inline mr-1 text-green-500" />}
                                        {addr.city}, {addr.area}
                                      </span>
                                   </div>
                                </div>
                                <div className="flex gap-1">
                                   <button 
                                    onClick={() => { setEditingAddress(addr); setIsAddressModalOpen(true); }}
                                    className="p-2 text-gray-400 hover:text-blue-600 transition-colors"
                                   >
                                      <Edit3 size={16} />
                                   </button>
                                   <button 
                                    onClick={() => handleDeleteAddress(addr.id)}
                                    className="p-2 text-gray-400 hover:text-red-500 transition-colors"
                                   >
                                      <Trash2 size={16} />
                                   </button>
                                </div>
                              </div>
                              <p className="text-sm font-bold text-gray-600 dark:text-gray-400 leading-relaxed mb-4">
                                {addr.address}
                              </p>
                              <div className="pt-4 border-t border-gray-50 dark:border-gray-800 flex items-center justify-between">
                                 <span className="text-[10px] font-bold text-gray-400 italic">{addr.recipientName}</span>
                                 <span className="text-[10px] font-bold text-gray-400 italic">{addr.recipientPhone}</span>
                              </div>
                           </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {activeTab === 'notifications' && (
                  <div className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-[2.5rem] p-12 shadow-xl shadow-gray-200/20 dark:shadow-none">
                    <h2 className="text-2xl font-black text-gray-900 dark:text-white mb-8 uppercase tracking-tight italic">Notification Preferences</h2>
                    
                    <div className="space-y-6">
                      {[
                        { title: 'Order Updates', desc: 'Get notified about your order status changes' },
                        { title: 'Promotions', desc: 'Receive info about sales and special offers' },
                        { title: 'Newsletter', desc: 'Weekly digest of our best products' },
                      ].map((item, i) => (
                        <div key={i} className="flex items-center justify-between py-6 border-b border-gray-50 dark:border-gray-800 last:border-0">
                          <div>
                            <h4 className="font-black text-gray-900 dark:text-white uppercase tracking-tight">{item.title}</h4>
                            <p className="text-sm text-gray-500 font-medium">{item.desc}</p>
                          </div>
                          <label className="relative inline-flex items-center cursor-pointer">
                            <input type="checkbox" defaultChecked className="sr-only peer" />
                            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {activeTab === 'security' && (
                   <div className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-[2.5rem] p-12 shadow-xl shadow-gray-200/20 dark:shadow-none">
                    <h2 className="text-2xl font-black text-gray-900 dark:text-white mb-8 uppercase tracking-tight italic">Account Security</h2>
                    <p className="text-gray-500 mb-8 font-medium">Manage your password and security settings to keep your account safe.</p>
                    
                    <div className="p-8 bg-blue-50 dark:bg-blue-900/10 rounded-3xl border border-blue-100 dark:border-blue-900/30 flex items-center justify-between gap-6">
                       <div className="flex items-center gap-6">
                          <div className="p-4 bg-white dark:bg-blue-800 rounded-2xl shadow-sm">
                             <Shield size={32} className="text-blue-600 dark:text-blue-300" />
                          </div>
                          <div>
                             <h4 className="font-black text-gray-900 dark:text-white uppercase tracking-tight">Password Management</h4>
                             <p className="text-xs text-gray-500 font-bold uppercase tracking-widest mt-1">Last changed: Never</p>
                          </div>
                       </div>
                       <button className="px-8 py-3 bg-gray-900 dark:bg-white text-white dark:text-gray-900 rounded-xl font-black uppercase tracking-widest text-[10px] hover:scale-105 transition-transform">
                          Change Password
                       </button>
                    </div>
                   </div>
                )}
              </motion.div>
            </AnimatePresence>

          </main>
        </div>
      </div>

      <PhoneVerificationModal 
        isOpen={isPhoneModalOpen}
        onClose={() => setIsPhoneModalOpen(false)}
        newPhone={profileData.phone}
        onSuccess={async () => {
          await refreshProfile();
          setMessage({ type: 'success', text: "Phone number updated successfully!" });
        }}
      />
    </div>
  );
}
