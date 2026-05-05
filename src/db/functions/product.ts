// @/db/functions/product.ts
import { db } from "@/index";
import { products, SelectProduct } from "@/db/schemas/products";
import {
  and,
  asc,
  count,
  desc,
  eq,
  gte,
  ilike,
  inArray,
  lte,
  sql,
} from "drizzle-orm";
import { offers, SelectOffer } from "@/db/schemas/offers";
import {
  EnrichedProduct,
  LimitedProduct,
  ProductWithOptionalOffer,
} from "@/types/product";
import { categories } from "../schemas";
import { cacheLife } from "next/cache";
import { ValidFilters } from "@/lib/filter-schema";

// Add this import at the top of your file
// import { categories } from "@/db/schemas/categories";

export async function getProducts(
  categorySlug?: string,
): Promise<EnrichedProduct[]> {
  "use cache";

  cacheLife({
    revalidate: 6 * 60 * 60,
    stale: 6 * 60 * 60,
    expire: 6 * 60 * 60,
  });

  // 1. Fetch base data with joins
  const query = db
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
        lte(offers.startDate, sql`now()`),
        gte(offers.endDate, sql`now()`),
      ),
    )
    // Join categories (Assuming products table has a categoryId column)
    .leftJoin(categories, eq(products.categoryId, categories.id));

  const rows = categorySlug
    ? await query.where(eq(categories.slug, categorySlug))
    : await query;

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

export async function getPaginatedProducts(
  filters: ValidFilters,
  categorySlug?: string,
): Promise<{
  data: EnrichedProduct[];
  totalPages: number;
  totalCount: number;
}> {
  const { page = 1, limit = 15 } = filters;
  const offset = (page - 1) * limit;

  // Build WHERE conditions
  const conditions = [eq(products.isPublished, true)];

  if (categorySlug) {
    conditions.push(eq(categories.slug, categorySlug));
  }

  if (filters.gender) {
    conditions.push(eq(products.gender, filters.gender));
  }

  if (filters.category) {
    const slugs = filters.category.split(",");
    conditions.push(inArray(categories.slug, slugs));
  }

  if (filters.brand) {
    const brands = filters.brand.split(",");
    if (brands.length === 1) {
      conditions.push(ilike(products.brand, brands[0]));
    } else {
      // Postgres array literal: '{Nike,Adidas,Puma}'
      const arrayLiteral = `{${brands.join(",")}}`;
      conditions.push(sql`${products.brand} ILIKE ANY(${arrayLiteral})`);
    }
  }

  if (filters.minPrice !== undefined && filters.minPrice > 0) {
    conditions.push(gte(products.price, filters.minPrice));
  }
  if (filters.maxPrice !== undefined && filters.maxPrice > 0) {
    conditions.push(lte(products.price, filters.maxPrice));
  }

  if (filters.inStock) {
    conditions.push(
      sql`jsonb_path_exists(${products.sizes}, '$[*] ? (@.stock > 0)')`,
    );
  }

  if (filters.discounted) {
    conditions.push(sql`${offers.id} IS NOT NULL`);
  }

  const whereClause = and(...conditions);

  // Count
  const countResult = await db
    .select({ totalCount: count() })
    .from(products)
    .leftJoin(categories, eq(products.categoryId, categories.id))
    .leftJoin(
      offers,
      and(
        eq(products.id, offers.productId),
        eq(offers.isActive, true),
        lte(offers.startDate, sql`now()`),
        gte(offers.endDate, sql`now()`),
      ),
    )
    .where(whereClause);

  const totalCount = Number(countResult[0]?.totalCount ?? 0);
  const totalPages = Math.ceil(totalCount / limit);

  // Sort order
  let orderBy;
  switch (filters.sort) {
    case "price_asc":
      orderBy = asc(products.price);
      break;
    case "price_desc":
      orderBy = desc(products.price);
      break;
    case "newest":
      orderBy = desc(products.createdAt);
      break;
    default:
      orderBy = desc(products.createdAt);
  }

  // Fetch paginated data
  const rows = await db
    .select({
      product: products,
      offer: offers,
      category: categories,
    })
    .from(products)
    .leftJoin(
      offers,
      and(
        eq(products.id, offers.productId),
        eq(offers.isActive, true),
        lte(offers.startDate, sql`now()`),
        gte(offers.endDate, sql`now()`),
      ),
    )
    .leftJoin(categories, eq(products.categoryId, categories.id))
    .where(whereClause)
    .orderBy(orderBy)
    .limit(limit)
    .offset(offset);

  const data = rows.map(({ product, offer, category }) => {
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

  return { data, totalPages, totalCount };
}

export async function getSimilarProducts(
  productSlug: string,
): Promise<ProductWithOptionalOffer[]> {
  // 1. Get the reference product first to know its category, brand, and gender
  const baseProductRows = await db
    .select()
    .from(products)
    .where(eq(products.slug, productSlug))
    .limit(1);

  if (!baseProductRows.length) return [];

  const baseProduct = baseProductRows[0];
  const limit = 8;
  const excludedIds = new Set<string>([baseProduct.id]);
  const similarProducts: any[] = [];

  // Helper to fetch and deduplicate
  async function fetchAndAdd(condition: any) {
    if (similarProducts.length >= limit) return;

    const remaining = limit - similarProducts.length;
    const results = await db
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
          lte(offers.startDate, sql`now()`),
          gte(offers.endDate, sql`now()`),
        ),
      )
      .where(
        and(
          condition,
          eq(products.isPublished, true),
          sql`${products.id} NOT IN (${sql.join(
            Array.from(excludedIds).map((id) => sql`${id}`),
            sql`, `,
          )})`,
        ),
      )
      .limit(remaining);

    for (const row of results) {
      if (!excludedIds.has(row.product.id)) {
        excludedIds.add(row.product.id);
        similarProducts.push({
          ...row.product,
          offer: row.offer,
          discountedPrice: getDiscountedPrice(row.product.price, row.offer),
        });
      }
    }
  }

  // Pass 1: Same Category
  if (baseProduct.categoryId) {
    await fetchAndAdd(eq(products.categoryId, baseProduct.categoryId));
  }

  // Pass 2: Same Brand (if limit not reached)
  if (similarProducts.length < limit) {
    await fetchAndAdd(eq(products.brand, baseProduct.brand));
  }

  // Pass 3: Same Gender (if limit still not reached)
  if (similarProducts.length < limit) {
    await fetchAndAdd(eq(products.gender, baseProduct.gender));
  }

  return similarProducts;
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
        lte(offers.startDate, sql`now()`),
        gte(offers.endDate, sql`now()`),
      ),
    )
    .where(gte(products.createdAt, sql`now() - interval '30 days'`))
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
        lte(offers.startDate, sql`now()`),
        gte(offers.endDate, sql`now()`),
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
        lte(offers.startDate, sql`now()`),
        gte(offers.endDate, sql`now()`),
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
        lte(offers.startDate, sql`now()`),
        gte(offers.endDate, sql`now()`),
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
