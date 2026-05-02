// @/db/schemas/payments.ts
import { pgTable, text, uuid } from "drizzle-orm/pg-core";
import { orders } from "./orders";
import { timestamps } from "./common";

export const payments = pgTable("payments", {
  id: uuid("id").primaryKey().defaultRandom(),
  orderId: uuid("order_id")
    .references(() => orders.id, {
      onUpdate: "cascade",
      onDelete: "cascade",
    })
    .notNull(),
  status: text("status").notNull().default("pending"),
  method: text("method").notNull().default("mpesa"),
  mpesaCode: text("mpesa_code").unique(), // The Safaricom Ref (e.g., RCK4...
  //   Timestamps
  ...timestamps,
});

//Exporting types for TypeScript
export type InsertPayment = typeof payments.$inferInsert;
export type SelectPayment = typeof payments.$inferSelect;
