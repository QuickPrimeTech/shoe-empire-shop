// @/sections/checkout/order-confirmation.tsx
"use client";
import Link from "next/link";
import { useCartStore } from "@/store/cart";
import {
  ArrowRight,
  Check,
  Clock,
  CreditCard,
  Star,
  Truck,
} from "lucide-react";
import { BiMobile } from "react-icons/bi";
import { BsWhatsapp } from "react-icons/bs";
import { Button } from "@/components/ui/button";
import { useCartUIStore } from "@/store/cart-ui";

export default function OrderConfirmation() {
  const total = useCartStore((state) => state.getTotalPrice());
  const setStep = useCartUIStore((state) => state.setStep);

  const handleFinishCheckout = () => {
    setStep("cart");
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-20">
      <div className="max-w-lg w-full text-center">
        {/* Success animation */}
        <div className="relative w-24 h-24 mx-auto mb-8">
          <div className="absolute inset-0 rounded-full bg-primary/20 animate-ping" />
          <div className="relative w-24 h-24 rounded-full bg-primary flex items-center justify-center">
            <Check size={40} className="text-primary-foreground" />
          </div>
        </div>

        <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-3">
          Order Confirmed! 🎉
        </h1>
        <p className="text-base text-muted-foreground font-500 mb-8 leading-relaxed">
          Your fresh kicks are on their way. We&apos;ll send you a WhatsApp
          update when your order ships.
        </p>

        {/* Order details card */}
        <div className="rounded-2xl border border-border bg-card p-6 mb-8 text-left">
          <div className="flex items-center justify-between mb-4 pb-4 border-b border-border">
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-0.5">
              Order
            </p>
            <div className="px-3 py-1.5 bg-green-500/10 border border-green-500/20 rounded-full">
              <p className="text-xs font-800 text-green-400">Confirmed</p>
            </div>
          </div>

          <div className="flex flex-col gap-3">
            {[
              {
                icon: CreditCard,
                label: "Total Paid",
                value: `KES ${total.toLocaleString()}`,
              },
              {
                icon: Truck,
                label: "Delivery",
                value: "Nairobi CBD · Same-day",
              },
              {
                icon: Clock,
                label: "Estimated Arrival",
                value: "Today by 7:00 PM",
              },
              {
                icon: BiMobile,
                label: "Updates via",
                value: "WhatsApp + SMS",
              },
            ].map((detail) => (
              <div
                key={detail.label}
                className="flex items-center justify-between"
              >
                <div className="flex items-center gap-2 text-sm">
                  <detail.icon size={16} className="text-primary shrink-0" />
                  <span className="text-muted-foreground font-500">
                    {detail.label}
                  </span>
                </div>
                <span className="text-sm font-semibold text-foreground">
                  {detail.value}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Loyalty points earned */}
        <div className="rounded-2xl border border-primary/20 bg-primary/5 p-4 mb-8 flex items-center gap-4">
          <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center shrink-0">
            <Star size={20} className="text-primary" />
          </div>
          <div className="text-left">
            <p className="font-bold font-heading text-foreground">
              You earned KickPoints™!
            </p>
            <p className="text-xs text-muted-foreground font-500">
              +{Math.floor(total / 100)} points added to your account. Use on
              your next order.
            </p>
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-col justify-center sm:flex-row gap-3">
          <Button
            size={"xl"}
            variant={"outline"}
            onClick={handleFinishCheckout}
            asChild
          >
            <Link href="/products">
              Continue Shopping
              <ArrowRight size={16} />
            </Link>
          </Button>
          <Button
            variant={"outline"}
            size={"xl"}
            className="border border-green-500/30 text-green-500 text-sm font-semibold hover:bg-green-500 gap-2"
            asChild
          >
            <a
              href="https://wa.me/+254721771108?text=Hi%2C%20my%20order%20number%20is%20XXXXXX.%20Can%20I%20track%20it%3F"
              target="_blank"
              rel="noopener noreferrer"
            >
              <BsWhatsapp className="size-5" />
              Track via WhatsApp
            </a>
          </Button>
        </div>
      </div>
    </div>
  );
}
