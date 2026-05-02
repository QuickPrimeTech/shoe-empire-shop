// @/store/wishlist.ts
import { create } from "zustand";
import { immer } from "zustand/middleware/immer";
import { persist, createJSONStorage } from "zustand/middleware";

export type WishlistItem = {
  id: string; // productId (unique identifier)
  name: string;
  price: number;
  image: string;
  size?: string; // optional: if they selected a preferred size
};

type WishlistStore = {
  items: WishlistItem[];

  toggleItem: (item: WishlistItem) => void;
  removeItem: (id: string) => void;
  clearWishlist: () => void;
  isInWishlist: (id: string) => boolean;
  getTotalItems: () => number;
};

export const useWishlistStore = create<WishlistStore>()(
  persist(
    immer((set, get) => ({
      items: [],

      toggleItem: (item) =>
        set((draft) => {
          const index = draft.items.findIndex((i) => i.id === item.id);
          if (index !== -1) {
            draft.items.splice(index, 1); // remove if exists
          } else {
            draft.items.push(item); // add if new
          }
        }),

      removeItem: (id) =>
        set((draft) => {
          const index = draft.items.findIndex((i) => i.id === id);
          if (index !== -1) draft.items.splice(index, 1);
        }),

      clearWishlist: () => set({ items: [] }),

      isInWishlist: (id) => get().items.some((i) => i.id === id),

      getTotalItems: () => get().items.length,
    })),
    {
      name: "wishlist",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ items: state.items }),
    },
  ),
);
