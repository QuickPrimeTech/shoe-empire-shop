// @/app/products/[slug]/page.tsx
import { Metadata } from "next";
import { getProductBySlug, getProductSlugs } from "@/db/functions/product";
import { ProductContent } from "@/sections/products/slug/content";
import { notFound } from "next/navigation";

type PageProps = {
  params: Promise<{
    slug: string;
  }>;
};

// Generate static paths for all products at build time
export async function generateStaticParams() {
  const slugs = await getProductSlugs();

  return slugs.map((slug) => ({
    slug,
  }));
}

// Generate dynamic metadata for each product
export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProductBySlug(slug);

  if (!product) {
    return {
      title: "Product Not Found | Shoe Empire",
      description: "The product you are looking for does not exist.",
    };
  }

  const title = `${product.name} | Shoe Empire`;
  const description = product.description.slice(0, 160);
  const imageUrl = product.images[0]?.url;

  return {
    title,
    description,
    keywords: [
      product.name,
      product.brand,
      "shoes",
      "sneakers",
      product.gender,
    ],
    openGraph: {
      title,
      description,
      type: "website",
      images: imageUrl
        ? [
            {
              url: imageUrl,
              alt: product.images[0]?.altText || product.name,
              width: 1200,
              height: 630,
            },
          ]
        : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: imageUrl ? [imageUrl] : undefined,
    },
    alternates: {
      canonical: `/products/${slug}`,
    },
  };
}

export default async function ProductPage({ params }: PageProps) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);

  if (!product) return notFound();

  return <ProductContent product={product} />;
}
