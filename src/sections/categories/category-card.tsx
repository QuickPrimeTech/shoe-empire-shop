// @/sections/categories/category-card.tsx
import { Image } from "@/components/ui/image";
import { ChevronRight } from "lucide-react";
import Link from "next/link";

type CategoryCardProps = {
  category: {
    id: string;
    name: string;
    slug: string;
    image: string | null;
    productCount: number;
  };
};

export const CategoryCard = ({ category }: CategoryCardProps) => {
  return (
    <Link
      href={`/categories/${category.slug}`}
      className="group relative flex flex-col overflow-hidden rounded-2xl bg-card shadow-sm active:shadow-md md:hover:shadow-xl transition-all duration-500 ease-out border border-border active:border-primary/50 md:hover:border-primary/50 active:-translate-y-0.5 md:hover:-translate-y-1"
    >
      {/* Image Container */}
      <div className="relative aspect-4/3 overflow-hidden bg-muted">
        <Image
          src={category.image}
          alt={category.name}
          fill
          className="object-cover transition-transform duration-700 ease-out group-active:scale-105 md:group-hover:scale-110"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
        />

        {/* Permanent gradient overlay - always visible for readability */}
        <div className="absolute inset-0 bg-linear-to-t from-black/70 via-black/20 to-transparent" />

        {/* Floating Badge - always visible */}
        <div className="absolute top-3 right-3 md:top-4 md:right-4">
          <span className="inline-flex items-center px-2.5 py-0.5 md:px-3 md:py-1 rounded-full text-xs font-medium bg-background/90 backdrop-blur-sm text-foreground shadow-sm border border-border">
            {category.productCount}{" "}
            {category.productCount === 1 ? "product" : "products"}
          </span>
        </div>

        {/* Content Overlay - always visible on mobile, slides up on hover for desktop */}
        <div className="absolute inset-x-0 bottom-0">
          {/* Mobile: Always show compact info */}
          <div className="md:hidden p-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold text-white drop-shadow-sm">
                {category.name}
              </h2>
              <ChevronRight className="w-5 h-5 text-white/80" />
            </div>
            <p className="text-xs text-white/70 mt-1">
              {category.productCount > 0
                ? `${category.productCount} in stock`
                : "Coming soon"}
            </p>
          </div>

          {/* Desktop: Slide-up panel on hover */}
          <div className="hidden md:block translate-y-[calc(100%-3.5rem)] group-hover:translate-y-0 transition-transform duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] bg-card/95 backdrop-blur-md border-t border-border px-6 py-4 rounded-t-xl">
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-xl font-bold text-card-foreground group-hover:text-primary transition-colors duration-300">
                {category.name}
              </h2>
              <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all duration-300" />
            </div>

            <p className="text-sm text-muted-foreground line-clamp-2">
              Explore our {category.name.toLowerCase()} collection
              {category.productCount > 0 && (
                <>
                  {" "}
                  with {category.productCount} curated{" "}
                  {category.productCount === 1 ? "product" : "products"}
                </>
              )}
              .
            </p>

            {/* Progress Bar Visual */}
            <div className="mt-4 pt-4 border-t border-border">
              <div className="flex items-center justify-between text-xs text-muted-foreground mb-1.5">
                <span>Availability</span>
                <span>
                  {category.productCount > 0 ? "In Stock" : "Coming Soon"}
                </span>
              </div>
              <div className="h-1.5 w-full bg-muted rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-1000 ease-out ${
                    category.productCount > 0
                      ? "bg-primary w-full"
                      : "bg-muted-foreground/20 w-0"
                  }`}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Active/Hover Glow Effect */}
      <div className="absolute inset-0 rounded-2xl ring-2 ring-primary/0 group-active:ring-primary/10 md:group-hover:ring-primary/20 transition-all duration-500 pointer-events-none" />
    </Link>
  );
};
