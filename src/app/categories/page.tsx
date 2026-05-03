// @/app/categories/page.tsx
import Link from "next/link";
import { getCategoriesWithCount } from "@/db/functions/category";
import type { Metadata } from "next";
import { Hero } from "@/sections/categories/hero";
import { CategoryCard } from "@/sections/categories/category-card";

export async function generateMetadata(): Promise<Metadata> {
  const categoriesData = await getCategoriesWithCount();

  return {
    title: `Browse ${categoriesData.length} Categories | Our Store`,
    description: `Explore ${categoriesData.length} curated product categories. Find the perfect items across ${categoriesData.map((c) => c.name).join(", ")}.`,
    keywords: [
      "categories",
      "shop",
      "products",
      ...categoriesData.map((c) => c.name.toLowerCase()),
    ],
    openGraph: {
      title: "Browse All Categories",
      description: `Discover ${categoriesData.length} curated collections.`,
      type: "website",
      url: "/categories",
    },
    twitter: {
      card: "summary_large_image",
      title: "Browse All Categories",
      description: `Discover ${categoriesData.length} curated collections.`,
    },
    alternates: {
      canonical: "/categories",
    },
  };
}

export default async function CategoriesPage() {
  const categoriesData = await getCategoriesWithCount();

  return (
    <div className="min-h-screen bg-background">
      <Hero />
      {/* Categories Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        {categoriesData.length === 0 ? (
          <div className="text-center py-24">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-muted mb-4">
              <svg
                className="w-8 h-8 text-muted-foreground"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-foreground mb-2">
              No categories yet
            </h3>
            <p className="text-muted-foreground">
              Check back soon for new collections.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
            {categoriesData.map((category) => (
              <CategoryCard key={category.id} category={category} />
            ))}
          </div>
        )}
      </div>

      {/* Bottom CTA */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <div className="relative rounded-2xl bg-primary overflow-hidden">
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmZmZmYiIGZpbGwtb3BhY2l0eT0iMC4xIj48cGF0aCBkPSJNMzYgMzRoLTJ2LTRoMnY0em0wLTZ2LTRoLTJ2NGgyem0tNiA2aC00djJoNHYtMnptMC02di00aC00djRoNHptLTYgNmgtNHYyaDR2LTJ6bTAtNnYtNGgtNHY0aDR6Ii8+PC9nPjwvZz48L3N2Zz4=')] opacity-50" />
          <div className="relative px-6 py-12 sm:px-12 sm:py-16 text-center">
            <h2 className="text-2xl sm:text-3xl font-bold text-primary-foreground mb-4">
              Can&apos;t find what you&apos;re looking for?
            </h2>
            <p className="text-primary-foreground/80 mb-8 max-w-xl mx-auto">
              Browse our full catalog to discover even more amazing products
              across all categories.
            </p>
            <Link
              href="/products"
              className="inline-flex items-center px-6 py-3 rounded-full bg-background text-primary font-semibold hover:bg-background/90 transition-colors duration-200 shadow-lg"
            >
              View All Products
              <svg
                className="ml-2 w-4 h-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17 8l4 4m0 0l-4 4m4-4H3"
                />
              </svg>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
