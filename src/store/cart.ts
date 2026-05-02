// @/store/cart.ts
import { create } from "zustand";
import { immer } from "zustand/middleware/immer";
import { persist, createJSONStorage } from "zustand/middleware";

type ProductSize = {
  size: string;
  stock: number;
};

export type CartItem = {
  id: string; // cartId (unique per cart item)
  productId: string;
  name: string;
  price: number;
  image: string;
  size: ProductSize;
  quantity: number;
};

type CartStore = {
  items: CartItem[];

  addItem: (item: Omit<CartItem, "id">) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;

  // derived helpers
  getTotalItems: () => number;
  getTotalPrice: () => number;
};

export const useCartStore = create<CartStore>()(
  persist(
    immer((set, get) => ({
      items: [],

      addItem: (item) =>
        set((draft) => {
          const existing = draft.items.find(
            (i) =>
              i.productId === item.productId && i.size.size === item.size.size,
          );

          if (existing) {
            existing.quantity += item.quantity;
            return;
          }

          draft.items.push({
            ...item,
            id: crypto.randomUUID(),
          });
        }),

      removeItem: (id) =>
        set((draft) => {
          const index = draft.items.findIndex((i) => i.id === id);
          if (index !== -1) draft.items.splice(index, 1);
        }),

      updateQuantity: (id, quantity) =>
        set((draft) => {
          const item = draft.items.find((i) => i.id === id);
          if (item) item.quantity = Math.max(1, quantity);
        }),

      clearCart: () => set({ items: [] }),

      getTotalItems: () =>
        get().items.reduce((acc, item) => acc + item.quantity, 0),

      getTotalPrice: () =>
        get().items.reduce((acc, item) => acc + item.price * item.quantity, 0),
    })),
    {
      name: "cart",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ items: state.items }),
    },
  ),
);
