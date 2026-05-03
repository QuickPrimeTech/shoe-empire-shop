// @/store/cart-ui.ts

import { create } from "zustand";
import { immer } from "zustand/middleware/immer";
import { persist, createJSONStorage } from "zustand/middleware";

type CartStore = {
  open: boolean;
  setOpen: (open: boolean) => void;
};

export const useCartUIStore = create<CartStore>()(
  persist(
    immer((set) => ({
      open: false,
      setOpen: (open) => {
        set({ open: open });
      },
    })),
    {
      name: "cart-ui",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ open: state.open }),
    },
  ),
);
