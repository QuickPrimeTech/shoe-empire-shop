// @/sections/home/bento-categories.tsx

"use client";

import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { categories } from "@/data/products";
import Image from "next/image";

export const BentoCategories = () => {
  return (
    <section className="container mx-auto py-24 md:py-32">
      <div className="flex items-end justify-between mb-12">
        <div>
          <p className="text-xs tracking-[0.3em] uppercase text-muted-foreground mb-3">
            Shop by Sport
          </p>
          <h2 className="font-display text-5xl md:text-7xl uppercase leading-none">
            Find your
            <br />
            arena.
          </h2>
        </div>
        <a
          href="#"
          className="hidden md:inline-flex items-center gap-2 text-sm uppercase tracking-wider link-underline"
        >
          View all <ArrowUpRight className="h-4 w-4" />
        </a>
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
            className={`group relative overflow-hidden rounded-md bg-secondary ${cat.span} aspect-square lg:aspect-auto`}
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
              <h3 className="font-display text-3xl md:text-4xl uppercase">
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
