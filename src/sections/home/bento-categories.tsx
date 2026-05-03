// @/sections/home/bento-categories.tsx
"use client";
import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { Image } from "@/components/ui/image";
import { Button } from "@/components/ui/button";
import { SelectCategory } from "@/db/schemas";
import { cn } from "@/lib/utils";

type BentoCategoriesProps = {
  categories: SelectCategory[];
};

export const BentoCategories = ({ categories }: BentoCategoriesProps) => {
  const featuredCategories = categories.slice(0, 5);

  // Grid span configurations for each position (0-4)
  const getGridSpans = (index: number) => {
    switch (index) {
      case 0: // Large featured (top-left)
        return "col-span-2 row-span-2";
      case 1: // Top-right
        return "col-span-1 row-span-1";
      case 2: // Middle-right
        return "col-span-1 row-span-1";
      case 3: // Bottom-left
        return "col-span-1 row-span-1";
      case 4: // Bottom-right (spans 2 on mobile, 1 on lg)
        return "col-span-2 lg:col-span-1 row-span-1";
      default:
        return "";
    }
  };

  return (
    <section className="container mx-auto section py-20">
      <div className="flex items-end justify-between mb-12">
        <div>
          <p className="font-mono text-xs tracking-wide uppercase text-muted-foreground mb-3">
            Shop by Sport
          </p>
          <h2 className="font-display text-heading-2 md:text-heading-1 uppercase">
            Find your
            <br />
            arena.
          </h2>
        </div>
        <Button asChild variant="link" className="hidden md:inline-flex">
          <a href="/categories">
            View all <ArrowUpRight className="h-4 w-4" />
          </a>
        </Button>
      </div>

      {/* 
        Mobile: 2 columns, auto rows based on aspect ratio
        Tablet (md): 3 columns
        Desktop (lg): 4 columns with fixed 280px row height
      */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4 auto-rows-[200px] md:auto-rows-[240px] lg:auto-rows-[280px]">
        {featuredCategories.map((cat, i) => (
          <motion.a
            key={cat.id}
            href={`/categories/${cat.slug}`}
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ delay: i * 0.08, duration: 0.7 }}
            className={cn(
              "group relative overflow-hidden rounded-xl bg-secondary",
              getGridSpans(i),
            )}
          >
            <Image
              src={cat.image || "/placeholder-category.jpg"}
              alt={cat.name}
              loading={i < 2 ? "eager" : "lazy"}
              fill
              sizes={cn(
                i === 0
                  ? "(max-width: 768px) 100vw, (max-width: 1024px) 66vw, 50vw"
                  : "(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw",
              )}
              className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
            />

            {/* Gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

            {/* Content */}
            <div className="absolute inset-0 p-4 md:p-6 flex flex-col justify-end text-white">
              <h3
                className={cn(
                  "font-display font-bold uppercase leading-tight",
                  i === 0
                    ? "text-3xl md:text-4xl lg:text-5xl"
                    : "text-xl md:text-2xl",
                )}
              >
                {cat.name}
              </h3>
              <span className="mt-2 inline-flex items-center gap-1 text-xs uppercase tracking-widest opacity-80 group-hover:opacity-100 transition-opacity">
                Explore
                <ArrowUpRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
              </span>
            </div>
          </motion.a>
        ))}
      </div>

      {/* Mobile CTA */}
      <div className="mt-8 flex justify-center md:hidden">
        <Button asChild variant="outline">
          <a href="/categories">
            View all categories <ArrowUpRight className="h-4 w-4 ml-1" />
          </a>
        </Button>
      </div>
    </section>
  );
};
