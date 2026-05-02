// @/sections/products/slug/content.tsx
"use client";
import { useState } from "react";
import { Separator } from "@/components/ui/separator";
import { SelectProduct } from "@/db/schemas";
import { ProductThumbnail } from "./product-thumbnail";
import { Button } from "@/components/ui/button";
import { Heart, Minus, Plus, ShoppingBag } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { useCartStore } from "@/store/cart";

interface ProductContentProps {
  product: SelectProduct;
}

export const ProductContent = ({ product }: ProductContentProps) => {
  const [selectedSize, setSelectedSize] = useState<
    SelectProduct["sizes"][0] | null
  >(null);
  const [quantity, setQuantity] = useState(1);
  const addItem = useCartStore((state) => state.addItem);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-KE", {
      style: "currency",
      currency: "KES",
      minimumFractionDigits: 0,
    }).format(price);
  };

  const isOutOfStock = selectedSize ? parseInt(selectedSize.size) < 1 : false;
  const isLowStock = selectedSize ? parseInt(selectedSize.size) < 5 : false;

  const addToCart = () => {
    if (!selectedSize) {
      toast.error(`Please select a size`, {
        description: `Please select a size for ${product.name}`,
      });
      return;
    }
    //Add the item to cart
    addItem({
      productId: product.id,
      name: product.name,
      price: product.price,
      image: product.images[0]?.url || "",
      size: selectedSize,
      quantity,
    });

    toast.success("Added to cart");
  };

  const addToWishlist = () => {};

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-12">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-start">
        {/* Left: Image */}
        <div className="w-full lg:sticky lg:top-24">
          <ProductThumbnail images={product.images} />
        </div>

        {/* Right: Content */}
        <div className="flex flex-col gap-6 md:gap-8">
          {/* Header */}
          <div className="space-y-3">
            {product.brand && (
              <span className="text-xs font-semibold tracking-widest uppercase text-muted-foreground">
                {product.brand}
              </span>
            )}

            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight leading-[1.1] text-foreground">
              {product.name}
            </h1>

            <div className="flex items-center gap-3 pt-1">
              <span className="text-2xl md:text-3xl font-bold text-foreground">
                {formatPrice(product.price)}
              </span>

              {isOutOfStock ? (
                <Badge variant="destructive">Out of Stock</Badge>
              ) : isLowStock ? (
                <Badge variant="secondary">
                  Only {selectedSize?.stock} left
                </Badge>
              ) : (
                <Badge variant={"success"}>In Stock</Badge>
              )}
            </div>
          </div>

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
                      size={"sm"}
                      onClick={() => setSelectedSize(size)}
                      className="w-24"
                      variant={
                        selectedSize?.size === size.size ? "default" : "outline"
                      }
                    >
                      {size.size}
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
                  variant={"ghost"}
                  aria-label={`Decrease quantity to ${quantity - 1}`}
                  title={`Decrease quantity to ${quantity - 1}`}
                >
                  <Minus />
                </Button>

                <span className="w-12 h-full flex items-center justify-center text-sm font-semibold border-x tabular-nums">
                  {quantity}
                </span>

                <Button
                  className="rounded-none"
                  variant={"ghost"}
                  aria-label={`Decrease quantity to ${quantity + 1}`}
                  title={`Increase quantity to ${quantity + 1}`}
                  onClick={() => setQuantity((q) => q + 1)}
                >
                  <Plus />
                </Button>
              </div>
            </div>
          </div>

          {/* CTA */}
          <div className="flex flex-col gap-3 mt-5">
            <Button size="xl" disabled={isOutOfStock} onClick={addToCart}>
              {isOutOfStock ? "Out of Stock" : "Add to Cart"}{" "}
              <ShoppingBag className="size-5 ml-1.5" />
            </Button>

            <Button size="xl" variant="outline" disabled={isOutOfStock}>
              Add to Wishlist <Heart className="size-5 ml-1.5" />
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
                    : `${selectedSize?.stock} in stock`}
                </span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
