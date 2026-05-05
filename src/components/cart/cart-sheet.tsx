// @/components/cart/cart-popover.tsx
"use client";
import { ShoppingBag, PackageOpen, ArrowRight } from "lucide-react";
import { Button } from "../ui/button";
import { useCartStore } from "@/store/cart";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetFooter,
  SheetClose,
} from "../ui/sheet";
import { ScrollArea, ScrollBar } from "../ui/scroll-area";
import { CartItemCard } from "./cart-item";
import { formatPrice } from "@/helpers/formatters";
import Link from "next/link";
import { useCartUIStore } from "@/store/cart-ui";

export function CartSheet() {
  const totalItems = useCartStore((state) => state.getTotalItems());
  const totalPrice = useCartStore((state) => state.getTotalPrice());
  const cartItems = useCartStore((state) => state.items);
  const open = useCartUIStore((state) => state.open);
  const setOpen = useCartUIStore((state) => state.setOpen);
  const isEmpty = cartItems.length === 0;

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          title="view cart"
          className="relative size-10 rounded-full hover:bg-accent transition-colors"
        >
          <ShoppingBag className="size-5" />
          <span className="absolute top-1 right-0 flex size-4 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-primary-foreground shadow-sm ring-2 ring-background animate-in zoom-in-50 duration-200">
            {totalItems > 99 ? "99+" : totalItems}
          </span>
          <span className="sr-only">Open shopping cart</span>
        </Button>
      </SheetTrigger>

      <SheetContent className="flex w-full flex-col gap-0">
        <SheetHeader className="border-b">
          <SheetTitle className="flex items-center gap-2 text-xl font-semibold tracking-tight">
            <ShoppingBag className="h-5 w-5 text-primary" />
            Your Cart
          </SheetTitle>
          <SheetDescription className="text-sm text-muted-foreground leading-relaxed">
            {isEmpty
              ? "Your cart is waiting for some amazing finds."
              : "Review your items and proceed to checkout when ready."}
          </SheetDescription>
        </SheetHeader>

        {isEmpty ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-4 text-center py-12">
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-muted">
              <PackageOpen className="h-10 w-10 text-muted-foreground/60" />
            </div>
            <div className="space-y-1">
              <h3 className="text-lg font-semibold text-foreground">
                Your cart is empty
              </h3>
              <p className="text-sm text-muted-foreground max-w-60">
                Looks like you haven't added anything yet. Go find something you
                love! 🛍️
              </p>
            </div>
            <SheetClose asChild>
              <Button variant="outline" size={"xl"} className="mt-2">
                Continue Shopping
              </Button>
            </SheetClose>
          </div>
        ) : (
          <>
            <ScrollArea className="h-0 flex-1 bg-muted rounded-b-xl">
              <div className="flex flex-col p-4 gap-5">
                {cartItems.map((cartItem) => (
                  <CartItemCard key={cartItem.id} cartItem={cartItem} />
                ))}
              </div>
              <ScrollBar />
            </ScrollArea>

            {/* Summary */}
            <div className="flex items-center justify-between p-4">
              <span className="text-lg font-bold font-heading">Total</span>
              <span className="text-lg font-bold tracking-tight">
                ${formatPrice(totalPrice)}
              </span>
            </div>

            <SheetFooter className="flex flex-row gap-2 border-t px-2">
              <SheetClose asChild>
                <Button size={"xl"} variant="secondary">
                  Continue Shopping
                </Button>
              </SheetClose>
              <SheetClose asChild>
                <Button size={"xl"} className="flex-1" asChild>
                  <Link href={"/checkout"}>
                    Checkout <ArrowRight className="size-5 ml-1.5" />
                  </Link>
                </Button>
              </SheetClose>
            </SheetFooter>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
}
