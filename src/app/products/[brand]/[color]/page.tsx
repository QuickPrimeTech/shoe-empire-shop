// @/app/products/[brand]/[color]/page.tsx

import { db } from "@/index";
import { products } from "@/db/schemas/products";
import { eq } from "drizzle-orm";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { ProductContent } from "@/sections/products/slug/content";

type PageProps = {
  params: Promise<{ slug: string }>;
};

/* -------------------------------------------------------------------------- */
/*                               STATIC PARAMS                                */
/* -------------------------------------------------------------------------- */

export async function generateStaticParams() {
  const rows = await db
    .select({ slug: products.slug })
    .from(products)
    .where(eq(products.isPublished, true));

  return rows.map((row) => ({
    slug: row.slug,
  }));
}

// Allow on-demand generation for products created after build time
export const dynamicParams = true;

/* -------------------------------------------------------------------------- */
/*                                 METADATA                                   */
/* -------------------------------------------------------------------------- */

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;

  const row = await db
    .select({
      name: products.name,
      description: products.description,
      images: products.images,
      brand: products.brand,
    })
    .from(products)
    .where(eq(products.slug, slug))
    .limit(1);

  const product = row[0];

  if (!product) {
    return { title: "Product Not Found" };
  }

  const primaryImage = product.images?.find((img) => img.isPrimary)?.url;

  return {
    title: `${product.name} | ${product.brand ?? "Store"}`,
    description: product.description ?? undefined,
    openGraph: primaryImage
      ? {
          images: [{ url: primaryImage, alt: product.name }],
        }
      : undefined,
  };
}

/* -------------------------------------------------------------------------- */
/*                                   PAGE                                     */
/* -------------------------------------------------------------------------- */

export default async function ProductPage({ params }: PageProps) {
  const { slug } = await params;

  const row = await db
    .select()
    .from(products)
    .where(eq(products.slug, slug))
    .limit(1);

  const product = row[0];

  if (!product) notFound();

  return <ProductContent product={product} />;
}
