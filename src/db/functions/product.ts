// @/db/functions/product.ts
import { db } from "@/index";
import { products, SelectProduct } from "@/db/schemas/products";
import { and, desc, eq, gte, lte } from "drizzle-orm";
import { offers, SelectOffer } from "@/db/schemas/offers";
import {
  EnrichedProduct,
  LimitedProduct,
  ProductWithOptionalOffer,
} from "@/types/product";
import { categories } from "../schemas";

// Add this import at the top of your file
// import { categories } from "@/db/schemas/categories";

export async function getProducts(): Promise<EnrichedProduct[]> {
  const now = new Date();

  // 1. Fetch base data with joins
  const rows = await db
    .select({
      product: products,
      offer: offers,
      category: categories, // Ensure categories is imported
    })
    .from(products)
    // Join active offers
    .leftJoin(
      offers,
      and(
        eq(products.id, offers.productId),
        eq(offers.isActive, true),
        lte(offers.startDate, now),
        gte(offers.endDate, now),
      ),
    )
    // Join categories (Assuming products table has a categoryId column)
    .leftJoin(categories, eq(products.categoryId, categories.id));

  // 2. Map and enrich the data
  return rows.map(({ product, offer, category }) => {
    // Calculate stock size based on the pattern used in getLimitedProducts
    const sizes = product.sizes ?? [];
    const totalStock = sizes.reduce((sum, s) => sum + (s.stock ?? 0), 0);

    return {
      ...product,
      category: category ?? null,
      offer: offer ?? null,
      discountedPrice: getDiscountedPrice(product.price, offer),
      totalStock,
      sizesWithStock: sizes,
    };
  });
}

export function getDiscountedPrice(price: number, offer?: SelectOffer | null) {
  if (!offer) return price;

  const discounted =
    offer.discountType === "percentage"
      ? price - (price * offer.discountValue) / 100
      : price - offer.discountValue;

  return Math.max(discounted, 0);
}

export async function getLatestProducts(): Promise<ProductWithOptionalOffer[]> {
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

  const now = new Date();

  const rows = await db
    .select({
      product: products,
      offer: offers,
    })
    .from(products)
    .leftJoin(
      offers,
      and(
        eq(products.id, offers.productId),
        eq(offers.isActive, true),
        lte(offers.startDate, now),
        gte(offers.endDate, now),
      ),
    )
    .where(gte(products.createdAt, thirtyDaysAgo))
    .orderBy(desc(products.createdAt))
    .limit(8);

  return rows.map(({ product, offer }) => {
    return {
      ...product,
      offer,
      discountedPrice: getDiscountedPrice(product.price, offer),
    };
  });
}

export async function getDiscountedProducts() {
  const now = new Date();

  const rows = await db
    .select({
      product: products,
      offer: offers,
    })
    .from(products)
    .innerJoin(offers, eq(products.id, offers.productId))
    .where(
      and(
        eq(offers.isActive, true),
        lte(offers.startDate, now),
        gte(offers.endDate, now),
      ),
    )
    .limit(8);

  return rows.map(({ product, offer }) => {
    let discountedPrice = product.price;

    if (offer.discountType === "percentage") {
      discountedPrice =
        product.price - (product.price * offer.discountValue) / 100;
    }

    if (offer.discountType === "fixed_amount") {
      discountedPrice = product.price - offer.discountValue;
    }

    return {
      ...product,
      offer,
      discountedPrice: Math.max(discountedPrice, 0), // safety
    };
  });
}

export async function getProductSlugs(): Promise<SelectProduct["slug"][]> {
  // 1. Fetch base data
  const rows = await db.select({ slug: products.slug }).from(products);
  return rows.map((row) => row.slug);
}

export async function getProductBySlug(
  slug: string,
): Promise<ProductWithOptionalOffer | null> {
  const now = new Date();

  const rows = await db
    .select({
      product: products,
      offer: offers,
    })
    .from(products)
    .leftJoin(
      offers,
      and(
        eq(products.id, offers.productId),
        eq(offers.isActive, true),
        lte(offers.startDate, now),
        gte(offers.endDate, now),
      ),
    )
    .where(eq(products.slug, slug))
    .limit(1);

  if (!rows.length) return null;

  const { product, offer } = rows[0];

  return {
    ...product,
    offer,
    discountedPrice: getDiscountedPrice(product.price, offer),
  };
}

export async function getLimitedProducts(): Promise<LimitedProduct[]> {
  const now = new Date();

  const rows = await db
    .select({
      product: products,
      offer: offers,
    })
    .from(products)
    .leftJoin(
      offers,
      and(
        eq(products.id, offers.productId),
        eq(offers.isActive, true),
        lte(offers.startDate, now),
        gte(offers.endDate, now),
      ),
    )
    .limit(8);

  const grouped = new Map<string, LimitedProduct>();

  for (const row of rows) {
    const { product, offer } = row;

    const sizes = product.sizes ?? [];

    const totalStock = sizes.reduce((sum, s) => sum + (s.stock ?? 0), 0);

    const enriched: LimitedProduct = {
      ...product,
      offer: offer ?? null,
      discountedPrice: getDiscountedPrice(product.price, offer),
      totalStock,
      sizesWithStock: sizes,
    };

    grouped.set(product.id, enriched);
  }

  return Array.from(grouped.values()).filter(
    (product) => product.totalStock < 10,
  );
}
