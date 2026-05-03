import { ProductCard } from "@/components/product-card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { SelectProduct } from "@/db/schemas";

export const FeaturedCarousel = ({
  products,
}: {
  products: SelectProduct[];
}) => {
  return (
    <section className="py-20 bg-background overflow-hidden">
      <div className="container mx-auto px-6 md:px-12 mb-12">
        <p className="text-xs font-mono tracking-widest uppercase text-muted-foreground mb-3">
          Featured
        </p>
        <h2 className="font-display text-heading-2 md:text-heading-1 uppercase">
          Just dropped.
        </h2>
      </div>

      {/* GRID instead of outer carousel */}
      <Carousel>
        <CarouselContent showDefaultItem={true}>
          {products.map((p) => (
            <CarouselItem
              key={p.id}
              className="basis-7/10 sm:basis-1/2 md:basis-1/3 lg:basis-1/4"
            >
              <ProductCard key={p.id} product={p} />
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious />
        <CarouselNext />
      </Carousel>
    </section>
  );
};
