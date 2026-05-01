// @/store/cart.ts

import { create } from "zustand";

export type Product = {
  id: string;
  name: string;
  category: string;
  price: number;
  image: string;
  color: string;
};

export type CartItem = Product & { size: number; qty: number };

type CartState = {
  items: CartItem[];
  isOpen: boolean;
  open: () => void;
  close: () => void;
  toggle: () => void;
  add: (item: CartItem) => void;
  remove: (id: string, size: number) => void;
  inc: (id: string, size: number) => void;
  dec: (id: string, size: number) => void;
  total: () => number;
  count: () => number;
};

export const useCart = create<CartState>((set, get) => ({
  items: [],
  isOpen: false,
  open: () => set({ isOpen: true }),
  close: () => set({ isOpen: false }),
  toggle: () => set((s) => ({ isOpen: !s.isOpen })),
  add: (item) =>
    set((s) => {
      const existing = s.items.find(
        (i) => i.id === item.id && i.size === item.size,
      );
      if (existing) {
        return {
          items: s.items.map((i) =>
            i.id === item.id && i.size === item.size
              ? { ...i, qty: i.qty + item.qty }
              : i,
          ),
        };
      }
      return { items: [...s.items, item] };
    }),
  remove: (id, size) =>
    set((s) => ({
      items: s.items.filter((i) => !(i.id === id && i.size === size)),
    })),
  inc: (id, size) =>
    set((s) => ({
      items: s.items.map((i) =>
        i.id === id && i.size === size ? { ...i, qty: i.qty + 1 } : i,
      ),
    })),
  dec: (id, size) =>
    set((s) => ({
      items: s.items
        .map((i) =>
          i.id === id && i.size === size ? { ...i, qty: i.qty - 1 } : i,
        )
        .filter((i) => i.qty > 0),
    })),
  total: () => get().items.reduce((sum, i) => sum + i.price * i.qty, 0),
  count: () => get().items.reduce((sum, i) => sum + i.qty, 0),
}));
