// @/components/filter-sidebar.tsx
"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useMemo, useState } from "react";
import { SlidersHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Separator } from "@/components/ui/separator";

type FilterSidebarProps = {
  categories: string[];
  brands: string[];
  maxPrice: number;
};

type FilterSectionProps = {
  title: string;
  children: React.ReactNode;
};

const FilterSection = ({ title, children }: FilterSectionProps) => (
  <div className="space-y-3">
    <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
      {title}
    </h4>
    {children}
  </div>
);

export function FilterSidebar({
  categories,
  brands,
  maxPrice,
}: FilterSidebarProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [priceRange, setPriceRange] = useState<[number, number]>([
    Number(searchParams.get("minPrice")) || 0,
    Number(searchParams.get("maxPrice")) || maxPrice,
  ]);

  // Sync slider when filters are cleared from outside (e.g. chips)
  useEffect(() => {
    const min = Number(searchParams.get("minPrice")) || 0;
    const max = Number(searchParams.get("maxPrice")) || maxPrice;
    setPriceRange([min, max]);
  }, [searchParams, maxPrice]);

  const activeCount = useMemo(() => {
    let count = 0;
    const gender = searchParams.get("gender");
    const category = searchParams.get("category");
    const brand = searchParams.get("brand");
    const minPrice = searchParams.get("minPrice");
    const maxPriceParam = searchParams.get("maxPrice");
    const inStock = searchParams.get("inStock");

    if (gender) count += gender.split(",").length;
    if (category) count += category.split(",").length;
    if (brand) count += brand.split(",").length;
    if (inStock === "true") count += 1;
    if (minPrice || maxPriceParam) count += 1;
    return count;
  }, [searchParams]);

  const createQueryString = useCallback(
    (updates: Record<string, string>) => {
      const params = new URLSearchParams(searchParams.toString());
      Object.entries(updates).forEach(([name, value]) => {
        if (value) {
          params.set(name, value);
        } else {
          params.delete(name);
        }
      });
      return params.toString();
    },
    [searchParams],
  );

  const toggleFilter = (key: string, value: string) => {
    const currentValues =
      searchParams.get(key)?.split(",").filter(Boolean) || [];
    const isActive = currentValues.includes(value);
    const newValues = isActive
      ? currentValues.filter((v) => v !== value)
      : [...currentValues, value];

    router.push(
      `${pathname}?${createQueryString({ [key]: newValues.join(",") })}`,
      { scroll: false },
    );
  };

  const handlePriceCommit = (value: [number, number]) => {
    setPriceRange(value);
    const updates: Record<string, string> = {};
    updates.minPrice = value[0] > 0 ? value[0].toString() : "";
    updates.maxPrice = value[1] < maxPrice ? value[1].toString() : "";
    router.push(`${pathname}?${createQueryString(updates)}`, {
      scroll: false,
    });
  };

  const clearFilters = () => {
    router.push(pathname, { scroll: false });
    setPriceRange([0, maxPrice]);
  };

  const isChecked = (key: string, value: string): boolean => {
    return searchParams.get(key)?.split(",").includes(value) ?? false;
  };

  const FilterContent = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-lg">Filters</h3>
        {activeCount > 0 && (
          <Button
            variant="ghost"
            size="sm"
            onClick={clearFilters}
            className="h-8 px-2 text-muted-foreground hover:text-foreground"
          >
            Clear All
            <span className="ml-1.5 inline-flex items-center justify-center rounded-full bg-muted px-1.5 py-0.5 text-[10px] font-bold">
              {activeCount}
            </span>
          </Button>
        )}
      </div>

      <Separator />

      {/* Gender */}
      <FilterSection title="Gender">
        <div className="space-y-2.5">
          {(["Men", "Women", "Unisex"] as const).map((item) => (
            <div key={item} className="flex items-center space-x-3">
              <Checkbox
                id={`gender-${item}`}
                checked={isChecked("gender", item)}
                onCheckedChange={() => toggleFilter("gender", item)}
              />
              <Label
                htmlFor={`gender-${item}`}
                className="text-sm font-medium cursor-pointer"
              >
                {item}
              </Label>
            </div>
          ))}
        </div>
      </FilterSection>

      <Separator className="bg-border/50" />

      {/* Availability */}
      <FilterSection title="Availability">
        <div className="flex items-center space-x-3">
          <Checkbox
            id="stock"
            checked={searchParams.get("inStock") === "true"}
            onCheckedChange={(checked) =>
              router.push(
                `${pathname}?${createQueryString({ inStock: checked ? "true" : "" })}`,
                { scroll: false },
              )
            }
          />
          <Label htmlFor="stock" className="text-sm font-medium cursor-pointer">
            In Stock Only
          </Label>
        </div>
      </FilterSection>

      <Separator className="bg-border/50" />

      {/* Price Range */}
      <FilterSection title="Price Range">
        <div className="space-y-4 pt-1">
          <Slider
            min={0}
            max={maxPrice}
            step={1}
            minStepsBetweenThumbs={1}
            value={priceRange}
            onValueChange={(val) => setPriceRange(val as [number, number])}
            onValueCommit={handlePriceCommit}
          />
          <div className="flex items-center justify-between text-sm font-medium tabular-nums">
            <span className="rounded-md bg-muted px-2.5 py-1">
              Ksh {priceRange[0].toLocaleString()}
            </span>
            <span className="rounded-md bg-muted px-2.5 py-1">
              Ksh {priceRange[1].toLocaleString()}
            </span>
          </div>
        </div>
      </FilterSection>

      <Separator className="bg-border/50" />

      {/* Category */}
      <FilterSection title="Category">
        <div className="space-y-2.5">
          {categories.map((cat) => (
            <div key={cat} className="flex items-center space-x-3">
              <Checkbox
                id={`cat-${cat}`}
                checked={isChecked("category", cat)}
                onCheckedChange={() => toggleFilter("category", cat)}
              />
              <Label
                htmlFor={`cat-${cat}`}
                className="text-sm font-medium cursor-pointer"
              >
                {cat}
              </Label>
            </div>
          ))}
        </div>
      </FilterSection>

      <Separator className="bg-border/50" />

      {/* Brand */}
      <FilterSection title="Brand">
        <div className="space-y-2.5">
          {brands.map((brand) => (
            <div key={brand} className="flex items-center space-x-3">
              <Checkbox
                id={`brand-${brand}`}
                checked={isChecked("brand", brand)}
                onCheckedChange={() => toggleFilter("brand", brand)}
              />
              <Label
                htmlFor={`brand-${brand}`}
                className="text-sm font-medium cursor-pointer"
              >
                {brand}
              </Label>
            </div>
          ))}
        </div>
      </FilterSection>
    </div>
  );

  return (
    <>
      {/* Mobile Trigger */}
      <div className="md:hidden">
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="outline" className="w-full gap-2">
              <SlidersHorizontal className="h-4 w-4" />
              Filters
              {activeCount > 0 && (
                <span className="ml-1 inline-flex h-5 w-5 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-primary-foreground">
                  {activeCount}
                </span>
              )}
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-[320px] overflow-y-auto">
            <FilterContent />
          </SheetContent>
        </Sheet>
      </div>

      {/* Desktop Sidebar */}
      <div className="hidden md:block w-64 shrink-0">
        <div className="sticky top-24 space-y-6">
          <FilterContent />
        </div>
      </div>
    </>
  );
}
