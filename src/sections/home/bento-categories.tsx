// @/sections/home/bento-categories.tsx
"use client";
import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { Image } from "@/components/ui/image";
import { Button } from "@/components/ui/button";
import { SelectCategory } from "@/db/schemas";

type BentoCategoriesProps = {
  categories: SelectCategory[];
};
export const BentoCategories = ({ categories }: BentoCategoriesProps) => {
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
          <a href="#">
            View all <ArrowUpRight className="h-4 w-4" />
          </a>
        </Button>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:auto-rows-[280px]">
        {categories.map((cat, i) => (
          <motion.a
            key={cat.name}
            href="#"
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ delay: i * 0.08, duration: 0.7 }}
            className={`group relative overflow-hidden rounded-md bg-secondary aspect-square lg:aspect-auto`}
          >
            <Image
              src={cat.image}
              alt={cat.name}
              loading="lazy"
              fill
              className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-linear-to-t from-black/70 via-transparent to-transparent" />
            <div className="absolute inset-0 p-6 flex flex-col justify-end text-white">
              <h3 className="font-display font-bold text-2xl md:text-4xl uppercase">
                {cat.name}
              </h3>
              <span className="mt-2 inline-flex items-center gap-1 text-xs uppercase tracking-widest opacity-80 group-hover:opacity-100 transition">
                Explore{" "}
                <ArrowUpRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
              </span>
            </div>
          </motion.a>
        ))}
      </div>
    </section>
  );
};
