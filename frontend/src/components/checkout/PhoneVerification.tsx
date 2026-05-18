"use client";

import { useState } from "react";
import { Phone, KeyRound, User, Loader2, CheckCircle2 } from "lucide-react";
import { API_URL } from "@/lib/config";

interface PhoneVerificationProps {
  onVerified: (user: any) => void;
  onCancel: () => void;
}

export default function PhoneVerification({ onVerified, onCancel }: PhoneVerificationProps) {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [step, setStep] = useState<'input' | 'verify'>('input');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [showExistingPopup, setShowExistingPopup] = useState(false);
  const [isRegisteredUser, setIsRegisteredUser] = useState(false);

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setNotice("");
    if (!name.trim()) { setError("Please enter your name."); return; }
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/api/auth/send-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone })
      });
      const data = await res.json();
      if (data.success) {
        if (data.data?.exists) {
          setIsRegisteredUser(data.data?.isRegistered || false);
          setShowExistingPopup(true);
          // Don't set step to verify until they choose to continue
          return;
        }
        setStep('verify');
      } else {
        setError(data.message || "Failed to send OTP.");
      }
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/api/auth/verify-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone, code: otp, name: name.trim() })
      });
      const data = await res.json();
      if (data.success && data.data) {
        // Store both token key variants for full compatibility
        localStorage.setItem("freshcart_access_token", data.data.accessToken);
        localStorage.setItem("freshcart_refresh_token", data.data.refreshToken);
        localStorage.setItem("token", data.data.accessToken);
        localStorage.setItem("user", JSON.stringify(data.data.user));

        onVerified(data.data.user);
      } else {
        setError(data.message || "Invalid OTP code.");
      }
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-3xl p-8 shadow-sm border border-gray-100 dark:border-gray-700 relative">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-2xl font-black text-gray-900 dark:text-white uppercase tracking-tighter italic">
            Quick Checkout
          </h2>
          <p className="text-gray-500 dark:text-gray-400 mt-1 text-sm">
            {step === 'input' ? "No account needed — just your name & number." : `Enter the 6-digit code sent to ${phone}`}
          </p>
        </div>
        <button onClick={onCancel} className="text-sm font-semibold text-gray-400 hover:text-gray-700 dark:hover:text-white transition-colors">
          Back
        </button>
      </div>

      {error && (
        <div className="mb-6 p-4 rounded-xl bg-red-50 text-red-600 dark:bg-red-900/20 dark:text-red-400 text-sm font-medium">
          {error}
        </div>
      )}

      {notice && (
        <div className="mb-6 p-4 rounded-xl bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400 text-sm font-medium border border-blue-100 dark:border-blue-800">
          {notice}
        </div>
      )}

      {step === 'input' ? (
        <form onSubmit={handleSendOtp} className="space-y-5">
          <div>
            <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Your Name</label>
            <div className="relative">
              <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input
                type="text"
                required
                placeholder="e.g. Rahat Ahmed"
                value={name}
                onChange={e => setName(e.target.value)}
                className="w-full pl-11 pr-4 py-3.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:ring-2 focus:ring-blue-500 outline-none transition-all font-medium"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Mobile Number</label>
            <div className="relative">
              <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input
                type="tel"
                required
                placeholder="e.g. 017XXXXXXXX"
                value={phone}
                onChange={e => setPhone(e.target.value)}
                className="w-full pl-11 pr-4 py-3.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:ring-2 focus:ring-blue-500 outline-none transition-all font-medium"
              />
            </div>
          </div>
          <button
            type="submit"
            disabled={loading || phone.length < 10 || !name.trim()}
            className="w-full py-3.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold uppercase tracking-wide transition-all disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {loading ? <Loader2 className="animate-spin" size={20} /> : "Send Verification Code"}
          </button>
        </form>
      ) : (
        <form onSubmit={handleVerifyOtp} className="space-y-6">
          <div>
            <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">6-Digit Code</label>
            <div className="relative">
              <KeyRound className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input
                type="text"
                required
                maxLength={6}
                placeholder="000000"
                value={otp}
                onChange={e => setOtp(e.target.value)}
                className="w-full pl-11 pr-4 py-3 text-center text-3xl tracking-[1em] rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none transition-all font-black"
              />
            </div>
            <p className="text-right text-sm text-gray-500 mt-2">
              Sent to <span className="font-bold">{phone}</span> ·{" "}
              <button type="button" onClick={() => setStep('input')} className="text-blue-500 hover:underline">Edit</button>
            </p>
          </div>
          <button
            type="submit"
            disabled={loading || otp.length < 4}
            className="w-full py-3.5 bg-green-600 hover:bg-green-700 text-white rounded-xl font-bold uppercase tracking-wide transition-all disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {loading ? <Loader2 className="animate-spin" size={20} /> : <><CheckCircle2 size={20} /> Verify & Continue</>}
          </button>
        </form>
      )}

      {/* Popup for existing number */}
      {showExistingPopup && (
        <div className="absolute inset-0 z-50 flex items-center justify-center p-4 bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm rounded-3xl">
          <div className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-xl max-w-sm w-full border border-gray-100 dark:border-gray-700 text-center">
            <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/50 text-blue-600 dark:text-blue-400 rounded-full flex items-center justify-center mx-auto mb-4">
              <User size={32} />
            </div>
            
            {isRegisteredUser ? (
              <>
                <h3 className="text-xl font-black text-gray-900 dark:text-white uppercase tracking-tighter italic mb-2">
                  Account Exists!
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
                  A user with the number <span className="font-bold text-gray-900 dark:text-white">{phone}</span> already exists in our system. You can securely login with your Email/ID and Password.
                </p>
                <div className="space-y-3">
                  <button
                    onClick={() => window.location.href = '/login?redirect=/checkout'}
                    className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold transition-all"
                  >
                    Login with ID / Password
                  </button>
                  <button
                    onClick={() => {
                      setShowExistingPopup(false);
                      setStep('verify');
                    }}
                    className="w-full py-3 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-800 dark:text-white rounded-xl font-bold transition-all"
                  >
                    Continue with OTP
                  </button>
                </div>
              </>
            ) : (
              <>
                <h3 className="text-xl font-black text-gray-900 dark:text-white uppercase tracking-tighter italic mb-2">
                  Welcome Back!
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
                  You've securely checked out with us before! Did you know that by signing up for a full account you can get exclusive discounts and many special offers?
                </p>
                <div className="space-y-3">
                  <button
                    onClick={() => window.location.href = '/register?redirect=/checkout'}
                    className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold transition-all flex items-center justify-center gap-2"
                  >
                    Sign Up Now
                  </button>
                  <button
                    onClick={() => {
                      setShowExistingPopup(false);
                      setStep('verify');
                    }}
                    className="w-full py-3 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-800 dark:text-white rounded-xl font-bold transition-all"
                  >
                    Continue as Guest
                  </button>
                </div>
              </>
            )}
            
          </div>
        </div>
      )}
    </div>
  );
}
