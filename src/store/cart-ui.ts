// @/store/cart-ui.ts

import { create } from "zustand";
import { immer } from "zustand/middleware/immer";
import { persist, createJSONStorage } from "zustand/middleware";

type CartStep = "cart" | "checkout" | "confirmed";
type CartStore = {
  open: boolean;
  setOpen: (open: boolean) => void;
  step: CartStep;
  setStep: (step: CartStep) => void;
};

export const useCartUIStore = create<CartStore>()(
  persist(
    immer((set) => ({
      open: false,
      step: "cart",
      setOpen: (open) => {
        set({ open });
      },
      setStep: (step) => {
        set({ step });
      },
    })),
    {
      name: "cart-ui",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ open: state.open }),
    },
  ),
);
