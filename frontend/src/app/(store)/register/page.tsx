"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { API_URL } from "@/lib/config";
import { useAuthStore } from "@/store/authStore";
import {
  Phone, KeyRound, User, Mail, Lock, MapPin,
  Loader2, CheckCircle2, ChevronRight, ArrowLeft,
  Eye, EyeOff, Building2, Map, Navigation
} from "lucide-react";
import SearchableDropdown from "@/components/ui/SearchableDropdown";

/* ─── Types ─────────────────────────────────────────────── */
type Step = 1 | 2 | 3 | 4;

interface LocationItem { id: string; name: string; }

/* ─── Step Indicator ─────────────────────────────────────── */
const STEPS = [
  { label: "Phone",   icon: Phone },
  { label: "Verify",  icon: KeyRound },
  { label: "Profile", icon: User },
  { label: "Address", icon: MapPin },
];

function StepIndicator({ current }: { current: Step }) {
  return (
    <div className="flex items-center justify-center mb-10 select-none">
      {STEPS.map((s, i) => {
        const num = (i + 1) as Step;
        const done = current > num;
        const active = current === num;
        const Icon = s.icon;
        return (
          <div key={num} className="flex items-center">
            <div className="flex flex-col items-center gap-1.5">
              <div
                className={`w-10 h-10 rounded-2xl flex items-center justify-center transition-all duration-500 shadow-md
                  ${done   ? "bg-emerald-500 text-white shadow-emerald-200 dark:shadow-emerald-900/40 scale-95" : ""}
                  ${active ? "bg-blue-600 text-white shadow-blue-200 dark:shadow-blue-900/50 scale-110 ring-4 ring-blue-100 dark:ring-blue-900/40" : ""}
                  ${!done && !active ? "bg-gray-100 dark:bg-gray-800 text-gray-400" : ""}
                `}
              >
                {done ? <CheckCircle2 size={18} /> : <Icon size={16} />}
              </div>
              <span className={`text-[10px] font-black uppercase tracking-widest transition-colors
                ${active ? "text-blue-600" : done ? "text-emerald-500" : "text-gray-400"}`}>
                {s.label}
              </span>
            </div>
            {i < STEPS.length - 1 && (
              <div className={`w-12 sm:w-16 h-0.5 mx-1 mb-5 rounded-full transition-all duration-500
                ${done ? "bg-emerald-400" : "bg-gray-200 dark:bg-gray-700"}`} />
            )}
          </div>
        );
      })}
    </div>
  );
}

/* ─── Shared input style ─────────────────────────────────── */
const inputCls = (icon = true) =>
  `w-full ${icon ? "pl-11" : "px-5"} pr-4 py-3.5 rounded-xl border border-gray-200 dark:border-gray-700
   bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500
   focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all font-medium text-sm`;

