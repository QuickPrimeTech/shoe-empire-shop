// @/db/seeds/category.ts
import { db } from "@/index";
import { categories } from "@/db/schemas";

const seedCategories = [
  {
    name: "Running Shoes",
    slug: "running-shoes",
    image:
      "https://res.cloudinary.com/quick-prime-tech/image/upload/v1777786966/running-shoes_xjboxk.png",
  },
  {
    name: "Basketball Shoes",
    slug: "basketball-shoes",
    image:
      "https://res.cloudinary.com/quick-prime-tech/image/upload/v1777786965/basketball-shoes_x9vap4.png",
  },
  {
    name: "Training Shoes",
    slug: "training-shoes",
    image:
      "https://res.cloudinary.com/quick-prime-tech/image/upload/v1777786965/training-shoes_toscdy.png",
  },
  {
    name: "Lifestyle",
    slug: "lifestyle",
    image:
      "https://res.cloudinary.com/quick-prime-tech/image/upload/v1777786965/ifestyle-shoes_ddz061.png",
  },
];

export default async function seed() {
  console.log("Starting Seeding Shoe Empire categories...");
  try {
    console.log("Clearing existing categories...");
    await db.delete(categories);
    console.log("Inserting new categories...");
    await db.insert(categories).values(seedCategories);
    console.log("✅ Category seeding completed successfully!");
  } catch (error) {
    console.error("❌ Category seeding failed:", error);
    throw error;
  }
}
