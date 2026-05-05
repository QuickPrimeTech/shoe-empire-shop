// @/sections/categories/slug/filter-categories-sidebar.tsx
import { FilterSidebar } from "@/components/filters/filter-sidebar";
import { getProducts } from "@/db/functions/product";
import { SlugParam } from "@/types/category";
import { cacheLife } from "next/cache";
import { Suspense } from "react";

const getProductsCached = async (categorySlug: string) => {
  "use cache";

  cacheLife({
    revalidate: 6 * 60 * 60,
    stale: 6 * 60 * 60,
    expire: 6 * 60 * 60,
  });

  return await getProducts(categorySlug);
};

export async function FilterCateogriesidebar({ params }: SlugParam) {
  const { slug } = await params;
  const products = await getProductsCached(slug); // Cached for 6 hours

  return (
    <Suspense>
      <FilterSidebar products={products} hideCategoryFilter={true} />
    </Suspense>
  );
}
