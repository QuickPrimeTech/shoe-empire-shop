// @/db/functions/category.ts

import { db } from "@/index";
import { categories, SelectCategory } from "../schemas";

export async function getCategories(): Promise<SelectCategory[]> {
  const cats = await db.select().from(categories);
  return cats;
}
