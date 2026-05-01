// @/sections/products/slug/product-thumbnail.tsx

"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import {
  Carousel,
  type CarouselApi,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { SelectProduct } from "@/db/schemas";

const images = [
  "https://www.fffuel.co/images/dddepth-preview/dddepth-248.jpg",
  "https://www.fffuel.co/images/dddepth-preview/dddepth-051.jpg",
  "https://www.fffuel.co/images/dddepth-preview/dddepth-029.jpg",
  "https://www.fffuel.co/images/dddepth-preview/dddepth-038.jpg",
  "https://www.fffuel.co/images/dddepth-preview/dddepth-012.jpg",
];

export const ProductThumbnail = ({ product }: { product: SelectProduct }) => {
  const [api, setApi] = React.useState<CarouselApi>();
  const [current, setCurrent] = React.useState(0);

  React.useEffect(() => {
    if (!api) {
      return;
    }

    setCurrent(api.selectedScrollSnap() + 1);

    api.on("select", () => {
      setCurrent(api.selectedScrollSnap() + 1);
    });
  }, [api]);

  const handleThumbClick = React.useCallback(
    (index: number) => {
      api?.scrollTo(index);
    },
    [api],
  );

  return (
    <div className="mx-auto section max-w-2xl bg-red-500">
      <Carousel className="w-full" setApi={setApi}>
        <CarouselContent showDefaultItem={false}>
          {product.images?.map((image) => (
            <CarouselItem className="basis-full" key={image.url}>
              <img
                alt="dddepth-248"
                className="size-full rounded-xl object-cover"
                src={image.url}
              />
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>

      <Carousel className="mt-4 w-full">
        <div className="mask-x-from-90%">
          <CarouselContent className="my-1 flex">
            {product.images?.map((image, index) => (
              <CarouselItem
                className={cn(
                  "basis-1/4 cursor-pointer transition-opacity",
                  current === index + 1 ? "opacity-100" : "opacity-50",
                )}
                key={image.url}
                onClick={() => handleThumbClick(index)}
              >
                <img
                  alt="dddepth-248"
                  className="size-full rounded-xl object-cover"
                  src={image.url}
                />
              </CarouselItem>
            ))}
          </CarouselContent>
        </div>
        <CarouselPrevious />
        <CarouselNext />
      </Carousel>
    </div>
  );
};
