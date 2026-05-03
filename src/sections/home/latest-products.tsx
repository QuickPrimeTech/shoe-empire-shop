// @/sections/home/latest-products.tsx

import { ProductCard } from "@/components/product-card";
import { Button } from "@/components/ui/button";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { SelectProduct } from "@/db/schemas";
import { ArrowUpRight } from "lucide-react";
import Link from "next/link";

export const LatestProducts = ({ products }: { products: SelectProduct[] }) => {
  return (
    <section
      id="latest-products"
      className="py-20 bg-background overflow-hidden"
    >
      <div className="container section mx-auto mb-12">
        <div className="flex justify-between items-center gap-12">
          <div>
            <p className="text-xs font-mono tracking-widest uppercase text-muted-foreground mb-3">
              Latest Products
            </p>
            <h2 className="font-display text-heading-2 md:text-heading-1 uppercase">
              Just dropped.
            </h2>
          </div>
          <Button className="hidden md:inline-flex" variant={"link"} asChild>
            <Link href={`/collection/latest-products`}>
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
              <ProductCard product={p} />
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious />
        <CarouselNext />
      </Carousel>
      {/* Mobile CTA */}
      <div className="mt-8 flex justify-center md:hidden">
        <Button size={"xl"} asChild variant="outline">
          <a href="/collection/latest-products">
            View all latest products
            <ArrowUpRight className="h-4 w-4 ml-1" />
          </a>
        </Button>
      </div>
    </section>
  );
};
