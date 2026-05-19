"use client";

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { API_URL } from '@/lib/config';
import { useRouter, useSearchParams } from 'next/navigation';
import { Phone, Lock, KeyRound, Loader2, Eye, EyeOff, CheckCircle2 } from 'lucide-react';

type Tab = 'password' | 'otp';
type OtpStep = 'phone' | 'verify';
type LoginUser = {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  role: 'ADMIN' | 'USER' | 'SUPER_ADMIN';
  permissions?: string[];
  isGuest?: boolean;
  gender?: string;
  dateOfBirth?: string;
  [key: string]: unknown;
};

const inputCls = "w-full pl-11 pr-4 py-3.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all font-medium text-sm";

function getErrorMessage(error: unknown, fallback: string) {
  return error instanceof Error ? error.message : fallback;
}

export default function LoginTabs() {
  const [tab, setTab] = useState<Tab>('password');

  // Password tab state
  const [pwPhone, setPwPhone] = useState('');
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [pwLoading, setPwLoading] = useState(false);
  const [pwError, setPwError] = useState('');

  // OTP tab state
  const [otpPhone, setOtpPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [otpStep, setOtpStep] = useState<OtpStep>('phone');
  const [otpLoading, setOtpLoading] = useState(false);
  const [otpError, setOtpError] = useState('');
  const [countdown, setCountdown] = useState(0);

  // Success banner
  const [successMsg, setSuccessMsg] = useState('');

  const { login } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();

  // Show "Account created" banner if coming from register page
  useEffect(() => {
    if (searchParams?.get('registered') === '1') {
      setSuccessMsg('🎉 Account created! Please log in with your mobile number and password.');
    }
  }, [searchParams]);

  // OTP countdown
  useEffect(() => {
    if (countdown <= 0) return;
    const t = setTimeout(() => setCountdown(c => c - 1), 1000);
    return () => clearTimeout(t);
  }, [countdown]);

  const storeAndNavigate = (accessToken: string, refreshToken: string, user: LoginUser) => {
    login(accessToken, refreshToken, user);
    const redirectTo = searchParams?.get('redirect') || '/dashboard';
    router.push(redirectTo);
  };

  /* ── Phone + Password login ── */
  const handlePasswordLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setPwError('');
    setPwLoading(true);
    try {
      const res = await fetch(`${API_URL}/api/auth/login-with-phone`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone: pwPhone, password }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) throw new Error(data.message || 'Invalid phone or password');
      storeAndNavigate(data.data.accessToken, data.data.refreshToken, data.data.user);
    } catch (err: unknown) {
      setPwError(getErrorMessage(err, 'Login failed'));
    } finally {
      setPwLoading(false);
    }
  };

  /* ── OTP: send ── */
  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setOtpError('');
    setOtpLoading(true);
    try {
      const res = await fetch(`${API_URL}/api/auth/send-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone: otpPhone }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) throw new Error(data.message || 'Failed to send OTP');
      setCountdown(60);
      setOtpStep('verify');
    } catch (err: unknown) {
      setOtpError(getErrorMessage(err, 'Failed to send OTP'));
    } finally {
      setOtpLoading(false);
    }
  };

  /* ── OTP: verify ── */
  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setOtpError('');
    setOtpLoading(true);
    try {
      const res = await fetch(`${API_URL}/api/auth/verify-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone: otpPhone, code: otp }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) throw new Error(data.message || 'Invalid OTP');
      storeAndNavigate(data.data.accessToken, data.data.refreshToken, data.data.user);
    } catch (err: unknown) {
      setOtpError(getErrorMessage(err, 'Failed to verify OTP'));
    } finally {
      setOtpLoading(false);
    }
  };

  return (
    <div className="w-full">
      {/* Success banner (post-signup redirect) */}
      {successMsg && (
        <div className="flex items-start gap-3 bg-emerald-50 dark:bg-emerald-900/30 border border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300 px-4 py-3 rounded-xl mb-6 text-sm font-medium">
          <CheckCircle2 size={18} className="mt-0.5 shrink-0 text-emerald-500" />
          {successMsg}
        </div>
      )}

      {/* Tab switcher */}
      <div className="flex gap-1 p-1 bg-gray-100 dark:bg-gray-800 rounded-2xl mb-6">
        {([
          { key: 'password', label: 'Phone & Password' },
          { key: 'otp',      label: 'OTP Login' },
        ] as const).map(t => (
          <button
            key={t.key}
            onClick={() => { setTab(t.key); setPwError(''); setOtpError(''); }}
            className={`flex-1 py-2.5 rounded-xl text-sm font-black uppercase tracking-wider transition-all
              ${tab === t.key
                ? 'bg-white dark:bg-gray-900 text-blue-600 shadow-sm'
                : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'}`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* ── Tab: Phone + Password ── */}
      {tab === 'password' && (
        <form onSubmit={handlePasswordLogin} className="space-y-4">
          {pwError && (
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-800 text-red-600 dark:text-red-400 px-4 py-3 rounded-xl text-sm font-medium">
              {pwError}
            </div>
          )}

          <div>
            <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2 pl-1">
              Mobile Number
            </label>
            <div className="relative">
              <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input
                id="login-phone"
                type="tel"
                required
                placeholder="e.g. 01712345678"
                value={pwPhone}
                onChange={e => setPwPhone(e.target.value)}
                className={inputCls}
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2 pl-1">
              Password
            </label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input
                id="login-password"
                type={showPass ? 'text' : 'password'}
                required
                placeholder="Your password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                className={inputCls + ' pr-12'}
              />
              <button
                type="button"
                aria-label={showPass ? 'Hide password' : 'Show password'}
                aria-pressed={showPass}
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => setShowPass(v => !v)}
                className="absolute right-2 top-1/2 z-10 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-lg text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:hover:bg-gray-800 dark:hover:text-gray-300"
              >
                {showPass ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <button
            id="login-submit-btn"
            type="submit"
            disabled={pwLoading || pwPhone.length < 10 || !password}
            className="w-full flex items-center justify-center gap-2 py-4 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white rounded-2xl font-black uppercase tracking-widest transition-all shadow-xl shadow-blue-600/20 mt-2"
          >
            {pwLoading ? <Loader2 className="animate-spin" size={20} /> : 'Sign In'}
          </button>
        </form>
      )}

      {/* ── Tab: OTP Login ── */}
      {tab === 'otp' && (
        <div>
          {otpError && (
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-800 text-red-600 dark:text-red-400 px-4 py-3 rounded-xl text-sm font-medium mb-4">
              {otpError}
            </div>
          )}

          {otpStep === 'phone' ? (
            <form onSubmit={handleSendOtp} className="space-y-4">
              <div>
                <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2 pl-1">
                  Mobile Number
                </label>
                <div className="relative">
                  <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                  <input
                    id="otp-phone"
                    type="tel"
                    required
                    placeholder="e.g. 01712345678"
                    value={otpPhone}
                    onChange={e => setOtpPhone(e.target.value)}
                    className={inputCls}
                  />
                </div>
              </div>
              <button
                id="otp-send-btn"
                type="submit"
                disabled={otpLoading || otpPhone.length < 10}
                className="w-full flex items-center justify-center gap-2 py-4 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white rounded-2xl font-black uppercase tracking-widest transition-all shadow-xl shadow-blue-600/20"
              >
                {otpLoading ? <Loader2 className="animate-spin" size={20} /> : 'Send OTP'}
              </button>
            </form>
          ) : (
            <form onSubmit={handleVerifyOtp} className="space-y-4">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-xs font-black text-gray-400 uppercase tracking-widest pl-1">6-Digit Code</label>
                  <span className="text-xs text-gray-400">Sent to <strong className="text-gray-700 dark:text-gray-300">{otpPhone}</strong></span>
                </div>
                <div className="relative">
                  <KeyRound className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                  <input
                    id="otp-code"
                    type="text"
                    inputMode="numeric"
                    required
                    maxLength={6}
                    placeholder="000000"
                    value={otp}
                    onChange={e => setOtp(e.target.value.replace(/\D/g, ''))}
                    className="w-full pl-11 pr-4 py-4 text-center text-2xl tracking-[0.7em] rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none transition-all font-black"
                  />
                </div>
                <div className="text-center mt-2 text-sm">
                  {countdown > 0 ? (
                    <span className="text-gray-400">Resend in <strong className="text-blue-600">{countdown}s</strong></span>
                  ) : (
                    <button type="button" onClick={() => { setOtpStep('phone'); setOtp(''); }} className="text-blue-600 font-bold hover:underline">
                      Resend OTP
                    </button>
                  )}
                </div>
              </div>
              <button
                id="otp-verify-btn"
                type="submit"
                disabled={otpLoading || otp.length < 6}
                className="w-full flex items-center justify-center gap-2 py-4 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white rounded-2xl font-black uppercase tracking-widest transition-all shadow-xl shadow-emerald-600/20"
              >
                {otpLoading ? <Loader2 className="animate-spin" size={20} /> : <><CheckCircle2 size={18} /> Verify & Login</>}
              </button>
              <button type="button" onClick={() => { setOtpStep('phone'); setOtp(''); setOtpError(''); }}
                className="w-full text-sm font-bold text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors">
                ← Change Number
              </button>
            </form>
          )}
        </div>
      )}
    </div>
  );
}
