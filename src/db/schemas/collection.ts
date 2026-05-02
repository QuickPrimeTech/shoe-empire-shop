// @/db/schemas/collection.ts

import { pgTable, uuid, text } from "drizzle-orm/pg-core";
import { timestamps } from "./common";

export const collection = pgTable("collection", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: text("name").notNull(), // e.g., 'Summer Drop'
  slug: text("slug").notNull().unique(),
  image: text("image_url"),
  ...timestamps,
});

export type InsertCategory = typeof collection.$inferInsert;
export type SelectCategory = typeof collection.$inferSelect;
