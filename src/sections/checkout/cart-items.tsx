// @/sections/checkout/cart-items.tsx
"use client";
import { useCartUIStore } from "@/store/cart-ui";
import { CartItemCard } from "@/components/cart/cart-item";
import { useCartStore } from "@/store/cart";
import { ArrowRight, RefreshCcw, ShieldCheck, Truck } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function CartItems() {
  const cart = useCartStore((state) => state.items);
  const setStep = useCartUIStore((state) => state.setStep);
  return (
    <div className="flex flex-col gap-4">
      {cart.map((cartItem) => (
        <CartItemCard key={cartItem.id} cartItem={cartItem} />
      ))}

      {/* Continue button */}
      <Button
        size={"xl"}
        className="cursor-pointer"
        onClick={() => setStep("checkout")}
      >
        Proceed to Checkout
        <ArrowRight />
      </Button>

      {/* Trust badges */}
      <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
        {[
          { icon: ShieldCheck, label: "100% Authentic" },
          { icon: Truck, label: "Fast Delivery" },
          { icon: RefreshCcw, label: "7-Day Returns" },
        ].map((badge) => (
          <div
            key={badge.label}
            className="flex items-center gap-1.5 text-xs font-600 text-muted-foreground"
          >
            <badge.icon
              name={badge.icon as any}
              size={14}
              className="text-primary"
            />
            {badge.label}
          </div>
        ))}
      </div>
    </div>
  );
}
