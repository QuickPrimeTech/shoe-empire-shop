// @/components/cart/wishlist-sheet.tsx
"use client";
import { PackageOpen, Heart } from "lucide-react";
import { Button } from "../ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetClose,
} from "../ui/sheet";
import { ScrollArea, ScrollBar } from "../ui/scroll-area";
import { useWishlistStore } from "@/store/wishlist";
import { WishlistCard } from "./wishlist-card";

export function WishlistSheet() {
  const removeItem = useWishlistStore((state) => state.removeItem);
  const totalItems = useWishlistStore((state) => state.getTotalItems());
  const wishlistProducts = useWishlistStore((state) => state.items);
  const isEmpty = totalItems < 1;

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          title="view wishlist"
          className="relative size-10 rounded-full hover:bg-accent transition-colors"
        >
          <Heart className="size-5" />
          <span className="absolute top-1 right-0 flex size-4 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-primary-foreground shadow-sm ring-2 ring-background animate-in zoom-in-50 duration-200">
            {totalItems > 99 ? "99+" : totalItems}
          </span>
          <span className="sr-only">Open shopping cart</span>
        </Button>
      </SheetTrigger>

      <SheetContent className="flex w-full flex-col gap-0">
        <SheetHeader className="border-b">
          <SheetTitle className="flex items-center gap-2 text-xl font-semibold tracking-tight">
            <Heart className="size-5 text-primary" />
            Your Wishlist
          </SheetTitle>
          <SheetDescription className="text-sm text-muted-foreground leading-relaxed">
            {isEmpty
              ? "Your wishlist is waiting for some amazing finds."
              : "Review your wishlist and add to cart when ready."}
          </SheetDescription>
        </SheetHeader>

        {isEmpty ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-4 text-center py-12">
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-muted">
              <PackageOpen className="h-10 w-10 text-muted-foreground/60" />
            </div>
            <div className="space-y-1">
              <h3 className="text-lg font-semibold text-foreground">
                Your Wishlist is empty
              </h3>
              <p className="text-sm text-muted-foreground max-w-60">
                Looks like you haven't added anything yet. Go find something you
                love! 🛍️
              </p>
            </div>
            <SheetClose asChild>
              <Button size={"xl"} className="mt-2">
                Continue Shopping
              </Button>
            </SheetClose>
          </div>
        ) : (
          <ScrollArea className="h-0 flex-1 bg-muted">
            <div className="flex flex-col p-4 gap-5">
              {wishlistProducts.map((product) => (
                <WishlistCard key={product.id} item={product} />
              ))}
            </div>
            <ScrollBar />
          </ScrollArea>
        )}
      </SheetContent>
    </Sheet>
  );
}
