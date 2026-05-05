// @/sections/products/product-grid.tsx
import { FilterPagination } from "@/components/filters/pagination";
import { ProductCard } from "@/components/product-card";
import { getPaginatedProducts } from "@/db/functions/product";
import { AppBreadcrumb } from "@/layouts/app-breadcrumb";
import { filterSchema, ValidFilters } from "@/lib/filter-schema";
import { SearchParams } from "@/types/common";
import { cacheLife } from "next/cache";

export const getPaginatedProductsCached = async (filters: ValidFilters) => {
  "use cache";

  cacheLife({
    revalidate: 6 * 60 * 60,
    stale: 6 * 60 * 60,
    expire: 6 * 60 * 60,
  });

  return getPaginatedProducts(filters);
};

export async function ProductGrid({ searchParams }: SearchParams) {
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

  console.log("Valid filters:", filters);

  const { data, totalPages, totalCount } =
    await getPaginatedProductsCached(filters);

  console.log("Total Pages  ---->", totalPages);
  return (
    <div className="space-y-4">
      <AppBreadcrumb />
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
      <FilterPagination totalPages={totalPages} />
    </div>
  );
}
