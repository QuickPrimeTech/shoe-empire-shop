// @/db/schemas/products.ts
import { pgTable, uuid, text, boolean } from "drizzle-orm/pg-core";
import { categories } from "./categories";
import { timestamps } from "./common";

// TypeScript interfaces for our JSONB columns
export type ProductImage = {
  url: string;
  altText: string;
  isPrimary: boolean;
};

export const products = pgTable("products", {
  // Core Identifiers
  id: uuid("id").primaryKey().defaultRandom(),
  name: text("name").notNull(),
  slug: text("slug").notNull().unique(),

  // Details
  description: text("description").notNull(),
  brand: text("brand").notNull(),

  //Adding categoryId as a foreign key reference to categories table
  categoryId: uuid("category_id").references(() => categories.id, {
    onUpdate: "cascade",
    onDelete: "set null",
  }),

  // Storing Ksh as an integer to avoid floating-point math errors
  isPublished: boolean("is_published").notNull().default(true),

  ...timestamps,
});

export type InsertProduct = typeof products.$inferInsert;
export type SelectProduct = typeof products.$inferSelect;
