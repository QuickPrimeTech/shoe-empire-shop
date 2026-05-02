import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { SelectProduct } from "@/db/schemas";
import { Image } from "@/components/ui/image";
import Link from "next/link";

export const FeaturedCarousel = ({
  products,
}: {
  products: SelectProduct[];
}) => {
  return (
    <section className="py-20 bg-background overflow-hidden">
      {/* Header Area */}
      <div className="container mx-auto px-6 md:px-12 mb-12 flex items-end justify-between">
        <div>
          <p className="text-xs font-mono tracking-widest uppercase text-muted-foreground mb-3">
            Featured
          </p>
          <h2 className="font-display text-heading-2 md:text-heading-1 uppercase">
            Just dropped.
          </h2>
        </div>
      </div>
      <div className="container mx-auto">
        <Carousel>
          <CarouselContent>
            {products.map((p) => (
              <CarouselItem key={p.id} className="basis-1/2 md:basis-1/4">
                <Link href={`/products/${p.slug}`}>
                  <div className="relative aspect-square bg-muted rounded-xl overflow-hidden group">
                    <Image
                      src={null}
                      alt={p.name}
                      fill
                      className="object-cover transition-transform group-hover:scale-105"
                    />
                  </div>
                  <div className="py-4 flex justify-between">
                    <h3 className="font-medium">{p.name}</h3>
                    {/* <p className="font-medium">Ksh {p.price}</p> */}
                  </div>
                </Link>
              </CarouselItem>
            ))}
            {/* Nike spacer */}
          </CarouselContent>
          <CarouselPrevious />
          <CarouselNext />
        </Carousel>
      </div>
    </section>
  );
};
