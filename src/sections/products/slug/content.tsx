// @/sections/products/slug/content.tsx
"use client";
import { useState } from "react";
import { Separator } from "@/components/ui/separator";
import { SelectProduct } from "@/db/schemas";
import { ProductThumbnail } from "./product-thumbnail";
import { Button } from "@/components/ui/button";
import {
  ArrowRight,
  Heart,
  Minus,
  Plus,
  ShoppingBag,
  Tag,
  Timer,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { useCartStore } from "@/store/cart";
import { useWishlistStore, WishlistItem } from "@/store/wishlist";
import { formatPrice } from "@/helpers/formatters";
import { cn } from "@/lib/utils";
import { ShareButton } from "@/components/ui/share-button";
import { ProductWithOptionalOffer } from "@/types/product";
import { useCartUIStore } from "@/store/cart-ui";

interface ProductContentProps {
  product: ProductWithOptionalOffer;
}

export const ProductContent = ({ product }: ProductContentProps) => {
  const [selectedSize, setSelectedSize] = useState<
    SelectProduct["sizes"][0] | null
  >(null);
  const [quantity, setQuantity] = useState(1);
  const addItem = useCartStore((state) => state.addItem);
  const toggleWishlist = useWishlistStore((state) => state.toggleItem);
  const isInWishlist = useWishlistStore((state) =>
    state.isInWishlist(product.id),
  );

  const openCart = useCartUIStore((state) => state.setOpen);

  const hasOffer = !!product.offer;

  const originalPrice = product.price;

  let discountedPrice = originalPrice;
  let discountPercentage = 0;

  if (product.offer) {
    const { discountType, discountValue } = product.offer;

    if (discountType === "percentage") {
      discountPercentage = discountValue;
      discountedPrice = originalPrice - (originalPrice * discountValue) / 100;
    }

    if (discountType === "fixed_amount") {
      discountedPrice = originalPrice - discountValue;
      discountPercentage = Math.round((discountValue / originalPrice) * 100);
    }

    discountedPrice = Math.max(0, discountedPrice);
  }

  const savings = originalPrice - discountedPrice;

  const isOutOfStock = selectedSize ? selectedSize.stock < 1 : false;
  const isLowStock = selectedSize ? selectedSize.stock < 5 : false;

  const wishlistProduct: WishlistItem = {
    id: product.id,
    name: product.name,
    price: discountedPrice,
    image: product.images[0].url,
    size: product.sizes[0]?.size ?? "",
  };

  const addToCart = (type: "Buy" | "cart") => {
    if (!selectedSize) {
      toast.error("Please select a size", {
        description: `Select a size for ${product.name}`,
      });
      return;
    }
    addItem({
      productId: product.id,
      name: product.name,
      price: discountedPrice,
      image: product.images[0]?.url || "",
      size: selectedSize,
      quantity,
    });
    if (type === "Buy") {
      openCart(true);
    }
    toast.success("Added to cart");
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-12">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-start">
        {/* Left: Image */}
        <div className="w-full lg:sticky lg:top-24">
          <div className="relative">
            {hasOffer && (
              <div className="absolute top-4 left-4 z-20 flex flex-col gap-2">
                <Badge>
                  <Tag className="size-3.5 mr-1" />
                  {discountPercentage}% OFF
                </Badge>
                {product.offer?.endDate && (
                  <Badge variant="secondary" className="px-3 py-1 text-xs">
                    <Timer className="w-3 h-3 mr-1" />
                    Limited time
                  </Badge>
                )}
              </div>
            )}
            <div className="relative">
              <ProductThumbnail images={product.images} />
              <Button
                size="icon-lg"
                variant="outline"
                className="group absolute top-2 right-4"
                onClick={() => toggleWishlist(wishlistProduct)}
                aria-label={`${isInWishlist ? "Remove from" : "Add to"} wishlist`}
                title={`${isInWishlist ? "Remove from" : "Add to"} wishlist`}
              >
                <Heart
                  className={cn(
                    "size-5",
                    isInWishlist && "fill-red-500 text-red-500",
                  )}
                />
              </Button>
            </div>
          </div>
        </div>

        {/* Right: Content */}
        <div className="flex flex-col gap-6 md:gap-8">
          {/* Header */}
          <div className="space-y-3">
            <div className="flex items-center justify-between flex-wrap gap-6">
              {product.brand && (
                <span className="text-xs font-semibold tracking-widest uppercase text-muted-foreground">
                  {product.brand}
                </span>
              )}
              <ShareButton
                variant="ghost"
                shareData={{
                  title: product.name,
                  text: `Check out this ${hasOffer ? `discounted ` : ""}product: ${product.description}`,
                  url: `${process.env.NEXT_PUBLIC_SITE_URL}/products/${product.slug}`,
                }}
                onShareSuccess={() => {
                  toast.success("Product shared successfully!");
                }}
                type="button"
                onShareError={(error) => {
                  if (error.name !== "AbortError") {
                    toast.error("Failed to share product");
                  }
                }}
                onCopyFallback={() => {
                  toast.success("Product link copied to clipboard!");
                }}
              />
            </div>
            <h1 className="text-heading-2 font-bold tracking-tight leading-[1.1] text-foreground">
              {product.name}
            </h1>

            <div className="flex flex-col pt-1 gap-4">
              <div className="flex flex-wrap items-baseline gap-3">
                {hasOffer ? (
                  <>
                    <span className="text-2xl md:text-3xl font-bold text-destructive">
                      Ksh {formatPrice(discountedPrice)}
                    </span>
                    <span className="text-lg text-muted-foreground line-through decoration-destructive/50">
                      Ksh {formatPrice(product.price)}
                    </span>
                    <Badge
                      variant="outline"
                      className="text-destructive border-destructive/30"
                    >
                      Save Ksh {formatPrice(savings)}
                    </Badge>
                  </>
                ) : (
                  <span className="text-2xl md:text-3xl font-bold text-foreground">
                    Ksh {formatPrice(product.price)}
                  </span>
                )}
              </div>

              <div className="flex items-center gap-2">
                {isOutOfStock ? (
                  <Badge variant="destructive">Out of Stock</Badge>
                ) : isLowStock ? (
                  <Badge variant="secondary">
                    Only {selectedSize?.stock} left
                  </Badge>
                ) : (
                  <Badge variant="success">In Stock</Badge>
                )}
              </div>
            </div>
          </div>

          {/* Offer Banner */}
          {hasOffer && (
            <div className="rounded-xl bg-destructive/10 border border-destructive/20 p-4 space-y-2">
              <div className="flex items-center gap-2 text-destructive font-semibold">
                <Tag className="w-4 h-4" />
                <span>Special Offer</span>
              </div>
              <p className="text-sm text-muted-foreground">
                {product.offer?.description ||
                  `Get ${discountPercentage}% off this item. Discount applied at checkout.`}
              </p>
              {product.offer?.endDate && (
                <p className="text-xs text-destructive font-medium">
                  Offer ends{" "}
                  {new Date(product.offer.endDate).toLocaleDateString()}
                </p>
              )}
            </div>
          )}

          {/* Description */}
          {product.description && (
            <p className="text-muted-foreground leading-relaxed text-base md:text-lg">
              {product.description}
            </p>
          )}

          <Separator />

          <div className="space-y-4">
            {/* Sizes */}
            {product.sizes?.length > 0 && (
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <p className="font-medium">
                    Size{" "}
                    <span className="text-muted-foreground">
                      (
                      {selectedSize
                        ? `EU ${selectedSize.size}`
                        : "Select a size"}
                      )
                    </span>
                  </p>
                </div>

                <div className="flex w-full flex-wrap gap-2">
                  {product.sizes.map((size) => (
                    <Button
                      key={size.size}
                      size="sm"
                      onClick={() => setSelectedSize(size)}
                      className="w-24"
                      variant={
                        selectedSize?.size === size.size ? "default" : "outline"
                      }
                      disabled={size.stock < 1}
                    >
                      {size.size}
                      {size.stock < 1 && (
                        <span className="sr-only">Out of stock</span>
                      )}
                    </Button>
                  ))}
                </div>
              </div>
            )}

            <div className="flex flex-col justify-center gap-2">
              <span className="text-sm font-medium">Quantity</span>
              <div className="flex items-center border w-fit rounded-lg overflow-hidden">
                <Button
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  disabled={quantity <= 1}
                  className="rounded-none"
                  variant="ghost"
                  aria-label={`Decrease quantity to ${quantity - 1}`}
                >
                  <Minus className="w-4 h-4" />
                </Button>

                <span className="w-12 h-full flex items-center justify-center text-sm font-semibold border-x tabular-nums">
                  {quantity}
                </span>

                <Button
                  className="rounded-none"
                  variant="ghost"
                  aria-label={`Increase quantity to ${quantity + 1}`}
                  onClick={() => setQuantity((q) => q + 1)}
                >
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>

          {/* CTA */}
          <div className="flex flex-col gap-3 mt-5">
            <Button
              size="xl"
              disabled={isOutOfStock}
              onClick={() => {
                addToCart("Buy");
              }}
              className={cn(
                hasOffer && "bg-destructive hover:bg-destructive/90",
              )}
            >
              {isOutOfStock ? "Out of Stock" : "Buy Now"}
              <ArrowRight className="size-5 ml-1.5" />
            </Button>
            <Button
              size="xl"
              variant={"secondary"}
              disabled={isOutOfStock}
              onClick={() => addToCart("cart")}
            >
              {isOutOfStock ? "Out of Stock" : "Add to Cart"}
              <ShoppingBag className="size-5 ml-1.5" />
            </Button>
          </div>

          {/* Trust badges */}
          <div className="grid grid-cols-3 gap-3 pt-2">
            {[
              { icon: "🚚", label: "Fast Delivery" },
              { icon: "↩️", label: "Easy Returns" },
              { icon: "🔒", label: "Secure Payment" },
            ].map((item) => (
              <div
                key={item.label}
                className="flex flex-col items-center gap-1.5 rounded-xl bg-muted py-3 px-2 text-center"
              >
                <span className="text-xl">{item.icon}</span>
                <span className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wide">
                  {item.label}
                </span>
              </div>
            ))}
          </div>

          {/* Meta */}
          <div className="rounded-2xl bg-muted p-5 space-y-3 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">SKU</span>
              <span className="font-mono font-medium">
                {product.slug.toUpperCase()}
              </span>
            </div>

            {product.brand && (
              <div className="flex justify-between">
                <span className="text-muted-foreground">Brand</span>
                <span className="font-medium">{product.brand}</span>
              </div>
            )}

            {selectedSize && (
              <div className="flex justify-between">
                <span className="text-muted-foreground">Availability</span>
                <span className="font-medium">
                  {isOutOfStock
                    ? "Unavailable"
                    : `${selectedSize.stock} in stock`}
                </span>
              </div>
            )}

            {hasOffer && (
              <div className="flex justify-between">
                <span className="text-muted-foreground">Discount</span>
                <span className="font-medium text-destructive">
                  {discountPercentage}% off
                </span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
