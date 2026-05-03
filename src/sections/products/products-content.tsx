// @/sections/products/products-content.tsx
"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useMemo } from "react";
import { ProductCard } from "@/components/product-card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { X, PackageX, ArrowUpDown } from "lucide-react";
import { EnrichedProduct } from "@/types/product";

type SortOption =
  | "featured"
  | "price_asc"
  | "price_desc"
  | "name_asc"
  | "newest";

type ActiveFilter = {
  key: string;
  value: string;
  label: string;
};

export function ProductsContent({ products }: { products: EnrichedProduct[] }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const sort = (searchParams.get("sort") as SortOption) || "featured";

  // Filter
  const filtered = useMemo(() => {
    return products.filter((product) => {
      const gender = searchParams.get("gender");
      const category = searchParams.get("category");
      const brand = searchParams.get("brand");
      const minPrice = searchParams.get("minPrice");
      const maxPriceParam = searchParams.get("maxPrice");
      const inStock = searchParams.get("inStock");

      const genderMatch =
        !gender || gender.split(",").includes(product.gender || "");
      const categoryMatch =
        !category || category.split(",").includes(product.category?.name || "");
      const brandMatch =
        !brand || brand.split(",").includes(product.brand || "");
      const priceMatch =
        product.discountedPrice >= (Number(minPrice) || 0) &&
        product.discountedPrice <= (Number(maxPriceParam) || Infinity);
      const stockMatch = inStock === "true" ? product.totalStock > 0 : true;

      return (
        genderMatch && categoryMatch && brandMatch && priceMatch && stockMatch
      );
    });
  }, [products, searchParams]);

  // Sort
  const sorted = useMemo(() => {
    const list = [...filtered];
    switch (sort) {
      case "price_asc":
        return list.sort((a, b) => a.discountedPrice - b.discountedPrice);
      case "price_desc":
        return list.sort((a, b) => b.discountedPrice - a.discountedPrice);
      case "name_asc":
        return list.sort((a, b) => a.name.localeCompare(b.name));
      case "newest":
        return list.sort(
          (a, b) =>
            new Date(b.createdAt || 0).getTime() -
            new Date(a.createdAt || 0).getTime(),
        );
      default:
        return list;
    }
  }, [filtered, sort]);

  // Active filter chips
  const activeFilters = useMemo<ActiveFilter[]>(() => {
    const filters: ActiveFilter[] = [];
    const genderParam = searchParams.get("gender");
    if (genderParam)
      filters.push(
        ...genderParam
          .split(",")
          .map((v) => ({ key: "gender", value: v, label: v })),
      );

    const categoryParam = searchParams.get("category");
    if (categoryParam)
      filters.push(
        ...categoryParam
          .split(",")
          .map((v) => ({ key: "category", value: v, label: v })),
      );

    const brandParam = searchParams.get("brand");
    if (brandParam)
      filters.push(
        ...brandParam
          .split(",")
          .map((v) => ({ key: "brand", value: v, label: v })),
      );

    if (searchParams.get("inStock") === "true")
      filters.push({ key: "inStock", value: "true", label: "In Stock" });

    const minP = searchParams.get("minPrice");
    const maxP = searchParams.get("maxPrice");
    if (minP || maxP)
      filters.push({
        key: "price",
        value: "range",
        label: `Ksh ${Number(minP || 0).toLocaleString()} - Ksh ${Number(maxP || Infinity).toLocaleString()}`,
      });

    return filters;
  }, [searchParams]);

  const removeFilter = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (key === "price") {
      params.delete("minPrice");
      params.delete("maxPrice");
    } else if (key === "inStock") {
      params.delete("inStock");
    } else {
      const current = params.get(key)?.split(",").filter(Boolean) || [];
      const next = current.filter((v) => v !== value);
      if (next.length) params.set(key, next.join(","));
      else params.delete(key);
    }
    router.push(`${pathname}?${params.toString()}`, { scroll: false });
  };

  const clearAll = () => {
    router.push(pathname, { scroll: false });
  };

  const handleSort = (value: SortOption) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value === "featured") params.delete("sort");
    else params.set("sort", value);
    router.push(`${pathname}?${params.toString()}`, { scroll: false });
  };

  return (
    <div className="space-y-6">
      {/* Toolbar */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-muted-foreground">
          Showing{" "}
          <span className="font-medium text-foreground">{sorted.length}</span>{" "}
          product{sorted.length !== 1 ? "s" : ""}
        </p>

        <Select value={sort} onValueChange={(v) => handleSort(v as SortOption)}>
          <SelectTrigger className="w-full sm:w-[200px]">
            <ArrowUpDown className="mr-2 h-4 w-4 text-muted-foreground" />
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="featured">Featured</SelectItem>
            <SelectItem value="price_asc">Price: Low to High</SelectItem>
            <SelectItem value="price_desc">Price: High to Low</SelectItem>
            <SelectItem value="name_asc">Name: A-Z</SelectItem>
            <SelectItem value="newest">Newest Arrivals</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Active Filter Chips */}
      {activeFilters.length > 0 && (
        <div className="flex flex-wrap items-center gap-2">
          {activeFilters.map((filter) => (
            <Badge
              key={`${filter.key}-${filter.value}`}
              variant="secondary"
              className="cursor-pointer gap-1 pr-1.5 font-medium hover:bg-secondary/80"
              onClick={() => removeFilter(filter.key, filter.value)}
            >
              {filter.label}
              <X className="h-3 w-3" />
            </Badge>
          ))}
          <Button
            variant="ghost"
            size="sm"
            className="h-7 text-xs text-muted-foreground hover:text-foreground"
            onClick={clearAll}
          >
            Clear all
          </Button>
        </div>
      )}

      {/* Product Grid */}
      {sorted.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-2xl border bg-muted/20 py-20">
          <PackageX className="mb-4 h-12 w-12 text-muted-foreground" />
          <h3 className="text-lg font-semibold text-foreground">
            No products found
          </h3>
          <p className="mt-1 text-sm text-muted-foreground">
            Adjust your filters to see more results.
          </p>
          <Button variant="outline" className="mt-6" onClick={clearAll}>
            Clear all filters
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {sorted.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              offer={product.offer ?? undefined}
            />
          ))}
        </div>
      )}
    </div>
  );
}
