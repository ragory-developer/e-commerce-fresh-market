import { create } from 'zustand';
import { API_URL } from '@/lib/config';

export interface User {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  isGuest?: boolean;
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  loading: boolean;
  fetchUser: () => Promise<void>;
  logout: () => void;
  setUser: (user: User) => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isAuthenticated: false,
  loading: true,

  fetchUser: async () => {
    try {
      const token = localStorage.getItem('freshcart_access_token') || localStorage.getItem('token');
      const userStr = localStorage.getItem('freshcart_user') || localStorage.getItem('user');
      
      if (!token) {
        set({ user: null, isAuthenticated: false, loading: false });
        return;
      }

      if (userStr) {
        set({ user: JSON.parse(userStr), isAuthenticated: true, loading: false });
      }

      // Try fetching active profile if endpoint exists, otherwise silently fail and rely on token/cache
      try {
        const res = await fetch(`${API_URL}/api/users/profile`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        const data = await res.json();
        if (data.success && data.data) {
          set({ user: data.data, isAuthenticated: true });
          localStorage.setItem('user', JSON.stringify(data.data));
        }
      } catch (e) {}
      
    } catch (e) {
      set({ loading: false });
    }
  },

  logout: () => {
    localStorage.removeItem('freshcart_access_token');
    localStorage.removeItem('freshcart_refresh_token');
    localStorage.removeItem('freshcart_user');
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    set({ user: null, isAuthenticated: false });
  },

  setUser: (user: User) => {
    localStorage.setItem('user', JSON.stringify(user));
    set({ user, isAuthenticated: true });
  },
}));
