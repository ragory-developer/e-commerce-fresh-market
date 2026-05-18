"use client";

import React, { createContext, useContext, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { API_URL } from '@/lib/config';

interface User {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  role: 'ADMIN' | 'USER' | 'SUPER_ADMIN';
  permissions?: string[];
  isGuest?: boolean;
  gender?: string;
  dateOfBirth?: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (accessToken: string, refreshToken: string, user: any) => void;
  logout: () => void;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const initializeAuth = async () => {
      // Check for existing auth in localStorage (support both key variants)
      const storedUser = localStorage.getItem('freshcart_user') || localStorage.getItem('user');
      const token = localStorage.getItem('freshcart_access_token') || localStorage.getItem('token');

      if (storedUser && token) {
        try {
          const parsed = JSON.parse(storedUser);
          // Ensure permissions are parsed if they come as a JSON string from backend
          if (typeof parsed.permissions === 'string') {
            parsed.permissions = JSON.parse(parsed.permissions);
          }
          
          // Securely verify token with backend to prevent unauthorized layout access
          const res = await fetch(`${API_URL}/api/users/profile`, {
             headers: { Authorization: `Bearer ${token}` }
          });
          const data = await res.json();
          
          if (res.ok && data.success) {
             setUser(parsed);
          } else {
             // Clear both key variants
             localStorage.removeItem('freshcart_access_token');
             localStorage.removeItem('freshcart_refresh_token');
             localStorage.removeItem('freshcart_user');
             localStorage.removeItem('token');
             localStorage.removeItem('user');
             setUser(null);
          }
        } catch (e) {
          console.error("Failed to parse user data or verify token", e);
          setUser(null);
        }
      }
      setLoading(false);
    };

    initializeAuth();
  }, []);

  const login = (accessToken: string, refreshToken: string, userData: any) => {
    // Standardize permissions before storing
    if (typeof userData.permissions === 'string') {
      try {
        userData.permissions = JSON.parse(userData.permissions);
      } catch (e) {
        userData.permissions = [];
      }
    }
    
    // Write to both key variants so all parts of the app can read the token
    localStorage.setItem('freshcart_access_token', accessToken);
    localStorage.setItem('freshcart_refresh_token', refreshToken);
    localStorage.setItem('freshcart_user', JSON.stringify(userData));
    // Legacy keys used by authStore, checkout, address form, etc.
    localStorage.setItem('token', accessToken);
    localStorage.setItem('user', JSON.stringify(userData));
    setUser(userData);
  };

  const logout = () => {
    // Clear both key variants
    localStorage.removeItem('freshcart_access_token');
    localStorage.removeItem('freshcart_refresh_token');
    localStorage.removeItem('freshcart_user');
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    router.replace('/login');
  };

  const refreshProfile = async () => {
    const token = localStorage.getItem('freshcart_access_token') || localStorage.getItem('token');
    if (!token) return;

    try {
      const res = await fetch(`${API_URL}/api/users/profile`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      
      if (res.ok && data.success) {
        const userData = data.data;
        if (typeof userData.permissions === 'string') {
          try {
            userData.permissions = JSON.parse(userData.permissions);
          } catch (e) {
            userData.permissions = [];
          }
        }
        localStorage.setItem('freshcart_user', JSON.stringify(userData));
        localStorage.setItem('user', JSON.stringify(userData));
        setUser(userData);
      }
    } catch (e) {
      console.error("Failed to refresh profile", e);
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, refreshProfile }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
