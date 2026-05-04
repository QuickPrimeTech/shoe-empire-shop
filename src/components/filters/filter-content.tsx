"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { FilterControl } from "./filter-control";
import { useFilterParams } from "@/hooks/use-filter-params";
import { getFiltersConfig } from "./filter-data";
import { EnrichedProduct } from "@/types/product";
import { Dispatch, SetStateAction } from "react";
import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip";
import { cn } from "@/lib/utils";

type FilterContentProps = {
  products: EnrichedProduct[];
  setOpen?: Dispatch<SetStateAction<boolean>>;
  open?: boolean;
};
export function FilterContent({ products, setOpen, open }: FilterContentProps) {
  // Generate the config dynamically on render
  const filters = getFiltersConfig(products);
  return (
    <Accordion
      type="multiple"
      defaultValue={["gender", "category", "price"]}
      className="space-y-2 group-data-[collapsible=icon]:-ml-3"
    >
      {filters.map((filter) => (
        <AccordionItem
          key={filter.id}
          value={filter.id}
          className="border rounded-xl px-4 data-[state=closed]:bg-muted/80 data-[state=open]:bg-muted/5 transition-colors"
        >
          <Tooltip>
            <TooltipTrigger asChild>
              <AccordionTrigger
                onClick={() => {
                  if (setOpen) setOpen(true);
                }}
                className="hover:no-underline group-data-[collapsible=icon]:-ml-2 group-data-[collapsible=icon]:py-2 text-sm font-medium py-4"
              >
                <span className="flex items-center gap-2.5">
                  <span className="text-muted-foreground">{filter.icon}</span>
                  <span className="group-data-[collapsible=icon]:hidden">
                    {filter.label}
                  </span>
                  <FilterBadge
                    filterId={filter.id}
                    className="group-data-[collapsible=icon]:hidden"
                  />
                </span>
              </AccordionTrigger>
            </TooltipTrigger>

            {!open && (
              <TooltipContent side="right" className="flex items-center gap-2">
                {filter.label}
                <FilterBadge filterId={filter.id} />
              </TooltipContent>
            )}
          </Tooltip>
          <AccordionContent className="pb-4 group-data-[collapsible=icon]:hidden">
            <FilterControl config={filter} />
          </AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  );
}

type FilterBadgeProps = {
  filterId: string;
};

function FilterBadge({
  filterId,
  className,
  ...props
}: FilterBadgeProps & React.ComponentProps<typeof Badge>) {
  const { getParam } = useFilterParams();
  const value = getParam(filterId);

  if (!value) return null;

  return (
    <Badge
      className={cn("ml-auto text-xs size-5 bg-primary/80", className)}
      {...props}
    >
      {value.split(",").length}
    </Badge>
  );
}
