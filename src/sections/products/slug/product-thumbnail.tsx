"use client";

import * as React from "react";
import { Dialog, DialogContent, DialogClose } from "@/components/ui/dialog";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi,
} from "@/components/ui/carousel";
import { Button } from "@/components/ui/button";
import { Image } from "@/components/ui/image";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";
import { SelectProduct } from "@/db/schemas";

/* --------------------------------------------------
   DEVICE DETECTION HOOK
-------------------------------------------------- */
function useIsTouchDevice() {
  const [isTouch, setIsTouch] = React.useState(false);

  React.useEffect(() => {
    setIsTouch("ontouchstart" in window || navigator.maxTouchPoints > 0);
  }, []);

  return isTouch;
}

/* --------------------------------------------------
   LIGHTBOX
-------------------------------------------------- */
interface LightboxDialogProps {
  images: SelectProduct["images"];
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initialIndex: number;
}

export function LightboxDialog({
  images,
  open,
  onOpenChange,
  initialIndex,
}: LightboxDialogProps) {
  const [api, setApi] = React.useState<CarouselApi>();
  const [current, setCurrent] = React.useState(initialIndex);

  const isTouch = useIsTouchDevice();

  const [zoomed, setZoomed] = React.useState(false);
  const [position, setPosition] = React.useState({ x: 50, y: 50 });

  // Pinch zoom state
  const [scale, setScale] = React.useState(1);
  const [pan, setPan] = React.useState({ x: 0, y: 0 });
  const [pinching, setPinching] = React.useState(false);
  const [pinchOrigin, setPinchOrigin] = React.useState({ x: 50, y: 50 });
  const gestureRef = React.useRef({
    startDistance: 0,
    startScale: 1,
    startPan: { x: 0, y: 0 },
    startTouch: { x: 0, y: 0 },
    isPinching: false,
    isPanning: false,
  });
  const ignoreClickRef = React.useRef(false);

  React.useEffect(() => {
    if (!api) return;
    api.scrollTo(initialIndex);
  }, [api, initialIndex]);

  React.useEffect(() => {
    if (!api) return;
    setCurrent(api.selectedScrollSnap());

    api.on("select", () => {
      setCurrent(api.selectedScrollSnap());
    });
  }, [api]);

  // Reset zoom when slide changes or dialog closes
  React.useEffect(() => {
    setScale(1);
    setPan({ x: 0, y: 0 });
    setZoomed(false);
  }, [current]);

  React.useEffect(() => {
    if (!open) {
      setScale(1);
      setPan({ x: 0, y: 0 });
      setZoomed(false);
    }
  }, [open]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (isTouch) return;

    const rect = e.currentTarget.getBoundingClientRect();

    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;

    setPosition({ x, y });
  };

  const handleTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
    if (e.touches.length === 2) {
      const rect = e.currentTarget.getBoundingClientRect();
      const dx = e.touches[0].clientX - e.touches[1].clientX;
      const dy = e.touches[0].clientY - e.touches[1].clientY;
      const dist = Math.hypot(dx, dy);

      gestureRef.current.startDistance = dist || 1;
      gestureRef.current.startScale = scale;
      gestureRef.current.isPinching = true;
      gestureRef.current.isPanning = false;

      const midX =
        (((e.touches[0].clientX + e.touches[1].clientX) / 2 - rect.left) /
          rect.width) *
        100;
      const midY =
        (((e.touches[0].clientY + e.touches[1].clientY) / 2 - rect.top) /
          rect.height) *
        100;
      setPinchOrigin({ x: midX, y: midY });
      setPinching(true);
      e.stopPropagation();
    } else if (e.touches.length === 1 && scale > 1) {
      gestureRef.current.startPan = { ...pan };
      gestureRef.current.startTouch = {
        x: e.touches[0].clientX,
        y: e.touches[0].clientY,
      };
      gestureRef.current.isPanning = true;
      gestureRef.current.isPinching = false;
      e.stopPropagation();
    }
  };

  const handleTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
    if (gestureRef.current.isPinching && e.touches.length === 2) {
      const dx = e.touches[0].clientX - e.touches[1].clientX;
      const dy = e.touches[0].clientY - e.touches[1].clientY;
      const dist = Math.hypot(dx, dy);
      const newScale = Math.min(
        Math.max(
          gestureRef.current.startScale *
            (dist / gestureRef.current.startDistance),
          1,
        ),
        4,
      );
      setScale(newScale);
      e.preventDefault();
      e.stopPropagation();
    } else if (
      gestureRef.current.isPanning &&
      e.touches.length === 1 &&
      scale > 1
    ) {
      const dx = e.touches[0].clientX - gestureRef.current.startTouch.x;
      const dy = e.touches[0].clientY - gestureRef.current.startTouch.y;
      setPan({
        x: gestureRef.current.startPan.x + dx,
        y: gestureRef.current.startPan.y + dy,
      });
      e.preventDefault();
      e.stopPropagation();
    }
  };

  const handleTouchEnd = (e: React.TouchEvent<HTMLDivElement>) => {
    if (gestureRef.current.isPinching) {
      gestureRef.current.isPinching = false;
      setPinching(false);
      ignoreClickRef.current = true;
      setTimeout(() => {
        ignoreClickRef.current = false;
      }, 100);
      if (scale <= 1.05) {
        setScale(1);
        setPan({ x: 0, y: 0 });
      }
    }
    if (gestureRef.current.isPanning) {
      gestureRef.current.isPanning = false;
    }
  };

  const handleClick = () => {
    if (ignoreClickRef.current) return;
    if (isTouch) setZoomed((prev) => !prev);
  };

  if (!images?.length) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-6xl p-4 md:p-6 bg-background">
        {/* CLOSE */}
        <DialogClose asChild>
          <Button
            size="icon"
            variant="outline"
            className="absolute right-4 top-4"
          >
            <X />
          </Button>
        </DialogClose>

        {/* MAIN IMAGE CAROUSEL */}
        <Carousel setApi={setApi}>
          <CarouselContent>
            {images.map((image) => (
              <CarouselItem key={image.url}>
                <div
                  className={cn(
                    "relative aspect-square w-full overflow-hidden rounded-md",
                    isTouch ? "touch-pan-x touch-pan-y" : "cursor-zoom-in",
                  )}
                  onMouseEnter={() => !isTouch && setZoomed(true)}
                  onMouseLeave={() => !isTouch && setZoomed(false)}
                  onMouseMove={handleMouseMove}
                  onClick={handleClick}
                  onTouchStart={handleTouchStart}
                  onTouchMove={handleTouchMove}
                  onTouchEnd={handleTouchEnd}
                >
                  <Image
                    src={image.url}
                    alt={image.altText}
                    fill
                    sizes="100vw"
                    priority
                    className={cn(
                      "object-cover will-change-transform",
                      !isTouch && zoomed && scale === 1
                        ? "scale-150"
                        : "scale-100",
                      isTouch && "touch-none",
                      !pinching && "transition-transform duration-300",
                    )}
                    style={{
                      transformOrigin: pinching
                        ? `${pinchOrigin.x}% ${pinchOrigin.y}%`
                        : `${position.x}% ${position.y}%`,
                      transform:
                        scale !== 1
                          ? `scale(${scale}) translate(${pan.x}px, ${pan.y}px)`
                          : undefined,
                    }}
                  />
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>

          <CarouselPrevious variant="secondary" className="top-auto bottom-4" />
          <CarouselNext variant="secondary" className="top-auto bottom-4" />
        </Carousel>

        {/* THUMBNAILS */}
        <Carousel>
          <CarouselContent className="justify-center gap-0">
            {images.length > 1 &&
              images.map((img, i) => (
                <CarouselItem key={img.url} className="basis-1/5 aspect-4/3">
                  <button
                    onClick={() => api?.scrollTo(i)}
                    className={cn(
                      "relative h-full w-full rounded-md overflow-hidden border transition",
                      current === i
                        ? "border-primary ring-2 ring-primary"
                        : "border-border opacity-60 hover:opacity-100",
                    )}
                  >
                    <Image
                      src={img.url}
                      alt={img.altText}
                      fill
                      className="object-cover"
                    />
                  </button>
                </CarouselItem>
              ))}
          </CarouselContent>
        </Carousel>
      </DialogContent>
    </Dialog>
  );
}

/* --------------------------------------------------
   PRODUCT THUMBNAIL
-------------------------------------------------- */
export const ProductThumbnail = ({
  images,
}: {
  images: SelectProduct["images"];
}) => {
  const [api, setApi] = React.useState<CarouselApi>();
  const [current, setCurrent] = React.useState(0);
  const [open, setOpen] = React.useState(false);

  React.useEffect(() => {
    if (!api) return;
    setCurrent(api.selectedScrollSnap());

    api.on("select", () => {
      setCurrent(api.selectedScrollSnap());
    });
  }, [api]);

  if (!images?.length) {
    return (
      <div className="aspect-4/3 w-full rounded-xl bg-muted flex items-center justify-center">
        <span className="text-sm text-muted-foreground">
          No images available
        </span>
      </div>
    );
  }

  return (
    <>
      <div className="mx-auto max-w-2xl">
        <Carousel setApi={setApi}>
          <CarouselContent showDefaultItem={false}>
            {images.map((image) => (
              <CarouselItem key={image.url}>
                <div
                  className="relative aspect-4/3 cursor-zoom-in overflow-hidden rounded-xl"
                  onClick={() => setOpen(true)}
                >
                  <Image
                    src={image.url}
                    alt={image.altText}
                    fill
                    className="object-cover"
                  />
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
        </Carousel>

        {/* THUMBNAILS */}
        <Carousel className="mt-2">
          <CarouselContent className="justify-center gap-0">
            {images.length > 1 &&
              images.map((img, i) => (
                <CarouselItem
                  key={img.url}
                  className="basis-1/4 md:basis-1/6 aspect-4/3"
                >
                  <button
                    onClick={() => api?.scrollTo(i)}
                    className={cn(
                      "relative h-full w-full rounded-md overflow-hidden border transition",
                      current === i
                        ? "border-primary ring-2 ring-primary"
                        : "border-border opacity-60 hover:opacity-100",
                    )}
                  >
                    <Image
                      src={img.url}
                      alt={img.altText}
                      fill
                      className="object-cover"
                    />
                  </button>
                </CarouselItem>
              ))}
          </CarouselContent>
        </Carousel>
      </div>

      <LightboxDialog
        images={images}
        open={open}
        onOpenChange={setOpen}
        initialIndex={current}
      />
    </>
  );
};
