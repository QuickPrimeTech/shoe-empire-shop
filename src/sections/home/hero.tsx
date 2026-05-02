"use client";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Image } from "@/components/ui/image";
import { cn } from "@/lib/utils";
import { useIsMobile } from "@/hooks/use-mobile";
import Link from "next/link";

const content = [
  {
    id: 1,
    title: "BEST SNEAKER DEALS",
    caption: "New Drop · Limited Edition",
    description:
      "Discover unbeatable sneaker deals at Shoe Empire. Built for comfort and turning heads from CBD to Westlands.",
    image:
      "https://res.cloudinary.com/quick-prime-tech/image/upload/v1777644343/hero-sneaker_litw48.png",
    link: "/collections/sneakers",
  },
  {
    id: 2,
    title: "NEW T-SHIRT DROP",
    caption: "Genz T-shirts",
    description:
      "Upgrade luku yako with our latest T-shirt collection. Trendy and comfortable for every sherehe.",
    image:
      "https://res.cloudinary.com/quick-prime-tech/image/upload/v1777645585/t-shirt_kdpest.png",
    link: "/collections/t-shirts",
  },
];

export const Hero = () => {
  const [index, setIndex] = useState(0);
  const active = content[index];
  const isMobile = useIsMobile();

  // Auto-slide every 5 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((prev) => (prev === content.length - 1 ? 0 : prev + 1));
    }, 10000);
    return () => clearInterval(timer);
  }, []);

  return (
    <section
      className={cn(
        "relative md:py-10 min-h-screen overflow-hidden",
        !isMobile && "section",
      )}
    >
      <div className="container relative max-sm:pt-32 max-sm:pb-32 px-4 overflow-hidden border sm:px-6 rounded-b-3xl sm:rounded-3xl bg-[radial-gradient(ellipse_at_top,var(--background)_0%,var(--background)_120%)] mx-auto z-10 flex min-h-[80vh] flex-col justify-center">
        {/* Background Grid & Glows */}
        <div className="absolute inset-0 z-0 bg-[linear-gradient(to_right,theme(colors.slate.500/0.1)_1px,transparent_1px),linear-gradient(to_bottom,theme(colors.slate.500/0.1)_1px,transparent_1px),radial-gradient(circle_500px_at_20%_80%,theme(colors.violet.500/0.15),transparent),radial-gradient(circle_500px_at_80%_20%,theme(colors.blue.500/0.15),transparent)] bg-[size:48px_48px,48px_48px,100%_100%,100%_100%]" />

        {/* Text Content Area */}
        <AnimatePresence mode="wait">
          <motion.div
            key={active.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            transition={{ duration: 0.5 }}
            className="relative z-10"
          >
            <p className="text-caption font-mono tracking-[0.2em] uppercase text-primary mb-4">
              {active.caption}
            </p>
            <h1 className="font-display text-5xl md:text-7xl font-bold uppercase mb-6 leading-tight">
              {active.title}
            </h1>
            <p className="max-w-md text-foreground/80 leading-relaxed mb-8">
              {active.description}
            </p>
            <Button size="xl" className="group" asChild>
              <Link href={active.link}>
                Shop Collection
                <ArrowRight className="ml-2 size-5 transition-transform group-hover:translate-x-1" />
              </Link>
            </Button>
          </motion.div>
        </AnimatePresence>

        {/* Image Carousel Area */}
        <AnimatePresence mode="wait">
          <motion.div
            key={active.image}
            initial={{ opacity: 0, scale: 0.8, rotate: -5 }}
            animate={{ opacity: 1, scale: 1, rotate: 0 }}
            exit={{ opacity: 0, scale: 1.1, rotate: 5 }}
            transition={{ duration: 0.6, ease: "circOut" }}
            className="absolute w-full top-3/4 sm:top-1/2 -translate-y-1/2 -right-1/5 sm:w-2/3 aspect-3/2 sm:-right-1/10"
          >
            <Image
              src={active.image}
              fill
              priority
              quality={95}
              alt={active.title}
              className="object-contain"
              sizes="(max-width: 768px) 100vw, 50vw"
            />
          </motion.div>
        </AnimatePresence>

        {/* Carousel Navigation Buttons */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-3 z-20">
          {content.map((slide, i) => (
            <Button
              size={"icon"}
              aria-label={`Go to ${slide}`}
              title={`Go to ${slide.caption}`}
              key={i}
              onClick={() => setIndex(i)}
              className={`h-3 ransition-all rounded-full ${
                index === i ? "w-8 bg-primary" : "w-3 bg-slate-400"
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  );
};
