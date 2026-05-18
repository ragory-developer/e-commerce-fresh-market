"use client";

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { API_URL } from '@/lib/config';
import { useRouter } from 'next/navigation';
import { ShieldCheck, Mail, Lock } from 'lucide-react';

export default function AdminLoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const { user, login } = useAuth();
  const router = useRouter();

  // Redirect if already logged in as admin
  useEffect(() => {
    if (user?.role === 'ADMIN' || user?.role === 'SUPER_ADMIN') {
      router.replace('/admin');
    }
  }, [user, router]);

  const handleAdminLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = await fetch(`${API_URL}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const payload = await res.json();
      if (!res.ok) throw new Error(payload.message || 'Invalid credentials');
      
      const { user, accessToken, refreshToken } = payload.data;

      if (!user || (user.role !== 'ADMIN' && user.role !== 'SUPER_ADMIN')) {
        throw new Error('Unauthorized. Admin access only.');
      }

      login(accessToken, refreshToken, user);
      router.push('/admin');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-950 px-4">
      <div className="max-w-md w-full">
        {/* Logo */}
        <div className="flex flex-col items-center mb-8">
          <div className="bg-emerald-500 text-white p-3 rounded-2xl shadow-xl shadow-emerald-500/20 mb-4 scale-110">
            <ShieldCheck size={32} />
          </div>
          <h1 className="text-3xl font-black text-white tracking-tight">FreshCart Admin</h1>
          <p className="text-gray-500 text-sm mt-1 uppercase tracking-widest font-bold">Secure Gateway</p>
        </div>

        <div className="bg-gray-900 border border-gray-800 rounded-3xl shadow-2xl p-8 backdrop-blur-xl bg-opacity-80">
          <div className="mb-6">
            <h2 className="text-xl font-bold text-white">Administration Login</h2>
            <p className="text-gray-500 text-sm">Please authenticate to continue.</p>
          </div>

          {error && (
            <div className="bg-rose-500/10 border border-rose-500/20 text-rose-500 px-4 py-3 rounded-xl mb-6 text-sm font-medium flex items-center gap-3">
              <div className="h-2 w-2 rounded-full bg-rose-500 animate-pulse" />
              {error}
            </div>
          )}

          <form onSubmit={handleAdminLogin} className="space-y-5">
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2 ml-1">Email</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-500">
                  <Mail size={18} />
                </div>
                <input
                  type="email"
                  placeholder="admin@freshcart.com"
                  className="w-full pl-11 pr-4 py-3.5 bg-gray-800/50 border border-gray-700 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none text-white transition-all duration-200 placeholder-gray-600"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2 ml-1">Password</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-500">
                  <Lock size={18} />
                </div>
                <input
                  type="password"
                  placeholder="••••••••"
                  className="w-full pl-11 pr-4 py-3.5 bg-gray-800/50 border border-gray-700 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none text-white transition-all duration-200 placeholder-gray-600"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-emerald-600 text-white font-black py-4 rounded-xl hover:bg-emerald-500 shadow-xl shadow-emerald-600/20 transition-all duration-200 disabled:opacity-50 mt-4 uppercase tracking-widest text-sm"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <div className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Verifying...
                </span>
              ) : 'Authenticate'}
            </button>
          </form>
        </div>
        
        <div className="text-center mt-8">
          <p className="text-gray-600 text-xs">
            &copy; 2026 FreshCart Infrastructure. All rights reserved.
          </p>
        </div>
      </div>
    </div>
  );
}
