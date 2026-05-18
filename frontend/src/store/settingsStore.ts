import { API_URL } from "@/lib/config";
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface SettingsState {
  settings: {
    permalink_structure?: 'flat' | 'product';
    store_name?: string;
    [key: string]: any;
  };
  loading: boolean;
  setSettings: (settings: any) => void;
  fetchSettings: () => Promise<void>;
}

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
      settings: {
        permalink_structure: 'flat', // Default
        store_name: 'FreshCart'
      },
      loading: true,
      setSettings: (settings) => set({ settings }),
      fetchSettings: async () => {
        set({ loading: true });
        try {
          const res = await fetch(`${API_URL}/api/global-settings`);
          const json = await res.json();
          if (json.success) {
            set({ settings: json.data });
          }
        } catch (e) {
          console.error("Failed to fetch settings:", e);
        } finally {
          set({ loading: false });
        }
      }
    }),
    {
      name: 'freshcart-settings',
      partialize: (state) => ({ settings: state.settings }),
    }
  )
);
