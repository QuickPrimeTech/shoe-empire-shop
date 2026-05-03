// @/db/functions/category.ts

import { db } from "@/index";
import { categories, products, SelectCategory } from "../schemas";
import { count, eq, sql } from "drizzle-orm";

export async function getCategories(): Promise<SelectCategory[]> {
  const cats = await db.select().from(categories);
  return cats;
}

export async function getCategoriesWithCount() {
  const result = await db
    .select({
      id: categories.id,
      name: categories.name,
      slug: categories.slug,
      image: categories.image,
      productCount: count(products.id),
    })
    .from(categories)
    .leftJoin(products, eq(categories.id, products.categoryId))
    .groupBy(categories.id, categories.name, categories.slug, categories.image)
    .orderBy(sql`${categories.name} asc`);

  return result;
}
