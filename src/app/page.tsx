import { Hero } from "@/sections/home/hero";
import { Marquee } from "@/layouts/marquee";
import { FeaturedCarousel } from "@/sections/home/featured-carousel";
// Import your Drizzle db instance
import { getFeaturedProducts } from "@/db/functions/product";
import { getCategories } from "@/db/functions/category";
import { BentoCategories } from "@/sections/home/bento-categories";

export default async function Home() {
  const featuredProducts = await getFeaturedProducts(); // Fetch featured products
  const categories = await getCategories();
  return (
    <>
      <Hero />
      <Marquee />
      <BentoCategories categories={categories} />
      <FeaturedCarousel products={featuredProducts} />
    </>
  );
}
