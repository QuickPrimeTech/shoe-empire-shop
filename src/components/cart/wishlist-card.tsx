// @/components/cart/wishlist-card.tsx
"use client";
import Link from "next/link";
import { ShoppingBag, Trash2, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Image } from "@/components/ui/image";
import { cn } from "@/lib/utils";
import { WishlistItem, useWishlistStore } from "@/store/wishlist";
import { useCartStore } from "@/store/cart";
import { useState } from "react";

type WishlistCardProps = {
  item: WishlistItem;
};

export const WishlistCard = ({ item }: WishlistCardProps) => {
  const [isRemoving, setIsRemoving] = useState(false);
  const removeItem = useWishlistStore((state) => state.removeItem);
  const addToCart = useCartStore((state) => state.addItem);

  const handleRemove = () => {
    setIsRemoving(true);
    // Small delay for exit animation feel
    setTimeout(() => removeItem(item.id), 200);
  };

  const handleMoveToCart = () => {
    addToCart({
      productId: item.id,
      name: item.name,
      price: item.price,
      image: item.image,
      size: item.size
        ? { size: item.size, stock: 10 } // Replace with real stock lookup
        : { size: "Default", stock: 10 },
      quantity: 1,
    });
    removeItem(item.id);
  };

  const href = `/products/${item.id}`;

  return (
    <div
      className={cn(
        "group relative flex gap-4 rounded-xl border bg-card p-3 transition-all duration-200",
        "hover:shadow-md hover:border-primary/20",
        isRemoving && "opacity-0 scale-95 translate-x-4",
      )}
    >
      {/* Product Image */}
      <Link
        href={href}
        className="relative aspect-square size-28 sm:size-32 shrink-0 overflow-hidden rounded-lg border bg-muted"
      >
        <Image
          src={item.image}
          alt={item.name}
          fill
          sizes="128px"
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />
      </Link>

      {/* Content */}
      <div className="flex flex-1 flex-col justify-between py-0.5 min-w-0">
        <div className="space-y-1">
          {/* Header: Name + Remove */}
          <div className="flex items-start justify-between gap-3">
            <Link href={href} className="min-w-0">
              <h3 className="text-sm font-medium leading-snug text-foreground line-clamp-2 transition-colors">
                {item.name}
              </h3>
            </Link>
            <Button
              variant="destructive"
              size="icon-sm"
              className="size-8"
              onClick={handleRemove}
            >
              <Trash2 className="h-4 w-4" />
              <span className="sr-only">Remove from wishlist</span>
            </Button>
          </div>

          {/* Meta info */}
          <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
            {item.size && (
              <span className="inline-flex items-center rounded-md bg-secondary px-2 py-0.5 font-medium text-secondary-foreground">
                Size: {item.size}
              </span>
            )}
            <span className="flex items-center gap-1 text-emerald-500">
              <AlertCircle className="size-3" />
              In Stock
            </span>
          </div>
        </div>

        {/* Footer: Price + Actions */}
        <div className="flex flex-col gap-4 pt-2">
          <div className="space-y-0.5">
            <p className="text-base font-bold tabular-nums text-foreground">
              Ksh {item.price.toLocaleString()}
            </p>
          </div>
          <Button variant="outline" size="sm" onClick={handleMoveToCart}>
            <ShoppingBag className="size-3.5 mr-1.5" />
            Move to Cart
          </Button>
        </div>
      </div>
    </div>
  );
};
