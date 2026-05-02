"use client";
import * as React from "react";
import { createPortal } from "react-dom";
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
import { Image } from "@/components/ui/image";
import { X, ZoomIn } from "lucide-react";
import { Button } from "@/components/ui/button";

/* -------------------------------------------------------------------------- */
/*                               Zoomable Slide                               */
/* -------------------------------------------------------------------------- */

interface ZoomableSlideProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
}

function ZoomableSlide({ children, className, onClick }: ZoomableSlideProps) {
  const [isZooming, setIsZooming] = React.useState(false);
  const [origin, setOrigin] = React.useState({ x: 50, y: 50 });
  const containerRef = React.useRef<HTMLDivElement>(null);
  const mouseDownPos = React.useRef({ x: 0, y: 0 });

  const handleMouseMove = React.useCallback((e: React.MouseEvent) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setOrigin({ x, y });
  }, []);

  const handleMouseDown = (e: React.MouseEvent) => {
    mouseDownPos.current = { x: e.clientX, y: e.clientY };
  };

  const handleClick = (e: React.MouseEvent) => {
    const dx = Math.abs(e.clientX - mouseDownPos.current.x);
    const dy = Math.abs(e.clientY - mouseDownPos.current.y);
    // Only trigger lightbox on clean clicks, not drags
    if (dx < 5 && dy < 5) onClick?.();
  };

  return (
    <div
      ref={containerRef}
      className={cn(
        "relative w-full h-full overflow-hidden cursor-zoom-in",
        className,
      )}
      onMouseEnter={() => setIsZooming(true)}
      onMouseMove={handleMouseMove}
      onMouseLeave={() => setIsZooming(false)}
      onMouseDown={handleMouseDown}
      onClick={handleClick}
    >
      <div
        className="w-full h-full transition-transform duration-200 ease-out will-change-transform"
        style={{
          transform: isZooming ? "scale(2.5)" : "scale(1)",
          transformOrigin: `${origin.x}% ${origin.y}%`,
        }}
      >
        {children}
      </div>

      {/* Zoom hint */}
      <div
        className={cn(
          "absolute top-3 right-3 pointer-events-none rounded-full bg-card/80 backdrop-blur-sm p-2 shadow-sm transition-opacity duration-200",
          isZooming ? "opacity-0" : "opacity-100",
        )}
      >
        <ZoomIn className="size-4" />
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*                                  Lightbox                                  */
/* -------------------------------------------------------------------------- */

interface LightboxProps {
  images: SelectProduct["images"];
  initialIndex: number;
  isOpen: boolean;
  onClose: () => void;
}

function Lightbox({ images, initialIndex, isOpen, onClose }: LightboxProps) {
  const [api, setApi] = React.useState<CarouselApi>();
  const [mounted, setMounted] = React.useState(false);
  const [lightboxCurrent, setLightboxCurrent] = React.useState(initialIndex);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  // Scroll to initial index when api is ready
  React.useEffect(() => {
    if (isOpen && api) {
      api.scrollTo(initialIndex);
    }
  }, [isOpen, api, initialIndex]);

  // Track lightbox index
  React.useEffect(() => {
    if (!api) return;
    setLightboxCurrent(api.selectedScrollSnap());
    api.on("select", () => setLightboxCurrent(api.selectedScrollSnap()));
  }, [api]);

  // Keyboard + scroll lock
  React.useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleKeyDown);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [isOpen, onClose]);

  if (!mounted || !images?.length) return null;

  return createPortal(
    <div
      className={cn(
        "fixed inset-0 z-50 flex flex-col items-center justify-center bg-background/50 backdrop-blur-sm transition-opacity duration-300",
        isOpen
          ? "opacity-100 pointer-events-auto"
          : "opacity-0 pointer-events-none",
      )}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      role="dialog"
      aria-modal="true"
      aria-hidden={!isOpen}
    >
      {/* Close */}
      <Button
        onClick={onClose}
        variant={"outline"}
        size={"icon-lg"}
        className="absolute top-4 right-4 z-50"
        aria-label="Close full view"
      >
        <X />
      </Button>

      {/* Main image carousel */}
      <div className="w-full max-w-6xl px-4 md:px-16">
        <Carousel
          className="w-full"
          setApi={setApi}
          opts={{ startIndex: initialIndex }}
        >
          <CarouselContent showDefaultItem={false}>
            {images.map((image) => (
              <CarouselItem
                key={image.url}
                className="relative aspect-4/3 w-full"
              >
                <Image
                  className="rounded-md object-contain"
                  src={image.url}
                  alt={image.altText}
                  fill
                  sizes="100vw"
                  priority
                />
              </CarouselItem>
            ))}
          </CarouselContent>

          <CarouselPrevious
            className="left-2 md:left-4 bg-white/10 border-none text-white hover:bg-white/20 hover:text-white size-10"
            aria-label="Previous image"
          />
          <CarouselNext
            className="right-2 md:right-4 bg-white/10 border-none text-white hover:bg-white/20 hover:text-white size-10"
            aria-label="Next image"
          />
        </Carousel>

        {/* Lightbox thumbnails */}
        {images.length > 1 && (
          <div className="mt-6 flex justify-center gap-2.5 overflow-auto px-4 pb-2">
            {images.map((image, idx) => (
              <button
                key={image.url}
                onClick={() => api?.scrollTo(idx)}
                className={cn(
                  "relative aspect-square w-14 md:w-16 shrink-0 overflow-hidden rounded-md border-2 transition-all",
                  lightboxCurrent === idx
                    ? "border-white opacity-100 scale-105"
                    : "border-transparent opacity-50 hover:opacity-80",
                )}
                aria-label={`Go to image ${idx + 1}`}
              >
                <Image
                  className="object-cover"
                  src={image.url}
                  alt={image.altText}
                  fill
                  sizes="64px"
                />
              </button>
            ))}
          </div>
        )}
      </div>
    </div>,
    document.body,
  );
}

