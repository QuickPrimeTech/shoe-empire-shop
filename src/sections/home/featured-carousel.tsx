// @/sections/home/featured-carousel.tsx

"use client";

import { motion } from "framer-motion";
import { Heart, Plus } from "lucide-react";
import { products } from "@/data/products";
import { useCart } from "@/store/cart";
import { toast } from "sonner";
import Image from "next/image";
import { useRef, useState } from "react";

export const FeaturedCarousel = () => {
  const { add, open } = useCart();
  const trackRef = useRef<HTMLDivElement>(null);
  const [progress, setProgress] = useState(0);
  const [wishlist, setWishlist] = useState<Record<string, boolean>>({});

  const onScroll = () => {
    const el = trackRef.current;
    if (!el) return;
    const max = el.scrollWidth - el.clientWidth;
    setProgress(max > 0 ? (el.scrollLeft / max) * 100 : 0);
  };

  const handleAdd = (p: (typeof products)[number]) => {
    add({ ...p, size: 9, qty: 1 });
    toast.success(`${p.name} added to cart`, {
      description: "Size 9 · 1 item",
    });
    open();
  };

  const toggleWish = (id: string) => {
    setWishlist((w) => ({ ...w, [id]: !w[id] }));
    toast(wishlist[id] ? "Removed from wishlist" : "Added to wishlist");
  };

  return (
    <section className="py-24 md:py-32 bg-secondary/40">
      <div className="container mx-auto">
        <div className="flex items-end justify-between mb-12">
          <div>
            <p className="text-xs tracking-[0.3em] uppercase text-muted-foreground mb-3">
              Featured
            </p>
            <h2 className="font-display text-5xl md:text-7xl uppercase leading-none">
              Just
              <br />
              dropped.
            </h2>
          </div>
        </div>
      </div>

      <div
        ref={trackRef}
        onScroll={onScroll}
        className="flex gap-5 overflow-x-auto snap-x snap-mandatory pb-8 px-6 md:px-12 scrollbar-none"
        style={{ scrollbarWidth: "none" }}
      >
        {products.map((p, i) => (
          <motion.article
            key={p.id}
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.08 }}
            className="group snap-start shrink-0 w-[80vw] sm:w-100 bg-background rounded-md overflow-hidden border border-border"
          >
            <div className="relative aspect-square bg-muted overflow-hidden">
              <Image
                src={p.image}
                alt={p.name}
                loading="lazy"
                className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <button
                onClick={() => toggleWish(p.id)}
                className="absolute top-4 right-4 h-10 w-10 rounded-full bg-background/80 backdrop-blur flex items-center justify-center hover:scale-110 active:scale-90 transition"
                aria-label="Wishlist"
              >
                <Heart
                  className={`h-4 w-4 transition ${wishlist[p.id] ? "fill-destructive text-destructive scale-110" : ""}`}
                />
              </button>
              <button
                onClick={() => handleAdd(p)}
                className="absolute bottom-4 right-4 h-12 w-12 rounded-full bg-foreground text-background flex items-center justify-center opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all hover:bg-accent hover:text-accent-foreground"
                aria-label="Quick add"
              >
                <Plus className="h-5 w-5" />
              </button>
            </div>
            <div className="p-5 flex items-start justify-between gap-4">
              <div>
                <p className="text-xs uppercase tracking-widest text-muted-foreground">
                  {p.category}
                </p>
                <h3 className="font-semibold text-lg mt-1">{p.name}</h3>
                <p className="text-xs text-muted-foreground mt-0.5">
                  {p.color}
                </p>
              </div>
              <p className="font-display text-lg">${p.price}</p>
            </div>
          </motion.article>
        ))}
        <div className="shrink-0 w-6" />
      </div>

      <div className="container mx-auto">
        <div className="h-px bg-border relative mt-2">
          <motion.div
            className="absolute inset-y-0 left-0 bg-foreground"
            style={{ width: `${Math.max(15, progress)}%` }}
            transition={{ type: "spring", stiffness: 200, damping: 30 }}
          />
        </div>
      </div>
    </section>
  );
};
