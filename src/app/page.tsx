import { Hero } from "@/sections/home/hero";
import { Marquee } from "@/sections/home/marquee";
import { LatestProducts } from "@/sections/home/latest-products";
// Import your Drizzle db instance
import {
  getDiscountedProducts,
  getLatestProducts,
  getLimitedProducts,
} from "@/db/functions/product";
import { getCategories } from "@/db/functions/category";
import { BentoCategories } from "@/sections/home/bento-categories";
import { CrazyDiscounts } from "@/sections/home/crazy-discounts";
import { LimitedProducts } from "@/sections/home/limited-products";

export default async function Home() {
  const featuredProducts = await getLatestProducts(); // Fetch featured products
  const categories = await getCategories();
  const offers = await getDiscountedProducts();
  const limitedProducts = await getLimitedProducts();
  return (
    <>
      <Hero />
      <Marquee />
      <BentoCategories categories={categories} />
      <CrazyDiscounts offers={offers} />
      <LatestProducts products={featuredProducts} />
      <LimitedProducts products={limitedProducts} />
    </>
  );
}
