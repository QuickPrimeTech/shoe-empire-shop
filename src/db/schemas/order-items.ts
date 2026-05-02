// @/db/schemas/order-items.ts
import { pgTable, uuid, text, integer } from "drizzle-orm/pg-core";
import { orders } from "./orders";
import { products } from "./products";
import { timestamps } from "./common";

export const orderItems = pgTable("order_items", {
  id: uuid("id").primaryKey().defaultRandom(),
  orderId: uuid("order_id")
    .references(() => orders.id)
    .notNull(),
  productId: uuid("product_id")
    .references(() => products.id, {
      onUpdate: "no action",
      onDelete: "no action",
    })
    .notNull(),

  // Snapshots (We save these in case the product price or name changes later)
  quantity: integer("quantity").notNull().default(1),
  priceAtPurchase: integer("price_at_purchase").notNull(), // Price in Ksh

  // Specifics of the shoe bought
  selectedSize: text("selected_size").notNull(),
  selectedColor: text("selected_color"),
  ...timestamps,
});
