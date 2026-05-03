// @/app/products/page.tsx
import { Metadata } from "next";
import { getProducts } from "@/db/functions/product";
import { FilterSidebar } from "@/components/filter-sidebar";
import { ProductsContent } from "@/sections/products/products-content";

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "All Products",
    description:
      "Browse our curated collection of premium sneakers, running shoes, basketball kicks, and lifestyle footwear.",
    openGraph: {
      title: "Shop All Products",
      description: "Discover premium footwear for every stride.",
      type: "website",
    },
    alternates: {
      canonical: "/products",
    },
  };
}

export default async function ProductsPage() {
  const products = await getProducts();

  const categories = Array.from(
    new Set(products.map((p) => p.category?.name).filter(Boolean)),
  ) as string[];
  const brands = Array.from(
    new Set(products.map((p) => p.brand).filter(Boolean)),
  ) as string[];
  const maxPrice = Math.max(...products.map((p) => p.price), 10000);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b border-border bg-muted/30">
        <div className="container mx-auto px-4 py-10 md:py-14">
          <h1 className="text-3xl font-bold tracking-tight text-foreground md:text-4xl">
            All Products
          </h1>
          <p className="mt-2 text-muted-foreground">
            Discover our full collection of premium footwear
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col gap-8 md:flex-row">
          <FilterSidebar
            categories={categories}
            brands={brands}
            maxPrice={maxPrice}
          />
          <div className="flex-1 min-w-0">
            <ProductsContent products={products} />
          </div>
        </div>
      </div>
    </div>
  );
}
