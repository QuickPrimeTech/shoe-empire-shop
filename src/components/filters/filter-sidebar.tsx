"use client";
import { useState } from "react";
import { SlidersHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { FilterContent } from "./filter-content";
import { useFilterParams } from "@/hooks/use-filter-params";
import { ScrollArea, ScrollBar } from "../ui/scroll-area";
import { EnrichedProduct } from "@/types/product";
import { useMediaQuery } from "@/hooks/use-media-query";
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarProvider,
  SidebarRail,
  SidebarTrigger,
} from "../ui/sidebar";

export function FilterSidebar({ products }: { products: EnrichedProduct[] }) {
  const isDesktop = useMediaQuery("(min-width: 1024px)");
  const [mobileOpen, setMobileOpen] = useState<boolean>(false);
  const [desktopOpen, setDesktopOpen] = useState(true);

  if (!isDesktop) {
    return (
      <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
        <SheetTrigger asChild>
          <Button size="lg" className="relative rounded-full w-fit">
            <SlidersHorizontal className="size-6" />
            Filters
            <ActiveFilterCount />
          </Button>
        </SheetTrigger>
        <SheetContent
          side={"bottom"}
          className="grid gap-0 grid-rows-[auto_minmax(0,1fr)_auto] max-h-[80vh] rounded-t-3xl px-0"
        >
          <SheetHeader className="flex-row px-6 pb-4 border-b">
            <SheetTitle className="flex items-center gap-2 text-xl">
              <SlidersHorizontal className="h-5 w-5" />
              Filters
            </SheetTitle>
            <ClearAllButton />
          </SheetHeader>
          <ScrollArea className="h-full">
            <div className="px-6 py-6">
              <FilterContent products={products} />
            </div>
            <ScrollBar />
          </ScrollArea>
          <div className="p-4 border-t">
            <Button
              onClick={() => setMobileOpen(false)}
              className="w-full h-12 text-lg rounded-xl"
            >
              Show Results
            </Button>
          </div>
        </SheetContent>
      </Sheet>
    );
  }

  return (
    <SidebarProvider
      open={desktopOpen}
      onOpenChange={setDesktopOpen}
      className="min-h-auto w-auto"
    >
      <Sidebar
        collapsible="icon"
        className="sticky inset-auto h-[calc(100vh-64px)] top-16 border-r bg-card rounded-r-xl overflow-hidden"
      >
        <SidebarHeader className="border-b px-4 py-4 flex-row items-center justify-between overflow-hidden">
          <div className="flex items-center gap-2 font-semibold group-data-[collapsible=icon]:hidden">
            <SlidersHorizontal className="h-4 w-4 text-primary" />
            <span>Filters</span>
          </div>
          <div className="group-data-[collapsible=icon]:hidden">
            <ClearAllButton />
          </div>

          <SidebarTrigger />
        </SidebarHeader>

        <SidebarContent>
          <ScrollArea className="h-full">
            <div className="p-4">
              <FilterContent
                products={products}
                setOpen={setDesktopOpen}
                open={desktopOpen}
              />
            </div>
            <ScrollBar />
          </ScrollArea>
        </SidebarContent>
        <SidebarRail />
      </Sidebar>
    </SidebarProvider>
  );
}

function ActiveFilterCount() {
  const { getActiveCount } = useFilterParams();
  const count = getActiveCount();

  if (count === 0) return null;

  return (
    <span className="absolute -top-2 -right-1 h-5 w-5 bg-destructive text-destructive-foreground rounded-full text-xs flex items-center justify-center font-bold">
      {count}
    </span>
  );
}

function ClearAllButton() {
  const { clearAll, getActiveCount } = useFilterParams();
  const count = getActiveCount();

  if (count === 0) return null;

  return (
    <Button
      variant="destructive"
      size="sm"
      onClick={clearAll}
      className="text-xs"
    >
      Clear all
    </Button>
  );
}
