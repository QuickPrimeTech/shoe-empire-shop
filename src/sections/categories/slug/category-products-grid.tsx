// @/sections/categories/slug/category-products-grid.tsx
import { FilterPagination } from "@/components/filters/pagination";
import { ProductCard } from "@/components/product-card";
import { Button } from "@/components/ui/button";
import { getPaginatedProducts } from "@/db/functions/product";
import { filterSchema, ValidFilters } from "@/lib/filter-schema";
import { SlugParam } from "@/types/category";
import { SearchParams } from "@/types/common";
import { ArrowLeft } from "lucide-react";
import { cacheLife } from "next/cache";
import Link from "next/link";

export const getPaginatedProductsCached = async (
  filters: ValidFilters,
  categorySlug: string,
) => {
  "use cache";

  cacheLife({
    revalidate: 6 * 60 * 60,
    stale: 6 * 60 * 60,
    expire: 6 * 60 * 60,
  });

  return getPaginatedProducts(filters, categorySlug);
};

export async function CategoryProductsGrid({
  params,
  searchParams,
}: SlugParam & SearchParams) {
  const { slug } = await params;
  const rawParams = await searchParams;

  const normalized: Record<string, string> = {};
  for (const [key, value] of Object.entries(rawParams)) {
    if (value === undefined) continue;
    normalized[key] = Array.isArray(value) ? value.join(",") : value;
  }

  const parsed = filterSchema.safeParse(normalized);
  const filters: ValidFilters = parsed.success
    ? parsed.data
    : { page: 1, limit: 15 };

  const { data, totalPages, totalCount } = await getPaginatedProductsCached(
    filters,
    slug,
  );

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-2">
        <Button size={"sm"} variant={"link"} className="w-fit" asChild>
          <Link href={"/categories"}>
            <ArrowLeft />
            All Categories
          </Link>
        </Button>
        <h1 className="text-xl font-bold md:text-2xl">
          {data[0] ? data[0]?.category?.name : ""}
        </h1>
      </div>
      <div>
        <div className="mb-4 text-sm text-muted-foreground">
          Showing {data.length} of {totalCount} results
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
          {data.map((product) => (
            <ProductCard
              key={product.id}
              showThumbnails={false}
              product={product}
              offer={product.offer ?? undefined}
            />
          ))}
        </div>
      </div>
      <FilterPagination totalPages={totalPages} />
    </div>
  );
}
