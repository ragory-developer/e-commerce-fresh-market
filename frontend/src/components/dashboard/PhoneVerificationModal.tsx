"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Loader2, CheckCircle2, AlertCircle, Smartphone } from "lucide-react";
import { API_URL } from "@/lib/config";

interface PhoneVerificationModalProps {
  isOpen: boolean;
  onClose: () => void;
  newPhone: string;
  onSuccess: () => void;
}

export default function PhoneVerificationModal({ isOpen, onClose, newPhone, onSuccess }: PhoneVerificationModalProps) {
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [resendTimer, setResendTimer] = useState(60);
  const [isResending, setIsResending] = useState(false);

  useEffect(() => {
    let interval: any;
    if (isOpen && resendTimer > 0) {
      interval = setInterval(() => setResendTimer(prev => prev - 1), 1000);
    }
    return () => clearInterval(interval);
  }, [isOpen, resendTimer]);

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    if (code.length < 4) return;

    setLoading(true);
    setError(null);

    try {
      const token = localStorage.getItem("freshcart_access_token") || localStorage.getItem("token");
      const res = await fetch(`${API_URL}/api/users/verify-phone-change`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({ newPhone, code })
      });

      const json = await res.json();
      if (json.success) {
        onSuccess();
        onClose();
      } else {
        setError(json.message || "Invalid verification code");
      }
    } catch (err) {
      setError("An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    if (resendTimer > 0) return;
    setIsResending(true);
    setError(null);
    try {
      const token = localStorage.getItem("freshcart_access_token") || localStorage.getItem("token");
      await fetch(`${API_URL}/api/users/request-phone-change`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({ newPhone })
      });
      setResendTimer(60);
    } catch (err) {
      setError("Failed to resend code");
    } finally {
      setIsResending(false);
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          className="bg-white dark:bg-gray-900 w-full max-w-md rounded-[2.5rem] overflow-hidden shadow-2xl border border-gray-100 dark:border-gray-800"
        >
          <div className="p-8">
            <div className="flex justify-between items-center mb-6">
              <div className="w-12 h-12 bg-blue-50 dark:bg-blue-900/30 rounded-2xl flex items-center justify-center text-blue-600">
                <Smartphone size={24} />
              </div>
              <button 
                onClick={onClose}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl transition-colors text-gray-400"
              >
                <X size={20} />
              </button>
            </div>

            <h2 className="text-2xl font-black text-gray-900 dark:text-white uppercase italic tracking-tight mb-2">
              Verify New Number
            </h2>
            <p className="text-gray-500 dark:text-gray-400 text-sm font-medium mb-8">
              We've sent a 6-digit code to <span className="text-blue-600 font-bold">{newPhone}</span>. Please enter it below to confirm the change.
            </p>

            <form onSubmit={handleVerify} className="space-y-6">
              <div>
                <input
                  type="text"
                  required
                  maxLength={6}
                  value={code}
                  onChange={(e) => setCode(e.target.value.replace(/\D/g, ""))}
                  placeholder="Enter Code"
                  className="w-full px-6 py-4 bg-gray-50 dark:bg-gray-950 border border-gray-100 dark:border-gray-800 rounded-2xl outline-none focus:border-blue-500 font-black text-center text-2xl tracking-[0.5em] text-gray-900 dark:text-white transition-all"
                />
              </div>

              {error && (
                <div className="flex items-center gap-2 p-4 bg-red-50 text-red-600 rounded-2xl text-xs font-bold border border-red-100">
                  <AlertCircle size={14} />
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={loading || code.length < 4}
                className="w-full py-4 bg-blue-600 hoer:bg-blue-700 disabled:opacity-50 text-white rounded-2xl font-black uppercase tracking-widest text-xs transition-all shadow-lg shadow-blue-600/20 flex items-center justify-center gap-2"
              >
                {loading ? <Loader2 className="animate-spin" size={18} /> : "Verify & Save"}
              </button>
            </form>

            <div className="mt-8 text-center">
              <button
                onClick={handleResend}
                disabled={resendTimer > 0 || isResending}
                className="text-xs font-black uppercase tracking-widest text-gray-400 hover:text-blue-600 disabled:opacity-50 transition-colors"
              >
                {resendTimer > 0 
                  ? `Resend Code in ${resendTimer}s` 
                  : isResending ? "Resending..." : "Resend Code"
                }
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
