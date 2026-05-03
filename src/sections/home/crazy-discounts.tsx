// @/sections/home/crazy-discounts.tsx
import { Button } from "@/components/ui/button";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { ArrowUpRight } from "lucide-react";
import Link from "next/link";
import { ProductCard } from "@/components/product-card";
import { ProductWithOffer } from "@/types/product";

export const CrazyDiscounts = ({ offers }: { offers: ProductWithOffer[] }) => {
  return (
    <section
      id="crazy-discounts"
      className="py-20 bg-background overflow-hidden"
    >
      <div className="container section mx-auto mb-12">
        <div className="flex justify-between items-center gap-12">
          <div>
            <p className="text-xs font-mono tracking-widest uppercase text-muted-foreground mb-3">
              Grab yours now
            </p>
            <h2 className="font-display text-heading-2 md:text-heading-1 uppercase">
              Crazy Discounts.
            </h2>
          </div>
          <Button className="hidden md:inline-flex" variant="link" asChild>
            <Link href="/collection/crazy-discounts">
              View All <ArrowUpRight className="ml-1 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </div>

      {/* Carousel matching LatestProducts structure */}
      <Carousel>
        <CarouselContent showDefaultItem={true}>
          {offers.map((offer) => (
            <CarouselItem
              key={offer.id}
              className="basis-7/10 sm:basis-1/2 md:basis-1/3 lg:basis-1/4"
            >
              <ProductCard
                product={offer}
                offer={offer.offer}
                variant="discount"
                showThumbnails={false}
              />
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious />
        <CarouselNext />
      </Carousel>

      {/* Mobile CTA */}
      <div className="mt-8 flex justify-center md:hidden">
        <Button size="xl" asChild variant="outline">
          <Link href="/collection/crazy-discounts">
            View all discounts
            <ArrowUpRight className="h-4 w-4 ml-1" />
          </Link>
        </Button>
      </div>
    </section>
  );
};
