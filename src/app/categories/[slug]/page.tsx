// @/app/categories/[slug]/page.tsx

import { getCategories, getCategoryFromSlug } from "@/db/functions/category";
import { Metadata } from "next";

export async function generateStaticParams() {
  const categories = await getCategories();

  return categories.map((cat) => ({
    slug: cat.slug,
  }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const category = await getCategoryFromSlug(slug);

  if (!category) {
    return {
      title: "Category Not Found",
    };
  }

  return {
    title: `${category.name}`,
    description: `Shop the latest ${category.name} collection. Find top styles, great prices, and exclusive deals.`,
    openGraph: {
      title: category.name,
      description: `Browse ${category.name} products`,
      images: category.image ? [category.image] : [],
    },
  };
}

type CategoryParams = {
  slug: string;
};
export default async function Category({
  params,
}: {
  params: Promise<CategoryParams>;
}) {
  const { slug } = await params;
  return <h1 className="text-heading-1">Welcome to the category: {slug}</h1>;
}
