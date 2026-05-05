// @/layouts/app-header.tsx
import { getCategoriesWithCount } from "@/db/functions/category";
import { cacheLife } from "next/cache";
import { Navbar } from "./navbar";
import { getProductsForNav } from "@/db/functions/product";

const getNavDataCached = async () => {
  "use cache";

  cacheLife({
    revalidate: 6 * 60 * 60,
    stale: 6 * 60 * 60,
    expire: 6 * 60 * 60,
  });

  // Parallelize the queries to reduce total execution time
  const [products, categories] = await Promise.all([
    getProductsForNav(),
    getCategoriesWithCount(),
  ]);

  return { categories, products };
};

export const AppHeader = async () => {
  const { categories, products } = await getNavDataCached();

  return <Navbar categories={categories} products={products} />;
};
