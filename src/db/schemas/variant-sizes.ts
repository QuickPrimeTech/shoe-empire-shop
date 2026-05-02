// @/db/schemas/variant-sizes.ts
import { pgTable, uuid, text, integer } from "drizzle-orm/pg-core";
import { timestamps } from "./common";
import { productVariants } from "./product-variants";

// variant-sizes.ts
export const variantSizes = pgTable("variant_sizes", {
  id: uuid("id").primaryKey().defaultRandom(),

  variantId: uuid("variant_id")
    .references(() => productVariants.id, {
      onUpdate: "cascade",
      onDelete: "cascade",
    })
    .notNull(),

  size: text("size").notNull(), // "42"

  price: integer("price").notNull(), // KES
  stock: integer("stock").notNull().default(0),

  ...timestamps,
});
