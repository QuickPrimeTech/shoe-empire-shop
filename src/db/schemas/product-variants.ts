// @/db/schemas/product-variants.ts
import { pgTable, uuid, text, jsonb, boolean } from "drizzle-orm/pg-core";
import { ProductImage, products } from "./products";
import { timestamps } from "./common";

// product-variants.ts
export const productVariants = pgTable("product_variants", {
  id: uuid("id").primaryKey().defaultRandom(),

  productId: uuid("product_id")
    .references(() => products.id, {
      onDelete: "cascade",
      onUpdate: "cascade",
    })
    .notNull(),

  color: text("color").notNull(), // "Black"

  slug: text("slug").notNull(), // "black"

  // Important: unique per product
  // (jordan-4 + black must be unique)

  images: jsonb("images").$type<ProductImage[]>().notNull().default([]),

  isDefault: boolean("is_default").default(false),

  ...timestamps,
});
