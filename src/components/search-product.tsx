// @/components/search-product.tsx
"use client";
import * as React from "react";
import { useRouter } from "next/navigation";
import { useMediaQuery } from "@/hooks/use-media-query";
import { Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Image } from "./ui/image";
import { NavProducts } from "@/types/common";

export const SearchProduct = ({ products }: { products: NavProducts }) => {
  const [open, setOpen] = React.useState(false);
  const isDesktop = useMediaQuery("(min-width: 768px)");
  const router = useRouter();

  // Handle Cmd+K / Ctrl+K keyboard shortcut
  React.useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((open) => !open);
      }
    };

    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  // Helper function to handle routing and closing the dialog
  const runCommand = React.useCallback((command: () => void) => {
    setOpen(false);
    command();
  }, []);

  return (
    <>
      {/* Search Triggers */}
      {!isDesktop ? (
        <button
          onClick={() => setOpen(true)}
          className="p-2 hover:bg-secondary rounded-full transition"
        >
          <Search className="size-5" />
        </button>
      ) : (
        <Button
          variant="outline"
          className="relative h-10 w-full justify-start rounded-full bg-background text-sm font-normal text-muted-foreground shadow-none sm:pr-12 md:w-40 lg:w-64 cursor-pointer"
          onClick={() => setOpen(true)}
        >
          <Search className="mr-2 size-4" />
          <span className="hidden lg:inline-flex">Search products...</span>
          <span className="inline-flex lg:hidden">Search...</span>
        </Button>
      )}

      {/* Command Search Overlay */}
      <Command>
        <CommandDialog
          open={open}
          onOpenChange={setOpen}
          className="py-4 px-2 gap-0"
        >
          <CommandInput placeholder="Search products, brands..." />
          <CommandList>
            <CommandEmpty>No Products found.</CommandEmpty>
            <CommandGroup heading="Products" className="py-3">
              {products.map((product) => (
                <CommandItem
                  key={product.id}
                  value={product.name}
                  onSelect={() => {
                    // Adjust this URL path to match your actual routing setup
                    runCommand(() =>
                      router.push(`/products/${product.slug || product.id}`),
                    );
                  }}
                  className="cursor-pointer"
                >
                  <div className="flex gap-3">
                    <div className="relative flex h-12 aspect-square rounded-sm overflow-hidden">
                      <Image
                        src={product.image.url}
                        alt={product.image.altText}
                        fill
                        sizes="48px"
                      />
                    </div>
                    <div className="space-y-1">
                      <p className="font-heading font-bold">{product.name}</p>
                      <p className="text-primary font-bold text-sm">
                        {product.price}
                      </p>
                    </div>
                  </div>
                  {/* You can also add product.price, or an image thumbnail here */}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </CommandDialog>
      </Command>
    </>
  );
};
