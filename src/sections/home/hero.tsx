// @/sections/home/hero.tsx
"use client";

import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import heroImg from "@/assets/hero-sneaker.png";
import Image from "next/image";
const headline = "STEP INTO THE FUTURE".split(" ");

export const Hero = () => {
  return (
    <section className="relative min-h-screen overflow-hidden text-white">
      {/* Image */}
      <motion.div
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 1.4, ease: [0.22, 0.61, 0.36, 1] }}
        initial={{ scale: 1.1, opacity: 0 }}
        className="absolute inset-0"
      >
        <Image
          src={heroImg}
          width={1920}
          height={1080}
          alt="Empire flagship sneaker"
          className="object-cover opacity-70 mix-blend-luminosity"
        />
      </motion.div>
      <div className="absolute inset-0 bg-linear-to-b from-black/30 via-transparent to-black/80" />

      {/* Vertical label */}
      <div className="absolute left-6 top-1/2 -translate-y-1/2 hidden lg:block -rotate-90 origin-left">
        <span className="text-xs tracking-[0.4em] uppercase text-white/60">
          Drop 04 — FW26
        </span>
      </div>

      {/* Content */}
      <div className="container mx-auto relative z-10 flex min-h-screen flex-col justify-end pb-20 pt-32">
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-xs md:text-sm tracking-[0.3em] uppercase text-accent mb-6"
        >
          New Drop · Limited Edition
        </motion.p>

        <h1 className="font-display text-[14vw] md:text-[9vw] leading-[0.85] uppercase text-balance">
          {headline.map((word, wi) => (
            <span
              key={wi}
              className="inline-block overflow-hidden align-bottom mr-[0.25em]"
            >
              <motion.span
                className="inline-block"
                initial={{ y: "110%" }}
                animate={{ y: 0 }}
                transition={{
                  delay: 0.3 + wi * 0.12,
                  duration: 0.9,
                  ease: [0.22, 0.61, 0.36, 1],
                }}
              >
                {word}
              </motion.span>
            </span>
          ))}
        </h1>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1, duration: 0.6 }}
          className="mt-10 flex flex-col md:flex-row md:items-center justify-between gap-8"
        >
          <p className="max-w-md text-white/70 leading-relaxed">
            Engineered for those who refuse to slow down. The Empire Air Max
            delivers next-gen cushioning and zero compromise.
          </p>

          <div className="flex items-center gap-4">
            <button className="group relative bg-accent text-accent-foreground font-bold px-8 py-4 rounded-full overflow-hidden transition-transform hover:scale-105 active:scale-95 shadow-glow">
              <span className="relative z-10 flex items-center gap-2 uppercase tracking-wider text-sm">
                Shop the drop
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </span>
            </button>
            <button className="text-sm uppercase tracking-wider link-underline">
              Watch film
            </button>
          </div>
        </motion.div>
      </div>
    </section>
  );
};