/* -------------------------------------------------------------------------- */
/*                             Product Thumbnail                              */
/* -------------------------------------------------------------------------- */

export const ProductThumbnail = ({
  images,
}: {
  images: SelectProduct["images"];
}) => {
  const [api, setApi] = React.useState<CarouselApi>();
  const [current, setCurrent] = React.useState(0);
  const [lightboxOpen, setLightboxOpen] = React.useState(false);

  React.useEffect(() => {
    if (!api) return;
    setCurrent(api.selectedScrollSnap());
    api.on("select", () => {
      setCurrent(api.selectedScrollSnap());
    });
  }, [api]);

  const handleThumbClick = React.useCallback(
    (index: number) => {
      api?.scrollTo(index);
    },
    [api],
  );

  if (!images || images.length === 0) {
    return (
      <div className="relative aspect-4/3 w-full rounded-xl bg-muted flex items-center justify-center">
        <span className="text-muted-foreground text-sm">
          No images available
        </span>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl">
      {/* Main Image Carousel */}
      <Carousel className="w-full" setApi={setApi}>
        <CarouselContent showDefaultItem={false}>
          {images.map((image) => (
            <CarouselItem
              className="relative basis-full aspect-4/3"
              key={image.url}
            >
              <ZoomableSlide
                className="absolute inset-0 rounded-xl overflow-hidden"
                onClick={() => setLightboxOpen(true)}
              >
                <Image
                  className="object-cover"
                  src={image.url}
                  alt={image.altText}
                  fill
                  sizes="(max-width: 780px) 100vw, 33vw"
                />
              </ZoomableSlide>
            </CarouselItem>
          ))}
        </CarouselContent>

        {images.length > 1 && (
          <>
            <CarouselPrevious
              size={"icon"}
              className="left-3 top-1/2 -translate-y-1/2 "
              aria-label="Previous image"
              title="Previous image"
            />
            <CarouselNext
              size={"icon"}
              className="right-3 top-1/2 -translate-y-1/2"
              aria-label="Next image"
              title="Next image"
            />
          </>
        )}
      </Carousel>

      {/* Thumbnail Strip */}
      {images.length > 1 && (
        <Carousel
          className="mt-4 w-full"
          opts={{ align: "start", dragFree: true }}
        >
          <div className="mask-x-from-90%">
            <CarouselContent
              className="my-1 flex -ml-2"
              showDefaultItem={false}
            >
              {images.map((image, index) => (
                <CarouselItem
                  key={image.url}
                  className="basis-1/4 pl-2"
                  onClick={() => handleThumbClick(index)}
                >
                  <button
                    type="button"
                    className={cn(
                      "relative aspect-4/3 w-full overflow-hidden rounded-xl transition-all",
                      current === index
                        ? "ring-2 ring-gray-900 opacity-100"
                        : "opacity-50 hover:opacity-80",
                    )}
                    aria-label={`View image ${index + 1}`}
                  >
                    <Image
                      className="object-cover"
                      src={image.url}
                      alt={image.altText}
                      fill
                      sizes="20vw"
                    />
                  </button>
                </CarouselItem>
              ))}
            </CarouselContent>
          </div>
        </Carousel>
      )}

      {/* Full View Lightbox */}
      <Lightbox
        images={images}
        initialIndex={current}
        isOpen={lightboxOpen}
        onClose={() => setLightboxOpen(false)}
      />
    </div>
  );
};
