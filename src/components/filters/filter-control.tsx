"use client";

import { useState } from "react";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox"; // Import Shadcn Checkbox
import { cn } from "@/lib/utils";
import { FilterConfig } from "@/types/filters";
import { useFilterParams } from "@/hooks/use-filter-params";

export function FilterControl({ config }: { config: FilterConfig }) {
  const { id, type, options } = config;
  const { getParam, updateFilter } = useFilterParams();

  // --- Type: Single (e.g., Gender) ---
  if (type === "single") {
    const current = getParam(id);
    return (
      <div className="space-y-1">
        {options.map((opt) => {
          const isSelected = current === opt.value;
          return (
            <div
              key={opt.value}
              className={cn(
                "flex items-center space-x-3 px-3 py-2.5 rounded-lg transition-all cursor-pointer hover:bg-muted/50",
                isSelected && "bg-muted",
              )}
              onClick={() => updateFilter(id, isSelected ? null : opt.value)}
            >
              <Checkbox
                id={`${id}-${opt.value}`}
                checked={isSelected}
                onCheckedChange={() =>
                  updateFilter(id, isSelected ? null : opt.value)
                }
              />
              <Label
                htmlFor={`${id}-${opt.value}`}
                className="flex-1 text-sm font-medium leading-none cursor-pointer"
              >
                {opt.label}
              </Label>
            </div>
          );
        })}
      </div>
    );
  }

  // --- Type: Multiple (e.g., Categories, Brands) ---
  if (type === "multiple") {
    const current = getParam(id)?.split(",") || [];
    return (
      <div className="space-y-1">
        {options.map((opt) => {
          const isSelected = current.includes(opt.value);

          const handleToggle = () => {
            const next = isSelected
              ? current.filter((v) => v !== opt.value)
              : [...current, opt.value];
            updateFilter(id, next.length ? next.join(",") : null);
          };

          return (
            <div
              key={opt.value}
              className={cn(
                "flex items-center justify-between px-3 py-2.5 rounded-lg transition-all cursor-pointer hover:bg-muted/50",
                isSelected && "bg-primary/5",
              )}
              onClick={handleToggle}
            >
              <div className="flex items-center space-x-3">
                <Checkbox
                  id={`${id}-${opt.value}`}
                  checked={isSelected}
                  onCheckedChange={handleToggle}
                />
                <Label
                  htmlFor={`${id}-${opt.value}`}
                  className="text-sm font-medium leading-none cursor-pointer"
                >
                  {opt.label}
                </Label>
              </div>
              {opt.count && (
                <span className="text-xs text-muted-foreground bg-muted px-2 py-0.5 rounded-full">
                  {opt.count}
                </span>
              )}
            </div>
          );
        })}
      </div>
    );
  }

  // --- Type: Range (Price) ---
  if (type === "range") {
    const min = Number(getParam("minPrice") || 0);
    const max = Number(getParam("maxPrice") || 50000);
    const [range, setRange] = useState([min, max]);

    return (
      <div className="px-1 space-y-6">
        <Slider
          value={range}
          max={50000}
          step={1000}
          onValueChange={setRange}
          onValueCommit={(value) => {
            updateFilter("minPrice", value[0] > 0 ? String(value[0]) : null);
            updateFilter(
              "maxPrice",
              value[1] < 50000 ? String(value[1]) : null,
            );
          }}
          className="w-full"
        />
        <div className="flex items-center justify-between text-sm font-medium">
          <span className="bg-muted px-3 py-1.5 rounded-lg">
            KES {range[0].toLocaleString()}
          </span>
          <span className="text-muted-foreground">to</span>
          <span className="bg-muted px-3 py-1.5 rounded-lg">
            KES {range[1].toLocaleString()}
          </span>
        </div>
      </div>
    );
  }

  // --- Type: Boolean (Stock) ---
  if (type === "boolean") {
    const isInStock = getParam("inStock") === "true";
    return (
      <div className="flex items-center justify-between px-1">
        <Label htmlFor="stock-toggle" className="text-sm cursor-pointer">
          In Stock Only
        </Label>
        <Switch
          id="stock-toggle"
          checked={isInStock}
          onCheckedChange={(checked) =>
            updateFilter("inStock", checked ? "true" : null)
          }
        />
      </div>
    );
  }

  return null;
}
