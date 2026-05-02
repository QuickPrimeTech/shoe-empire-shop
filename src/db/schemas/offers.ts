// @/db/schemas/offers.ts

import {
  pgTable,
  uuid,
  text,
  integer,
  timestamp,
  boolean,
} from "drizzle-orm/pg-core";
import { products } from "./products";
import { timestamps } from "./common";

export const offers = pgTable("offers", {
  id: uuid("id").primaryKey().defaultRandom(),
  code: text("code").unique(), // e.g., 'EASTER20' or 'NIKE-FLASH'
  description: text("description").notNull(),
  discountType: text("discount_type").notNull(), // 'percentage' or 'fixed_amount'
  discountValue: integer("discount_value").notNull(),
  minOrderAmount: integer("min_order_amount").default(0),
  //Adding productId as a foreign key reference to products table
  productId: uuid("product_id").references(() => products.id, {
    onUpdate: "cascade",
    onDelete: "cascade",
  }),
  // Date-based logic
  startDate: timestamp("start_date", { withTimezone: true }).notNull(),
  endDate: timestamp("end_date", { withTimezone: true }).notNull(),
  isActive: boolean("is_active").default(true),

  //   Timestamps
  ...timestamps,
});

export type InsertOffer = typeof offers.$inferInsert;
export type SelectOffer = typeof offers.$inferSelect;
