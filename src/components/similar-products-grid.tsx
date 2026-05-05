// @/components/simiar-products-skeleton.tsx
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { ProductCardSkeleton } from "./product-card-skeleton";

export const SimilarProductsSkeleton = async () => {
  return (
    <section id="similar-products" className="mb-16">
      <div className="container mx-auto section-small mb-6">
        <p className="text-xs font-mono tracking-widest uppercase text-muted-foreground mb-2">
          Similar Products
        </p>
        <h2 className="font-display text-xl font-bold md:text-heading-2 uppercase">
          You may also like.
        </h2>
      </div>
      <Carousel>
        <CarouselContent showDefaultItem={true}>
          {Array.from({ length: 8 }).map((_, index) => (
            <CarouselItem
              key={index}
              className="basis-7/10 sm:basis-1/2 md:basis-1/3 lg:basis-1/4"
            >
              <ProductCardSkeleton />
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious />
        <CarouselNext />
      </Carousel>
    </section>
  );
};
