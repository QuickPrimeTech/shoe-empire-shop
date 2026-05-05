// @/sections/home/limited-products.tsx
import { ProductCard } from "@/components/product-card";
import { Button } from "@/components/ui/button";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { LimitedProduct } from "@/types/product";
import { ArrowUpRight } from "lucide-react";
import Link from "next/link";

export const LimitedProducts = ({
  products,
}: {
  products: LimitedProduct[];
}) => {
  const href = `/products?limited=true`;
  return (
    <section
      id="limited-products"
      className="py-20 bg-background overflow-hidden"
    >
      <div className="container section mx-auto mb-12">
        <div className="flex justify-between items-center gap-12">
          <div>
            <p className="text-xs font-mono tracking-widest uppercase text-muted-foreground mb-3">
              Soon out of stock
            </p>
            <h2 className="font-display text-heading-2 md:text-heading-1 uppercase">
              Limited Products.
            </h2>
          </div>
          <Button className="hidden md:inline-flex" variant={"link"} asChild>
            <Link href={href}>
              View All <ArrowUpRight />
            </Link>
          </Button>
        </div>
      </div>

      {/* GRID instead of outer carousel */}
      <Carousel>
        <CarouselContent showDefaultItem={true}>
          {products.map((p) => (
            <CarouselItem
              key={p.id}
              className="basis-7/10 sm:basis-1/2 md:basis-1/3 lg:basis-1/4"
            >
              <ProductCard
                product={p}
                showThumbnails={false}
                offer={p.offer ?? undefined}
                stock={p.totalStock}
              />
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious />
        <CarouselNext />
      </Carousel>
      {/* Mobile CTA */}
      <div className="mt-8 flex justify-center md:hidden">
        <Button size={"xl"} asChild variant="outline">
          <Link href={href}>
            View all limited products
            <ArrowUpRight className="h-4 w-4 ml-1" />
          </Link>
        </Button>
      </div>
    </section>
  );
};
