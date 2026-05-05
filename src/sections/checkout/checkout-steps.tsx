// @/sections/checkout/checkout-steps.tsx

import { useCartUIStore } from "@/store/cart-ui";
import React from "react";

export const CheckoutSteps = () => {
  const step = useCartUIStore((state) => state.step);

  return (
    <div className="flex items-center gap-2 mb-10">
      {["Cart", "Checkout", "Confirmed"].map((s, i) => {
        const stepMap: Record<string, number> = {
          cart: 0,
          checkout: 1,
          confirmed: 2,
        };
        const currentIdx = stepMap[step];
        return (
          <React.Fragment key={s}>
            {i > 0 && (
              <div
                className={`h-px flex-1 ${i <= currentIdx ? "bg-primary" : "bg-border"}`}
              />
            )}
            <div
              className={`flex items-center gap-1.5 ${i <= currentIdx ? "text-primary" : "text-muted-foreground"}`}
            >
              <div
                className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-800 ${
                  i < currentIdx
                    ? "bg-primary text-primary-foreground"
                    : i === currentIdx
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted text-muted-foreground"
                }`}
              >
                {i < currentIdx ? "✓" : i + 1}
              </div>
              <span className="text-xs font-semibold hidden sm:block">{s}</span>
            </div>
          </React.Fragment>
        );
      })}
    </div>
  );
};
