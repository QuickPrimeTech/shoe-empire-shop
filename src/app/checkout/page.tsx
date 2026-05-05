// @/app/checkout.tsx
"use client";
import Link from "next/link";
import OrderConfirmation from "@/sections/checkout/order-confirmation";
import CartItems from "@/sections/checkout/cart-items";
import CheckoutForm from "@/sections/checkout/checkout-form";
import OrderSummary from "@/sections/checkout/order-summary";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { EmptyState } from "@/sections/checkout/empty-state";
import { useCartUIStore } from "@/store/cart-ui";
import { useCartStore } from "@/store/cart";
import { CheckoutSteps } from "@/sections/checkout/checkout-steps";

export type CartItem = {
  id: number;
  name: string;
  brand: string;
  size: string;
  color: string;
  price: number;
  quantity: number;
  image: string;
  alt: string;
};

export default function CartCheckoutPage() {
  const step = useCartUIStore((state) => state.step);
  const cart = useCartStore((state) => state.items);

  if (step === "confirmed") {
    return (
      <main className="min-h-screen bg-background">
        <OrderConfirmation />
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto section py-20">
        {/* Header */}
        <div className="space-y-8 mb-8">
          <Button variant={"link"} asChild>
            <Link href="/products">
              <ArrowLeft /> Continue Shopping
            </Link>
          </Button>
          <div className="space-y-2">
            <h1 className="text-2xl md:text-3xl font-bold font-800 text-foreground">
              {step === "cart" ? "Your Cart" : "Checkout"}
            </h1>
            {cart.length > 0 && (
              <p className="text-sm text-muted-foreground font-500 mt-1">
                {cart.reduce((s, i) => s + i.quantity, 0)} item
                {cart.reduce((s, i) => s + i.quantity, 0) !== 1 ? "s" : ""} in
                your cart
              </p>
            )}
          </div>
        </div>

        {/* Steps indicator */}
        <CheckoutSteps />
        {cart.length === 0 ? (
          <EmptyState />
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Left: Cart / Checkout Form */}
            <div className="lg:col-span-7">
              {step === "cart" ? <CartItems /> : <CheckoutForm />}
            </div>

            {/* Right: Order Summary */}
            <div className="lg:col-span-5">
              <OrderSummary />
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
