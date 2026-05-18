import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface CartItem {
  id: string; // product id or variant id
  productId?: string; 
  variantId?: string;
  variantName?: string;
  name: string;
  price: number;
  image: string;
  quantity: number;
  slug: string;
}

interface CartState {
  items: CartItem[];
  isOpen: boolean;
  addToCart: (item: CartItem) => void;
  removeFromCart: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  getCartTotal: () => number;
  getCartCount: () => number;
  openCart: () => void;
  closeCart: () => void;
  toggleCart: () => void;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      isOpen: false,
      openCart: () => set({ isOpen: true }),
      closeCart: () => set({ isOpen: false }),
      toggleCart: () => set((state) => ({ isOpen: !state.isOpen })),
      addToCart: (item) => {
        set((state) => {
          const existing = state.items.find((i) => i.id === item.id);
          if (existing) {
            return {
              items: state.items.map((i) =>
                i.id === item.id ? { ...i, quantity: (i.quantity || 1) + (item.quantity || 1) } : i
              ),
            };
          }
          return { items: [...state.items, { ...item, quantity: item.quantity || 1 }] };
        });
      },
      removeFromCart: (id) => {
        set((state) => ({ items: state.items.filter((i) => i.id !== id) }));
      },
      updateQuantity: (id, quantity) => {
        set((state) => ({
          items: state.items.map((i) => (i.id === id ? { ...i, quantity } : i)),
        }));
      },
      clearCart: () => set({ items: [] }),
      getCartTotal: () => {
        return get().items.reduce((total, item) => total + item.price * (item.quantity || 1), 0);
      },
      getCartCount: () => {
        return get().items.reduce((count, item) => count + (item.quantity || 1), 0);
      },
    }),
    {
      name: 'freshcart-storage',
    }
  )
);
