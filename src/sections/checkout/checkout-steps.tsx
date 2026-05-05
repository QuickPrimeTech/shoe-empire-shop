// @/sections/checkout/checkout-steps.tsx
"use client";

import React from "react";
import { useCartUIStore } from "@/store/cart-ui";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

const STEPS = ["Cart", "Checkout", "Confirmed"];
const STEP_MAP: Record<string, number> = {
  cart: 0,
  checkout: 1,
  confirmed: 2,
};

export const CheckoutSteps = () => {
  const step = useCartUIStore((state) => state.step);
  const currentIdx = STEP_MAP[step] ?? 0;

  return (
    <TooltipProvider delayDuration={0}>
      <div className="flex items-center gap-2 mb-12 px-2">
        {STEPS.map((s, i) => {
          const isCompleted = i < currentIdx;
          const isActive = i === currentIdx;

          return (
            <React.Fragment key={s}>
              {/* Progress Line */}
              {i > 0 && (
                <div
                  className={`h-0.5 flex-1 transition-colors duration-300 ${
                    i <= currentIdx ? "bg-primary" : "bg-border"
                  }`}
                />
              )}

              {/* Step Circle with Tooltip */}
              <Tooltip open>
                <TooltipTrigger asChild>
                  <div
                    className={`relative flex flex-col items-center cursor-default shrink-0 z-10`}
                  >
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-900 transition-all duration-300 shadow-sm ${
                        isCompleted || isActive
                          ? "bg-primary text-primary-foreground"
                          : "bg-muted text-muted-foreground border border-border"
                      } ${isActive ? "ring-4 ring-primary/20 scale-110" : ""}`}
                    >
                      {isCompleted ? "✓" : i + 1}
                    </div>
                  </div>
                </TooltipTrigger>
                <TooltipContent side="top" sideOffset={8}>
                  {s}
                </TooltipContent>
              </Tooltip>
            </React.Fragment>
          );
        })}
      </div>
    </TooltipProvider>
  );
};
