// @/products/slug/similar-products.tsx

import { ProductCard } from "@/components/product-card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { getSimilarProducts } from "@/db/functions/product";
import { cacheLife } from "next/cache";

const getSimilarProductsCached = async (slug: string) => {
  "use cache";
  cacheLife({
    revalidate: 6 * 3600,
    stale: 6 * 3600,
    expire: 6 * 3600,
  });
  const results = await getSimilarProducts(slug);

  return results;
};

export const SimilarProducts = async ({ slug }: { slug: string }) => {
  const similarProducts = await getSimilarProductsCached(slug);

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
          {similarProducts.map((similarProduct) => (
            <CarouselItem
              key={similarProduct.id}
              className="basis-7/10 sm:basis-1/2 md:basis-1/3 lg:basis-1/4"
            >
              <ProductCard
                product={similarProduct}
                offer={similarProduct.offer ?? undefined}
                variant="discount"
                showThumbnails={false}
              />
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious />
        <CarouselNext />
      </Carousel>
    </section>
  );
};
