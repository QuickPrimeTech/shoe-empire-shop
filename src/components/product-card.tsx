// @/components/product-card.tsx
"use client";
import Link from "next/link";
import { Image } from "./ui/image";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "./ui/carousel";
import { useState } from "react";
import { Button } from "./ui/button";
import { Heart, Plus } from "lucide-react";
import { SelectProduct } from "@/db/schemas";
import { cn } from "@/lib/utils";
import { useWishlistStore } from "@/store/wishlist";

export const ProductCard = ({ product }: { product: SelectProduct }) => {
  const [productImage, setProductImage] = useState(product?.images[0]);
  const toggleItem = useWishlistStore((state) => state.toggleItem);
  const isActive = useWishlistStore((state) =>
    state.items.some((i) => i.id === product.id),
  );

  const wishlistProduct = {
    id: product.id,
    name: product.name,
    price: product.price,
    image: product.images[0].url,
    size: product.sizes[0].size,
  };

  const price = product.price;

  const href = `/products/${product.slug}`;
  return (
    <div className="group relative block border bg-card h-full rounded-md">
      <Button
        size="icon"
        variant="secondary"
        className={cn(
          "absolute top-3 right-3 z-20 h-9 w-9 rounded-full border bg-background/90 backdrop-blur-sm",
          "transition-all duration-300 ease-out",
          "hover:scale-110 hover:bg-background",
          "active:scale-90",
          isActive && "border-red-200 bg-red-50 text-red-500",
        )}
        onClick={(e) => {
          toggleItem(wishlistProduct);
        }}
      >
        <Heart
          className={cn(
            "h-4 w-4 transition-all duration-300 ease-out",
            isActive && "fill-red-500 text-red-500 scale-110",
          )}
        />
        <span className="sr-only">
          {isActive ? "Remove from wishlist" : "Add to wishlist"}
        </span>
      </Button>

      {/* IMAGE CAROUSEL */}
      <div className="relative">
        <Link href={href} className="group block">
          <div className="relative w-full aspect-10/8 overflow-hidden border rounded-md">
            <Image
              src={productImage?.url}
              alt={productImage?.altText ?? product.name}
              fill
              sizes="(max-width: 640px) 100vw, (max-width: 780px) 33vw, 25vw"
              className="object-cover group-focus-within:scale-110 group-hover:scale-110 transition"
            />
          </div>
        </Link>
        <Carousel className="px-2 mt-1">
          <CarouselContent
            showDefaultItem={false}
            className="gap-1 justify-center"
          >
            {product?.images.map((image) => (
              <CarouselItem
                key={image.url}
                className={cn(
                  "relative basis-1/4 shadow-sm opacity-50 border pl-0 aspect-3/2 overflow-hidden transition rounded-md",
                  productImage.url === image.url && "opacity-100",
                )}
                onClick={() => setProductImage(() => image)}
              >
                <Image
                  src={image.url}
                  alt={image.altText ?? product.name}
                  fill
                  sizes="(max-width: 640px) 25vw,(max-width: 780px) 10vw,5vw"
                  className="object-cover hover:scale-110 transition"
                />
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious
            size={"icon-xs"}
            className="absolute hidden disabled:opacity-0 lg:inline-flex left-0 top-1/2 -translate-y-1/2"
          />
          <CarouselNext
            size={"icon-xs"}
            className="absolute disabled:opacity-0 hidden lg:inline-flex right-0 top-1/2 -translate-y-1/2"
          />
        </Carousel>
      </div>
      <Link href={href} className="group block p-2">
        <div className="pt-4 mb-1 flex flex-col sm:flex-row gap-2 justify-between items-start">
          <div className="space-y-1">
            <h3 className="font-medium leading-tight">{product.name}</h3>
            {/* optional brand */}
            <p className="text-xs text-muted-foreground">{product.brand}</p>
          </div>

          {/* PRICE */}
          <p className="font-medium font-heading">Ksh {price ?? "—"}</p>
        </div>
        <div className="flex justify-end">
          <Button size={"icon"} className="">
            <Plus />
          </Button>
        </div>
      </Link>
    </div>
  );
};
