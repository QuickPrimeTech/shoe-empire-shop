// @/app/products/page.tsx
import { Metadata } from "next";
import { getProducts } from "@/db/functions/product";
import { FilterSidebar } from "@/components/filters/filter-sidebar";

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

  return (
    <div className="min-h-screen flex w-full">
      <FilterSidebar products={products} />
      <div className="min-h-[200vh] bg-muted/30 flex-1">Content</div>
    </div>
  );
}