/* ─── Main Page ──────────────────────────────────────────── */
export default function RegisterPage() {
  const router = useRouter();
  const { setUser } = useAuthStore();

  const [step, setStep] = useState<Step>(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Step 1 & 2 data
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [countdown, setCountdown] = useState(0);
  const [isRegistered, setIsRegistered] = useState(false); // already has a full account

  // Step 2: temp tokens (from verifyOtp)
  const [tempToken, setTempToken] = useState("");

  // Step 3 data
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);

  // Step 4 — location data
  const [states, setStates] = useState<LocationItem[]>([]);
  const [cities, setCities] = useState<LocationItem[]>([]);
  const [areas, setAreas] = useState<LocationItem[]>([]);
  const [loadingCities, setLoadingCities] = useState(false);
  const [loadingAreas, setLoadingAreas] = useState(false);
  const [addrForm, setAddrForm] = useState({
    label: "Home",
    stateId: "", state: "",
    cityId: "", city: "",
    areaId: "", area: "",
    address: "",
    recipientName: "",
    recipientPhone: "",
  });

  /* ─── Countdown timer ─── */
  useEffect(() => {
    if (countdown <= 0) return;
    const t = setTimeout(() => setCountdown(c => c - 1), 1000);
    return () => clearTimeout(t);
  }, [countdown]);

  /* ─── Fetch states once ─── */
  useEffect(() => {
    fetch(`${API_URL}/api/locations/states`)
      .then(r => r.json())
      .then(d => { if (d.success) setStates(d.data); })
      .catch(() => {});
  }, []);

  const fetchCities = async (stateId: string) => {
    if (!stateId) { setCities([]); setAreas([]); return; }
    setLoadingCities(true);
    try {
      const res = await fetch(`${API_URL}/api/locations/cities?stateId=${stateId}`);
      const d = await res.json();
      if (d.success) setCities(d.data);
    } finally { setLoadingCities(false); }
    setAreas([]);
    setAddrForm(f => ({ ...f, cityId: "", city: "", areaId: "", area: "" }));
  };

  const fetchAreas = async (cityId: string) => {
    if (!cityId) { setAreas([]); return; }
    setLoadingAreas(true);
    try {
      const res = await fetch(`${API_URL}/api/locations/areas?cityId=${cityId}`);
      const d = await res.json();
      if (d.success) setAreas(d.data);
    } finally { setLoadingAreas(false); }
    setAddrForm(f => ({ ...f, areaId: "", area: "" }));
  };

  /* ══════════════════════════════════════
   * STEP 1 — Send OTP
   * ══════════════════════════════════════ */
  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/api/auth/send-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        setError(data.message || "Failed to send OTP.");
        return;
      }
      if (data.data?.isRegistered) {
        // Full account already exists — redirect to login
        setIsRegistered(true);
        return;
      }
      setCountdown(60);
      setStep(2);
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  /* ══════════════════════════════════════
   * STEP 2 — Verify OTP
   * ══════════════════════════════════════ */
  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/api/auth/verify-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone, code: otp }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        setError(data.message || "Invalid OTP code.");
        return;
      }
      // Store temp token to use for address saving later
      setTempToken(data.data.accessToken);
      localStorage.setItem("freshcart_access_token", data.data.accessToken);
      localStorage.setItem("freshcart_refresh_token", data.data.refreshToken);
      localStorage.setItem("token", data.data.accessToken);
      setOtp("");
      setStep(3);
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  /* ══════════════════════════════════════
   * STEP 3 — Complete profile
   * ══════════════════════════════════════ */
  const handleCompleteProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/api/auth/complete-registration`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone, name, email: email || undefined, password }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        setError(data.message || "Failed to save profile.");
        return;
      }
      // Update stored tokens with fresh ones
      localStorage.setItem("freshcart_access_token", data.data.accessToken);
      localStorage.setItem("freshcart_refresh_token", data.data.refreshToken);
      localStorage.setItem("token", data.data.accessToken);
      localStorage.setItem("user", JSON.stringify(data.data.user));
      setTempToken(data.data.accessToken);
      setAddrForm(f => ({ ...f, recipientName: name, recipientPhone: phone }));
      setStep(4);
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  /* ══════════════════════════════════════
   * STEP 4 — Save address
   * ══════════════════════════════════════ */
  const handleSaveAddress = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!addrForm.stateId || !addrForm.cityId || !addrForm.areaId || !addrForm.address.trim()) {
      setError("Please fill in all address fields.");
      return;
    }
    setError("");
    setLoading(true);
    try {
      const token = tempToken || localStorage.getItem("freshcart_access_token") || localStorage.getItem("token") || "";
      const res = await fetch(`${API_URL}/api/users/addresses`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify(addrForm),
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        setError(data.message || "Failed to save address.");
        return;
      }
      // Load the user object and finalize auth
      const storedUser = JSON.parse(localStorage.getItem("user") || "null");
      if (storedUser) setUser(storedUser);
      // Clear tokens — user must log in freshly
      localStorage.removeItem("freshcart_access_token");
      localStorage.removeItem("freshcart_refresh_token");
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      router.push("/login?registered=1");
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  /* ─── "Already registered" modal ─── */
  if (isRegistered) {
    return (
      <div className="container mx-auto px-4 py-24 flex items-center justify-center min-h-[80vh]">
        <div className="bg-white dark:bg-gray-950 border border-gray-100 dark:border-gray-800 rounded-[2.5rem] p-10 shadow-2xl max-w-md w-full text-center">
          <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/40 rounded-2xl flex items-center justify-center mx-auto mb-5">
            <Phone size={28} className="text-blue-600" />
          </div>
          <h2 className="text-2xl font-black text-gray-900 dark:text-white uppercase tracking-tighter italic mb-3">
            Number Already Registered
          </h2>
          <p className="text-gray-500 dark:text-gray-400 text-sm leading-relaxed mb-8">
            <span className="font-bold text-gray-800 dark:text-gray-200">{phone}</span> is already linked to an account.
            Please log in instead.
          </p>
          <div className="space-y-3">
            <Link
              href="/login"
              className="flex items-center justify-center w-full py-3.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-black uppercase tracking-wide transition-all"
            >
              Go to Login
            </Link>
            <button
              onClick={() => { setIsRegistered(false); setPhone(""); }}
              className="w-full py-3.5 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-xl font-bold transition-all"
            >
              Use Different Number
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-16 flex items-center justify-center min-h-[90vh]">
      <div className="bg-white dark:bg-gray-950 border border-gray-100 dark:border-gray-800 rounded-[2.5rem] p-8 sm:p-10 shadow-2xl w-full max-w-lg relative overflow-hidden">
        {/* Decorative blobs */}
        <div className="absolute -top-12 -right-12 w-40 h-40 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-12 -left-12 w-40 h-40 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-black text-gray-900 dark:text-white tracking-tighter uppercase italic">
              Create Account
            </h1>
            <p className="text-gray-500 dark:text-gray-400 mt-1 text-sm font-medium">
              Join FreshCart — takes less than 2 minutes
            </p>
          </div>

          <StepIndicator current={step} />

          {/* Error */}
          {error && (
            <div className="mb-6 p-4 rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-800 text-red-600 dark:text-red-400 text-sm font-medium">
              {error}
            </div>
          )}

          {/* ─── STEP 1: Phone ─── */}
          {step === 1 && (
            <form onSubmit={handleSendOtp} className="space-y-5">
              <div>
                <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2 pl-1">
                  Mobile Number
                </label>
                <div className="relative">
                  <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                  <input
                    id="reg-phone"
                    type="tel"
                    required
                    placeholder="e.g. 01712345678"
                    value={phone}
                    onChange={e => setPhone(e.target.value)}
                    className={inputCls()}
                  />
                </div>
                <p className="text-xs text-gray-400 mt-2 pl-1">
                  We&apos;ll send a 6-digit verification code to this number.
                </p>
              </div>
              <button
                id="reg-send-otp-btn"
                type="submit"
                disabled={loading || phone.length < 10}
                className="w-full flex items-center justify-center gap-2.5 py-4 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white rounded-2xl font-black uppercase tracking-widest transition-all shadow-xl shadow-blue-600/20 mt-2"
              >
                {loading ? <Loader2 className="animate-spin" size={20} /> : <>Send Verification Code <ChevronRight size={18} /></>}
              </button>
            </form>
          )}

          {/* ─── STEP 2: OTP ─── */}
          {step === 2 && (
            <form onSubmit={handleVerifyOtp} className="space-y-5">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-xs font-black text-gray-400 uppercase tracking-widest pl-1">
                    6-Digit Code
                  </label>
                  <span className="text-xs text-gray-400 font-medium">
                    Sent to <strong className="text-gray-700 dark:text-gray-300">{phone}</strong>
                  </span>
                </div>
                <div className="relative">
                  <KeyRound className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                  <input
                    id="reg-otp-input"
                    type="text"
                    inputMode="numeric"
                    required
                    maxLength={6}
                    placeholder="000000"
                    value={otp}
                    onChange={e => setOtp(e.target.value.replace(/\D/g, ""))}
                    className="w-full pl-11 pr-4 py-4 text-center text-2xl tracking-[0.7em] rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none transition-all font-black"
                  />
                </div>
              </div>

              {/* Resend */}
              <div className="text-center text-sm">
                {countdown > 0 ? (
                  <span className="text-gray-400">Resend code in <strong className="text-blue-600">{countdown}s</strong></span>
                ) : (
                  <button
                    type="button"
                    onClick={() => { setOtp(""); setStep(1); }}
                    className="text-blue-600 font-bold hover:underline"
                  >
                    Resend OTP
                  </button>
                )}
              </div>

              <div className="flex gap-3 pt-1">
                <button
                  type="button"
                  onClick={() => { setStep(1); setError(""); }}
                  className="flex items-center gap-2 px-5 py-3.5 rounded-2xl bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 font-bold transition-all hover:bg-gray-200 dark:hover:bg-gray-700"
                >
                  <ArrowLeft size={16} /> Back
                </button>
                <button
                  id="reg-verify-otp-btn"
                  type="submit"
                  disabled={loading || otp.length < 6}
                  className="flex-1 flex items-center justify-center gap-2 py-3.5 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white rounded-2xl font-black uppercase tracking-widest transition-all shadow-xl shadow-emerald-600/20"
                >
                  {loading ? <Loader2 className="animate-spin" size={20} /> : <><CheckCircle2 size={18} /> Verify</>}
                </button>
              </div>
            </form>
          )}

          {/* ─── STEP 3: Profile ─── */}
          {step === 3 && (
            <form onSubmit={handleCompleteProfile} className="space-y-4">
              {/* Name */}
              <div>
                <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2 pl-1">Full Name</label>
                <div className="relative">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                  <input
                    id="reg-name"
                    type="text"
                    required
                    minLength={2}
                    placeholder="e.g. Rahat Ahmed"
                    value={name}
                    onChange={e => setName(e.target.value)}
                    className={inputCls()}
                  />
                </div>
              </div>

              {/* Email (optional) */}
              <div>
                <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2 pl-1">
                  Email Address <span className="normal-case font-medium text-gray-400">(Optional)</span>
                </label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                  <input
                    id="reg-email"
                    type="email"
                    placeholder="you@example.com"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    className={inputCls()}
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2 pl-1">Password</label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                  <input
                    id="reg-password"
                    type={showPass ? "text" : "password"}
                    required
                    minLength={6}
                    placeholder="Min. 6 characters"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    className={inputCls() + " pr-12"}
                  />
                  <button
                    type="button"
                    aria-label={showPass ? "Hide password" : "Show password"}
                    aria-pressed={showPass}
                    onMouseDown={(e) => e.preventDefault()}
                    onClick={() => setShowPass(v => !v)}
                    className="absolute right-2 top-1/2 z-10 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-lg text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:hover:bg-gray-800 dark:hover:text-gray-300"
                  >
                    {showPass ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              <div className="pt-2">
                <button
                  id="reg-profile-btn"
                  type="submit"
                  disabled={loading || !name.trim() || password.length < 6}
                  className="w-full flex items-center justify-center gap-2 py-4 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white rounded-2xl font-black uppercase tracking-widest transition-all shadow-xl shadow-blue-600/20"
                >
                  {loading ? <Loader2 className="animate-spin" size={20} /> : <>Continue to Address <ChevronRight size={18} /></>}
                </button>
              </div>
            </form>
          )}

          {/* ─── STEP 4: Address ─── */}
          {step === 4 && (
            <form onSubmit={handleSaveAddress} className="space-y-4">
              <p className="text-xs text-gray-400 font-medium -mt-2 mb-4">
                <MapPin size={12} className="inline mr-1" />
                Where should we deliver your orders?
              </p>

              {/* Recipient name + phone */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2 pl-1">Recipient Name</label>
                  <div className="relative">
                    <User className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                    <input
                      type="text"
                      required
                      placeholder="Full name"
                      value={addrForm.recipientName}
                      onChange={e => setAddrForm(f => ({ ...f, recipientName: e.target.value }))}
                      className={inputCls()}
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2 pl-1">Mobile</label>
                  <div className="relative">
                    <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                    <input
                      type="tel"
                      required
                      placeholder="01XXXXXXXXX"
                      value={addrForm.recipientPhone}
                      onChange={e => setAddrForm(f => ({ ...f, recipientPhone: e.target.value }))}
                      className={inputCls()}
                    />
                  </div>
                </div>
              </div>

              {/* Division + Label */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2 pl-1">
                    <Building2 size={10} className="inline mr-1" />Division
                  </label>
                  <SearchableDropdown
                    value={addrForm.stateId}
                    onChange={v => {
                      const s = states.find(st => st.id === v);
                      setAddrForm(f => ({ ...f, stateId: v, state: s?.name || "" }));
                      fetchCities(v);
                    }}
                    options={states.map(s => ({ value: s.id, label: s.name }))}
                    placeholder="Select..."
                    searchPlaceholder="Search division..."
                  />
                </div>
                <div>
                  <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2 pl-1">Label</label>
                  <select
                    value={addrForm.label}
                    onChange={e => setAddrForm(f => ({ ...f, label: e.target.value }))}
                    className="w-full px-4 py-3.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white outline-none focus:ring-2 focus:ring-blue-500 transition-all font-medium text-sm"
                  >
                    <option value="Home">🏠 Home</option>
                    <option value="Work">🏢 Work</option>
                    <option value="Other">📍 Other</option>
                  </select>
                </div>
              </div>

              {/* City + Area */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2 pl-1">
                    <Map size={10} className="inline mr-1" />City / District
                  </label>
                  {loadingCities ? (
                    <div className="flex items-center gap-2 py-3.5 px-4 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 text-gray-400 text-sm">
                      <Loader2 size={14} className="animate-spin" /> Loading...
                    </div>
                  ) : (
                    <SearchableDropdown
                      value={addrForm.cityId}
                      onChange={v => {
                        const c = cities.find(ct => ct.id === v);
                        setAddrForm(f => ({ ...f, cityId: v, city: c?.name || "" }));
                        fetchAreas(v);
                      }}
                      options={cities.map(c => ({ value: c.id, label: c.name }))}
                      placeholder={!addrForm.stateId ? "Division first" : "Select..."}
                      searchPlaceholder="Search city..."
                      disabled={!addrForm.stateId}
                    />
                  )}
                </div>
                <div>
                  <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2 pl-1">
                    <Navigation size={10} className="inline mr-1" />Area / Upazila
                  </label>
                  {loadingAreas ? (
                    <div className="flex items-center gap-2 py-3.5 px-4 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 text-gray-400 text-sm">
                      <Loader2 size={14} className="animate-spin" /> Loading...
                    </div>
                  ) : (
                    <SearchableDropdown
                      value={addrForm.areaId}
                      onChange={v => {
                        const a = areas.find(ar => ar.id === v);
                        setAddrForm(f => ({ ...f, areaId: v, area: a?.name || "" }));
                      }}
                      options={areas.map(a => ({ value: a.id, label: a.name }))}
                      placeholder={!addrForm.cityId ? "City first" : "Select..."}
                      searchPlaceholder="Search area..."
                      disabled={!addrForm.cityId}
                    />
                  )}
                </div>
              </div>

              {/* Street address */}
              <div>
                <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2 pl-1">
                  Street Address
                </label>
                <textarea
                  required
                  rows={2}
                  placeholder="House no., road, building, floor..."
                  value={addrForm.address}
                  onChange={e => setAddrForm(f => ({ ...f, address: e.target.value }))}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:ring-2 focus:ring-blue-500 outline-none transition-all font-medium text-sm resize-none"
                />
              </div>

              <div className="pt-2">
                <button
                  id="reg-address-btn"
                  type="submit"
                  disabled={loading || !addrForm.stateId || !addrForm.cityId || !addrForm.areaId || !addrForm.address.trim()}
                  className="w-full flex items-center justify-center gap-2 py-4 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white rounded-2xl font-black uppercase tracking-widest transition-all shadow-xl shadow-emerald-600/20"
                >
                  {loading ? <Loader2 className="animate-spin" size={20} /> : <><CheckCircle2 size={18} /> Complete Registration</>}
                </button>
              </div>
            </form>
          )}

          {/* Footer link */}
          <div className="mt-8 text-center border-t border-gray-100 dark:border-gray-800 pt-6">
            <p className="text-sm text-gray-500 font-medium">
              Already have an account?{" "}
              <Link href="/login" className="text-blue-600 font-black hover:underline">
                Sign In
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
