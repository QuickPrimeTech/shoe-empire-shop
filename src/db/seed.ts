// @/db/seed/products.ts

import { db } from "@/index"; // Path to your drizzle db instance
import { products } from "@/db/schemas"; // Import the products schema

const seedShoes = [
  {
    name: "Nike Air Max 270",
    slug: "nike-air-max-270-black",
    description:
      "The Nike Air Max 270 delivers visible cushioning under every step. Updated for modern comfort, it nods to the original 1991 Air Max 180.",
    brand: "Nike",
    price: 18500, // Price in Ksh
    stockQuantity: 15,
    isPublished: true,
    colors: ["Black", "White", "Anthracite"],
    availableSizes: ["40", "41", "42", "43", "44"],
    images: [
      {
        url: "https://images.unsplash.com/photo-1542291026-7eec264c27ff",
        altText: "Red Nike Running Shoe",
        isPrimary: true,
      },
    ],
  },
  {
    name: "Jordan 1 Retro High",
    slug: "jordan-1-retro-high-og",
    description:
      "The classic sneaker that started it all. Premium leather upper and the iconic Wings logo.",
    brand: "Jordan",
    price: 24000,
    stockQuantity: 8,
    isPublished: true,
    colors: ["Chicago Red", "Black Toe"],
    availableSizes: ["41", "42", "43", "44", "45"],
    images: [
      {
        url: "https://images.unsplash.com/photo-1597043530274-0579730596fc",
        altText: "Blue Jordan 1 Sneakers",
        isPrimary: true,
      },
    ],
  },
  {
    name: "Adidas Ultraboost 5.0",
    slug: "adidas-ultraboost-5-black",
    description:
      "Energy return like no other. The Ultraboost features a Primeknit upper and Boost midsole for maximum comfort.",
    brand: "Adidas",
    price: 16500,
    stockQuantity: 20,
    isPublished: true,
    colors: ["Core Black", "Cloud White"],
    availableSizes: ["39", "40", "41", "42", "43"],
    images: [
      {
        url: "https://images.unsplash.com/photo-1587563871167-1ee9c731aefb",
        altText: "White Adidas Sneakers",
        isPrimary: true,
      },
    ],
  },
];

export async function main() {
  console.log("👟 Seeding Shoe Empire products...");
  try {
    await db.insert(products).values(seedShoes);
    console.log("✅ Seeding completed successfully!");
  } catch (error) {
    console.error("❌ Seeding failed:", error);
  }
  process.exit(0);
}

main();
