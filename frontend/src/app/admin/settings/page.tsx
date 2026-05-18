"use client";
import { API_URL } from "@/lib/config";

import { useState, useEffect } from "react";
import { 
  Settings, 
  Globe, 
  Link as LinkIcon, 
  ShieldCheck, 
  Mail, 
  Bell, 
  CreditCard,
  Save,
  ChevronRight,
  Loader2,
  Code,
  Activity
} from "lucide-react";
import { useSettingsStore } from "@/store/settingsStore";
import AdminWalletBar from "@/components/admin/AdminWalletBar";


const menuItems = [
  { id: "general", label: "General", icon: Globe },
  { id: "seo", label: "SEO & Permalinks", icon: LinkIcon },
  { id: "custom_code", label: "Custom Code", icon: Code },
  { id: "tracking", label: "Tracking & Analytics", icon: Activity },
  { id: "security", label: "Security", icon: ShieldCheck },
  { id: "notifications", label: "Notifications", icon: Bell },
  { id: "payments", label: "Payments", icon: CreditCard },
];

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState("seo");
  const [settings, setSettings] = useState<any>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const { setSettings: updateStore } = useSettingsStore();

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const token = localStorage.getItem("freshcart_access_token") || localStorage.getItem("token");
      const res = await fetch(`${API_URL}/api/global-settings`, {
        headers: {
          "Authorization": `Bearer ${token}`
        }
      });
      const json = await res.json();
      if (json.success) {
        setSettings(json.data);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const token = localStorage.getItem("freshcart_access_token") || localStorage.getItem("token");
      const res = await fetch(`${API_URL}/api/global-settings`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({ settings })
      });
      
      const json = await res.json();
      
      if (res.ok && json.success) {
        // Update global store
        updateStore(settings);
        alert("Settings saved successfully!");
      } else {
        alert(json.message || "Failed to save settings");
      }
    } catch (e) {
      console.error(e);
      alert("Network error: Could not save settings");
    } finally {
      setSaving(false);
    }
  };

  const handleChange = (key: string, value: string) => {
    setSettings((prev: any) => ({ ...prev, [key]: value }));
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-12">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-black text-gray-900 dark:text-white flex items-center gap-3">
             <Settings size={32} className="text-emerald-500" /> System Settings
          </h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">Manage global configurations for your storefront</p>
        </div>
        <button
          onClick={handleSave}
          disabled={saving}
          className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-2.5 rounded-xl font-bold transition-all shadow-lg shadow-emerald-600/20 disabled:opacity-50"
        >
          {saving ? <Loader2 className="animate-spin" size={18} /> : <Save size={18} />} 
          {saving ? "Saving..." : "Save Changes"}
        </button>
      </div>

      <AdminWalletBar />

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Tree Menu (Sidebar) */}
        <aside className="w-full lg:w-72 shrink-0">
          <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 p-2 shadow-sm overflow-hidden">
             {menuItems.map(item => (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`w-full flex items-center justify-between px-4 py-3 rounded-xl transition-all group ${
                    activeTab === item.id 
                    ? "bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400 font-bold"
                    : "text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-white"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <item.icon size={20} className={activeTab === item.id ? "text-emerald-500" : "text-gray-400 group-hover:text-gray-600"} />
                    <span>{item.label}</span>
                  </div>
                  <ChevronRight size={16} className={`transition-transform duration-300 ${activeTab === item.id ? "rotate-90 opacity-100" : "opacity-0"}`} />
                </button>
             ))}
          </div>
        </aside>

        {/* Content Area */}
        <div className="flex-1 bg-white dark:bg-gray-900 rounded-[2rem] border border-gray-100 dark:border-gray-800 p-8 shadow-sm min-h-[500px]">
          {loading ? (
            <div className="flex items-center justify-center h-full text-gray-400 font-medium">Loading settings...</div>
          ) : activeTab === "general" ? (
            <div className="space-y-12 animate-in fade-in slide-in-from-bottom-2 duration-500">
               {/* Storefront Grid Section */}
               <section>
                  <h3 className="text-xl font-black text-gray-900 dark:text-white uppercase tracking-tight italic border-l-4 border-emerald-500 pl-4 mb-2">
                    Storefront Grid
                  </h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-6 font-medium">Configure how products are displayed on the shop and category pages.</p>
                  
                  <div className="space-y-6 max-w-md">
                     <div className="space-y-2">
                        <label className="text-xs font-black text-gray-400 uppercase tracking-widest pl-1">Products per Row (Desktop)</label>
                        <select 
                          value={settings.products_per_row || "3"} 
                          onChange={e => handleChange("products_per_row", e.target.value)}
                          className="w-full px-5 py-3 rounded-xl bg-gray-50 dark:bg-gray-800 border-none focus:ring-2 focus:ring-emerald-500 transition-all font-medium text-gray-900 dark:text-white appearance-none"
                        >
                          <option value="2">2 Columns</option>
                          <option value="3">3 Columns</option>
                          <option value="4">4 Columns</option>
                          <option value="5">5 Columns</option>
                          <option value="6">6 Columns</option>
                        </select>
                        <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider pl-1 mt-1">Note: On mobile, it will automatically switch to 2 columns for better usability.</p>
                     </div>

                     <div className="pt-2">
                        <label className="flex items-center gap-3 cursor-pointer group">
                          <div className="relative">
                            <input 
                              type="checkbox" 
                              className="sr-only" 
                              checked={settings.enable_infinite_scroll === "true"}
                              onChange={e => handleChange("enable_infinite_scroll", e.target.checked ? "true" : "false")}
                            />
                            <div className={`w-12 h-6 rounded-full transition-colors ${settings.enable_infinite_scroll === "true" ? "bg-emerald-500" : "bg-gray-200 dark:bg-gray-700"}`}></div>
                            <div className={`absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform ${settings.enable_infinite_scroll === "true" ? "translate-x-6" : ""}`}></div>
                          </div>
                          <div>
                            <span className="text-sm font-bold text-gray-700 dark:text-gray-200 group-hover:text-emerald-500 transition-colors uppercase tracking-tight">Enable Infinite Scroll</span>
                            <p className="text-[10px] text-gray-500 font-medium">Auto-load more products when scrolling down.</p>
                          </div>
                        </label>
                     </div>

                     <div className="pt-4 border-t border-gray-100 dark:border-gray-800">
                        <label className="flex items-center gap-3 cursor-pointer group">
                          <div className="relative">
                            <input 
                              type="checkbox" 
                              className="sr-only" 
                              checked={settings.ignore_stock_limits === "true"}
                              onChange={e => handleChange("ignore_stock_limits", e.target.checked ? "true" : "false")}
                            />
                            <div className={`w-12 h-6 rounded-full transition-colors ${settings.ignore_stock_limits === "true" ? "bg-emerald-500" : "bg-gray-200 dark:bg-gray-700"}`}></div>
                            <div className={`absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform ${settings.ignore_stock_limits === "true" ? "translate-x-6" : ""}`}></div>
                          </div>
                          <div>
                            <span className="text-sm font-bold text-gray-700 dark:text-gray-200 group-hover:text-emerald-500 transition-colors uppercase tracking-tight">Ignore Stock Limits</span>
                            <p className="text-[10px] text-gray-500 font-medium">Allow checking out products even if they are out of stock. Stock low alerts will still show.</p>
                          </div>
                        </label>
                     </div>
                  </div>
               </section>

               <hr className="border-gray-100 dark:border-gray-800" />

               {/* Verification Settings Section */}
               <section>
                  <h3 className="text-xl font-black text-gray-900 dark:text-white uppercase tracking-tight italic border-l-4 border-emerald-500 pl-4 mb-2">
                    Verification Settings
                  </h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-6 font-medium">Enforce security and validity for your customers through OTP verification.</p>
                  
                  <div className="space-y-6 max-w-md">
                     <div className="p-5 rounded-2xl bg-gray-50 dark:bg-gray-800/50 border border-gray-100 dark:border-gray-800 space-y-4">
                        <label className="flex items-center gap-4 cursor-pointer group">
                           <div className="relative">
                              <input 
                                 type="checkbox" 
                                 className="sr-only" 
                                 checked={settings.verify_number_before_order === "true"}
                                 onChange={e => handleChange("verify_number_before_order", e.target.checked ? "true" : "false")}
                              />
                              <div className={`w-12 h-6 rounded-full transition-colors ${settings.verify_number_before_order === "true" ? "bg-emerald-500" : "bg-gray-200 dark:bg-gray-700"}`}></div>
                              <div className={`absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform ${settings.verify_number_before_order === "true" ? "translate-x-6" : ""}`}></div>
                           </div>
                           <div className="flex-1">
                              <span className="text-sm font-black text-gray-700 dark:text-gray-200 group-hover:text-emerald-500 transition-colors uppercase tracking-tight">Verify number before order</span>
                              <p className="text-[10px] text-gray-500 font-medium">Require guest users to verify their mobile number via OTP before placing an order.</p>
                           </div>
                        </label>

                        <div className="h-px bg-gray-100 dark:bg-gray-800" />

                        <label className="flex items-center gap-4 cursor-pointer group">
                           <div className="relative">
                              <input 
                                 type="checkbox" 
                                 className="sr-only" 
                                 checked={settings.verify_user_before_signup === "true"}
                                 onChange={e => handleChange("verify_user_before_signup", e.target.checked ? "true" : "false")}
                              />
                              <div className={`w-12 h-6 rounded-full transition-colors ${settings.verify_user_before_signup === "true" ? "bg-emerald-500" : "bg-gray-200 dark:bg-gray-700"}`}></div>
                              <div className={`absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform ${settings.verify_user_before_signup === "true" ? "translate-x-6" : ""}`}></div>
                           </div>
                           <div className="flex-1">
                              <span className="text-sm font-black text-gray-700 dark:text-gray-200 group-hover:text-emerald-500 transition-colors uppercase tracking-tight">Verify user before sign up</span>
                              <p className="text-[10px] text-gray-500 font-medium">Require new users to verify their contact details before completing registration.</p>
                           </div>
                        </label>
                     </div>
                     
                     <div className="flex items-start gap-3 p-4 rounded-2xl bg-blue-50 dark:bg-blue-900/10 border border-blue-100 dark:border-blue-800">
                        <div className="bg-blue-500 text-white p-1 rounded-md shrink-0 mt-0.5">
                           <ShieldCheck size={14} />
                        </div>
                        <p className="text-[11px] text-blue-700 dark:text-blue-400 leading-relaxed font-semibold uppercase tracking-tight">
                           Pro Tip: These settings help reduce fake orders and improve data quality. Each successful SMS will cost ৳0.40 and will be deducted from your wallet balance.
                        </p>
                     </div>
                  </div>
               </section>

               <hr className="border-gray-100 dark:border-gray-800" />

               {/* Reward Points Settings Section */}
               <section>
                  <h3 className="text-xl font-black text-gray-900 dark:text-white uppercase tracking-tight italic border-l-4 border-emerald-500 pl-4 mb-2">
                    Reward Points
                  </h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-6 font-medium">Configure how users earn reward points for their delivered orders. Set both to 0 to disable.</p>
                  
                  <div className="space-y-6 max-w-md">
                     <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                           <label className="text-xs font-black text-gray-400 uppercase tracking-widest pl-1">Amount Spent (৳)</label>
                           <input 
                             type="number" 
                             min="0"
                             value={settings.reward_points_amount ?? "0"} 
                             onChange={e => handleChange("reward_points_amount", e.target.value)}
                             className="w-full px-5 py-3 rounded-xl bg-gray-50 dark:bg-gray-800 border-none focus:ring-2 focus:ring-emerald-500 transition-all font-medium text-gray-900 dark:text-white"
                             placeholder="e.g. 100"
                           />
                        </div>
                        <div className="space-y-2">
                           <label className="text-xs font-black text-gray-400 uppercase tracking-widest pl-1">Points Earned</label>
                           <input 
                             type="number" 
                             min="0"
                             value={settings.reward_points_earned ?? "0"} 
                             onChange={e => handleChange("reward_points_earned", e.target.value)}
                             className="w-full px-5 py-3 rounded-xl bg-gray-50 dark:bg-gray-800 border-none focus:ring-2 focus:ring-emerald-500 transition-all font-medium text-gray-900 dark:text-white"
                             placeholder="e.g. 1"
                           />
                        </div>
                     </div>
                     <div className="flex items-start gap-3 p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-900/10 border border-emerald-100 dark:border-emerald-800">
                        <div className="bg-emerald-500 text-white p-1 rounded-md shrink-0 mt-0.5">
                           <Save size={14} />
                        </div>
                        <p className="text-[11px] text-emerald-700 dark:text-emerald-400 leading-relaxed font-semibold uppercase tracking-tight">
                           Reward points are calculated on the relative subtotal (excluding delivery charges) and awarded securely only when the order status reaches Delivered.
                        </p>
                     </div>
                  </div>
               </section>
            </div>
          ) : activeTab === "seo" ? (
            <div className="space-y-10 animate-in fade-in slide-in-from-bottom-2 duration-500">
              <div>
                <h3 className="text-xl font-black text-gray-900 dark:text-white uppercase tracking-tight italic border-l-4 border-emerald-500 pl-4 mb-2">
                  Permalink Structure
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-6 font-medium">Choose how your product URLs appear in the browser address bar. This is critical for SEO.</p>
                
                <div className="grid gap-4">
                  <label className={`relative flex items-center p-5 rounded-2xl border-2 cursor-pointer transition-all ${
                    settings.permalink_structure === "flat" 
                    ? "border-emerald-500 bg-emerald-50/30 dark:bg-emerald-900/10" 
                    : "border-gray-100 dark:border-gray-800 hover:border-gray-200"
                  }`}>
                    <input 
                      type="radio" 
                      name="permalink" 
                      value="flat" 
                      checked={settings.permalink_structure === "flat"}
                      onChange={() => handleChange("permalink_structure", "flat")}
                      className="sr-only"
                    />
                    <div className="flex-1">
                       <div className="font-bold text-gray-900 dark:text-white">Flat Structure</div>
                       <div className="text-xs text-gray-500 mt-0.5">Example: freshcart.com/apple-phone</div>
                    </div>
                    {settings.permalink_structure === "flat" && <div className="w-5 h-5 bg-emerald-500 rounded-full flex items-center justify-center text-white"><Save size={12} /></div>}
                  </label>

                  <label className={`relative flex items-center p-5 rounded-2xl border-2 cursor-pointer transition-all ${
                    settings.permalink_structure === "product" 
                    ? "border-emerald-500 bg-emerald-50/30 dark:bg-emerald-900/10" 
                    : "border-gray-100 dark:border-gray-800 hover:border-gray-200"
                  }`}>
                    <input 
                      type="radio" 
                      name="permalink" 
                      value="product" 
                      checked={settings.permalink_structure === "product"}
                      onChange={() => handleChange("permalink_structure", "product")}
                      className="sr-only"
                    />
                    <div className="flex-1">
                       <div className="font-bold text-gray-900 dark:text-white">Product Prefix (Standard)</div>
                       <div className="text-xs text-gray-500 mt-0.5">Example: freshcart.com/product/apple-phone</div>
                    </div>
                    {settings.permalink_structure === "product" && <div className="w-5 h-5 bg-emerald-500 rounded-full flex items-center justify-center text-white"><Save size={12} /></div>}
                  </label>
                </div>
              </div>

              <div>
                <h3 className="text-xl font-black text-gray-900 dark:text-white uppercase tracking-tight italic border-l-4 border-emerald-500 pl-4 mb-6">
                  Meta Settings
                </h3>
                <div className="space-y-4">
                   <div className="space-y-2">
                      <label className="text-xs font-black text-gray-400 uppercase tracking-widest pl-1">Store Name</label>
                      <input 
                        type="text" 
                        value={settings.store_name ?? ""} 
                        onChange={e => handleChange("store_name", e.target.value)}
                        className="w-full px-5 py-3 rounded-xl bg-gray-50 dark:bg-gray-800 border-none focus:ring-2 focus:ring-emerald-500 transition-all font-medium text-gray-900 dark:text-white"
                        placeholder="e.g. FreshCart"
                      />
                   </div>
                   <div className="space-y-2">
                      <label className="text-xs font-black text-gray-400 uppercase tracking-widest pl-1">Global SEO Title</label>
                      <input 
                        type="text" 
                        value={settings.site_title ?? ""} 
                        onChange={e => handleChange("site_title", e.target.value)}
                        className="w-full px-5 py-3 rounded-xl bg-gray-50 dark:bg-gray-800 border-none focus:ring-2 focus:ring-emerald-500 transition-all font-medium text-gray-900 dark:text-white"
                        placeholder="e.g. FreshCart | Your Organic Grocery Store"
                      />
                   </div>
                   <div className="space-y-2">
                      <label className="text-xs font-black text-gray-400 uppercase tracking-widest pl-1">Global Meta Description</label>
                      <textarea 
                        value={settings.meta_description ?? ""} 
                        onChange={e => handleChange("meta_description", e.target.value)}
                        rows={3}
                        className="w-full px-5 py-3 rounded-xl bg-gray-50 dark:bg-gray-800 border-none focus:ring-2 focus:ring-emerald-500 transition-all font-medium text-gray-900 dark:text-white"
                        placeholder="Default description for your home page..."
                      />
                   </div>
                   <div className="space-y-2">
                      <label className="text-xs font-black text-gray-400 uppercase tracking-widest pl-1">Global Meta Keywords</label>
                      <input 
                        type="text" 
                        value={settings.meta_keywords ?? ""} 
                        onChange={e => handleChange("meta_keywords", e.target.value)}
                        className="w-full px-5 py-3 rounded-xl bg-gray-50 dark:bg-gray-800 border-none focus:ring-2 focus:ring-emerald-500 transition-all font-medium text-gray-900 dark:text-white"
                        placeholder="keywords, for, your, site"
                      />
                   </div>
                </div>
              </div>
            </div>
          ) : activeTab === "custom_code" ? (
            <div className="space-y-10 animate-in fade-in slide-in-from-bottom-2 duration-500">
              <div>
                <h3 className="text-xl font-black text-gray-900 dark:text-white uppercase tracking-tight italic border-l-4 border-emerald-500 pl-4 mb-2">
                  Header & Footer Code
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-6 font-medium">Insert custom scripts or tags like Google Analytics, Facebook Pixel, or custom CSS.</p>
                
                <div className="space-y-6">
                   <div className="space-y-2">
                      <label className="text-xs font-black text-gray-400 uppercase tracking-widest pl-1">Head Code</label>
                      <textarea 
                        value={settings.header_code ?? ""} 
                        onChange={e => handleChange("header_code", e.target.value)}
                        rows={6}
                        className="w-full px-5 py-3 rounded-xl bg-gray-50 dark:bg-gray-800 border-none focus:ring-2 focus:ring-emerald-500 transition-all font-mono text-sm text-gray-900 dark:text-white"
                        placeholder="<!-- Code injected inside the <head> tag (e.g., GTM head script) -->"
                      />
                   </div>
                   <div className="space-y-2">
                      <label className="text-xs font-black text-gray-400 uppercase tracking-widest pl-1">Body Code (Top)</label>
                      <textarea 
                        value={settings.body_code ?? ""} 
                        onChange={e => handleChange("body_code", e.target.value)}
                        rows={6}
                        className="w-full px-5 py-3 rounded-xl bg-gray-50 dark:bg-gray-800 border-none focus:ring-2 focus:ring-emerald-500 transition-all font-mono text-sm text-gray-900 dark:text-white"
                        placeholder="<!-- Code injected right after opening <body> tag (e.g., GTM noscript) -->"
                      />
                   </div>
                   <div className="space-y-2">
                      <label className="text-xs font-black text-gray-400 uppercase tracking-widest pl-1">Footer Code (Bottom)</label>
                      <textarea 
                        value={settings.footer_code ?? ""} 
                        onChange={e => handleChange("footer_code", e.target.value)}
                        rows={6}
                        className="w-full px-5 py-3 rounded-xl bg-gray-50 dark:bg-gray-800 border-none focus:ring-2 focus:ring-emerald-500 transition-all font-mono text-sm text-gray-900 dark:text-white"
                        placeholder="<!-- Code injected right before closing </body> tag -->"
                      />
                   </div>
                </div>
              </div>
            </div>
          ) : activeTab === "tracking" ? (
            <div className="space-y-10 animate-in fade-in slide-in-from-bottom-2 duration-500">
              <div>
                <h3 className="text-xl font-black text-gray-900 dark:text-white uppercase tracking-tight italic border-l-4 border-emerald-500 pl-4 mb-2">
                  Facebook Pixel & CAPI
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-6 font-medium">Configure Meta Pixel and Conversion API for tracking user events and conversions.</p>
                
                <div className="space-y-6 max-w-2xl">
                   <div className="pt-2 pb-4 border-b border-gray-100 dark:border-gray-800">
                      <label className="flex items-center gap-3 cursor-pointer group">
                        <div className="relative">
                          <input 
                            type="checkbox" 
                            className="sr-only" 
                            checked={settings.enable_facebook_pixel === "true"}
                            onChange={e => handleChange("enable_facebook_pixel", e.target.checked ? "true" : "false")}
                          />
                          <div className={`w-12 h-6 rounded-full transition-colors ${settings.enable_facebook_pixel === "true" ? "bg-blue-600" : "bg-gray-200 dark:bg-gray-700"}`}></div>
                          <div className={`absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform ${settings.enable_facebook_pixel === "true" ? "translate-x-6" : ""}`}></div>
                        </div>
                        <div>
                          <span className="text-sm font-bold text-gray-700 dark:text-gray-200 group-hover:text-blue-600 transition-colors uppercase tracking-tight">Enable Meta Pixel</span>
                          <p className="text-[10px] text-gray-500 font-medium">Activate Facebook Pixel tracking on the storefront.</p>
                        </div>
                      </label>
                   </div>

                   <div className="space-y-4">
                       <div className="space-y-2">
                          <label className="text-xs font-black text-gray-400 uppercase tracking-widest pl-1">Facebook Pixel ID</label>
                          <input 
                            type="text" 
                            value={settings.facebook_pixel_id ?? ""} 
                            onChange={e => handleChange("facebook_pixel_id", e.target.value)}
                            className="w-full px-5 py-3 rounded-xl bg-gray-50 dark:bg-gray-800 border-none focus:ring-2 focus:ring-blue-500 transition-all font-medium text-gray-900 dark:text-white"
                            placeholder="e.g. 123456789012345"
                          />
                       </div>

                       <div className="space-y-2">
                          <label className="text-xs font-black text-gray-400 uppercase tracking-widest pl-1 text-blue-500 flex items-center gap-2">
                            Conversion API Access Token <ShieldCheck size={14} className="text-blue-500" />
                          </label>
                          <textarea 
                            value={settings.facebook_capi_token ?? ""} 
                            onChange={e => handleChange("facebook_capi_token", e.target.value)}
                            rows={3}
                            className="w-full px-5 py-3 rounded-xl bg-gray-50 dark:bg-gray-800 border-none focus:ring-2 focus:ring-blue-500 transition-all font-mono text-sm text-gray-900 dark:text-white placeholder-gray-400"
                            placeholder="Paste your long-lived access token here..."
                          />
                          <p className="text-[10px] text-gray-400 font-medium pl-1">Required for server-side event tracking. Generate this in Facebook Events Manager.</p>
                       </div>

                       <div className="space-y-2">
                          <label className="text-xs font-black text-gray-400 uppercase tracking-widest pl-1">Test Event Code (Optional)</label>
                          <input 
                            type="text" 
                            value={settings.facebook_test_event_code ?? ""} 
                            onChange={e => handleChange("facebook_test_event_code", e.target.value)}
                            className="w-full px-5 py-3 rounded-xl bg-gray-50 dark:bg-gray-800 border-none focus:ring-2 focus:ring-blue-500 transition-all font-medium text-gray-900 dark:text-white"
                            placeholder="e.g. TEST12345"
                          />
                          <p className="text-[10px] text-gray-400 font-medium pl-1">Use this to test server events in the Events Manager. Clear this in production.</p>
                       </div>
                   </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-center py-12">
               <div className="w-20 h-20 bg-gray-50 dark:bg-gray-800 rounded-full flex items-center justify-center mb-6">
                  <Settings size={32} className="text-gray-300" />
               </div>
               <h3 className="text-2xl font-black text-gray-800 dark:text-white mb-2 italic">Feature Coming Soon</h3>
               <p className="text-gray-500 max-w-xs font-medium">The {activeTab} section is currently under development.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
