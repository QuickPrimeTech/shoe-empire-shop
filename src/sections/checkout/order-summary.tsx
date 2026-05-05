// @/sections/checkout/order-summary.tsx
"use client";
import { useCartStore } from "@/store/cart";
import { CartItemCard } from "@/components/cart/cart-item";
import { useCartUIStore } from "@/store/cart-ui";
import { FaWhatsapp } from "react-icons/fa";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { ArrowRight, RefreshCcw, ShieldCheck, Truck } from "lucide-react";
import { BiMobile } from "react-icons/bi";

export default function OrderSummary() {
  const cart = useCartStore((state) => state.items);
  const step = useCartUIStore((state) => state.step);
  const setStep = useCartUIStore((state) => state.setStep);

  // --- Dummy State & Logic for Missing Variables ---
  const [discountCode, setDiscountCode] = useState("");
  const [discountApplied, setDiscountApplied] = useState(false);

  const subtotal = useCartStore((state) => state.getTotalPrice());
  const deliveryFee = subtotal > 0 ? 350 : 0; // Standard Nairobi delivery fee
  const discount = discountApplied ? subtotal * 0.1 : 0; // 10% discount
  const total = subtotal + deliveryFee - discount;

  const onDiscountChange = (val: string) => {
    setDiscountCode(val);
  };

  const onApplyDiscount = () => {
    if (discountCode.trim() === "KICKSLOVE") {
      setDiscountApplied(true);
    } else {
      toast.error("Invalid code. Try KICKSLOVE");
    }
  };

  return (
    <div className="sticky top-24 flex flex-col gap-4">
      {/* Summary Card */}
      <div className="rounded-2xl border border-border bg-card p-5 md:p-6">
        <h2 className="text-base font-800 text-foreground mb-5">
          Order Summary
        </h2>

        {/* Items */}
        <div className="flex flex-col gap-3 mb-5 max-h-48 overflow-y-auto no-scrollbar">
          {cart.map((cartItem) => (
            <CartItemCard key={cartItem.id} cartItem={cartItem} />
          ))}
        </div>

        {/* Discount code */}
        <div className="flex gap-2 mb-5">
          <Input
            type="text"
            placeholder="Promo code (e.g. KICKSLOVE)"
            value={discountCode}
            onChange={(e) => onDiscountChange(e.target.value.toUpperCase())}
            className={cn(
              `flex-1`,
              discountApplied && "border-green-500 focus:border-primary",
            )}
            disabled={discountApplied}
          />
          <Button
            onClick={onApplyDiscount}
            variant={"outline"}
            disabled={discountApplied || !discountCode}
            className={cn(
              "shrink-0 rounded-sm",
              discountApplied &&
                "bg-green-500/20 text-green-400 border border-green-500/30",
            )}
          >
            {discountApplied ? "✓ Applied" : "Apply"}
          </Button>
        </div>

        {/* Price breakdown */}
        <div className="flex flex-col gap-2.5 border-t border-border pt-4 mb-4">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Subtotal</span>
            <span className="font-semibold text-foreground">
              KES {subtotal.toLocaleString()}
            </span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Delivery</span>
            <span className="font-semibold text-foreground">
              KES {deliveryFee.toLocaleString()}
            </span>
          </div>
          {discount > 0 && (
            <div className="flex items-center justify-between text-sm">
              <span className="text-green-400 font-semibold">
                Discount (10%)
              </span>
              <span className="font-800 text-green-400">
                −KES {discount.toLocaleString()}
              </span>
            </div>
          )}
          <div className="flex items-center justify-between border-t border-border pt-3 mt-1">
            <span className="text-base font-800 text-foreground">Total</span>
            <span className="text-xl font-bold text-primary">
              KES {total.toLocaleString()}
            </span>
          </div>
        </div>

        {/* Checkout CTA (only on cart step) */}
        {step === "cart" && (
          <Button
            size={"xl"}
            className="w-full cursor-pointer"
            onClick={() => setStep("checkout")}
          >
            Checkout · KES {total.toLocaleString()}
            <ArrowRight size={16} />
          </Button>
        )}
      </div>

      {/* Trust + Delivery info */}
      <div className="rounded-2xl border border-border bg-card p-5">
        <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-4">
          Why UrbanKicks?
        </h3>
        <div className="flex flex-col gap-3">
          {[
            {
              icon: ShieldCheck,
              title: "100% Authentic",
              desc: "Every pair verified genuine",
            },
            {
              icon: Truck,
              title: "Same-day Nairobi",
              desc: "Order before 2PM, get today",
            },
            {
              icon: BiMobile,
              title: "M-Pesa Payments",
              desc: "Fast, secure, familiar",
            },
            {
              icon: RefreshCcw,
              title: "7-Day Returns",
              desc: "Not happy? We fix it",
            },
          ].map((item) => (
            <div key={item.title} className="flex items-start gap-3">
              <item.icon
                name={item.icon as any}
                size={16}
                className="text-primary shrink-0 mt-0.5"
              />
              <div>
                <p className="text-xs font-semibold text-foreground">
                  {item.title}
                </p>
                <p className="text-[11px] text-muted-foreground font-500">
                  {item.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* WhatsApp help */}
      <Button size={"xl"} className="" variant={"success"} asChild>
        <a
          href="https://wa.me/254721771108?text=Hi%2C%20I%20need%20help%20with%20my%20order"
          target="_blank"
          rel="noopener noreferrer"
        >
          <FaWhatsapp className="size-5 mr-1.5" />
          Need help? Chat with us
        </a>
      </Button>
    </div>
  );
}
