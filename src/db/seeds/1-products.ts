// @/db/seeds/products.ts

import { db } from "@/index"; // Path to your drizzle db instance
import { InsertProduct, products } from "@/db/schemas"; // Import the products schema

const seedShoes: InsertProduct[] = [
  {
    name: "Air Jordan 1",
    slug: "air-jordan-1",
    description:
      "The Air Jordan 1 is the iconic sneaker that started it all. Premium leather upper and the iconic Wings logo.",
    brand: "Nike",
  },
];

export default async function seed() {
  console.log("👟 Seeding Shoe Empire products...");
  try {
    await db.insert(products).values(seedShoes);
    console.log("✅ Seeding completed successfully!");
  } catch (error) {
    console.error("❌ Seeding failed:", error);
  }
}
