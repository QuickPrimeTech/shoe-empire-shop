import { Hero } from "@/sections/home/hero";
import { Marquee } from "@/layouts/marquee";
import { BentoCategories } from "@/sections/home/bento-categories";
import { FeaturedCarousel } from "@/sections/home/featured-carousel";

export default function Home() {
  return (
    <>
      <Hero />
      <Marquee />
      <BentoCategories />
      <FeaturedCarousel />
    </>
  );
}
