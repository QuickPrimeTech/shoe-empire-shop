// @/db/seeds/variant-sizes.ts

import { eq, and } from "drizzle-orm";
import { db } from "@/index";
import { products } from "@/db/schemas/products";
import { productVariants } from "@/db/schemas/product-variants";
import { variantSizes } from "@/db/schemas/variant-sizes";

// Define which sizes and stock/prices each variant gets
const sizeDefinitions: {
  productSlug: string;
  color: string;
  sizes: { size: string; price: number; stock: number }[];
}[] = [
  // Empire Air Max - Black
  {
    productSlug: "air-jordan-1",
    color: "Charcoal Gray",
    sizes: [
      { size: "40", price: 4500, stock: 12 },
      { size: "41", price: 4500, stock: 15 },
      { size: "42", price: 4500, stock: 20 },
      { size: "43", price: 4500, stock: 18 },
      { size: "44", price: 4500, stock: 10 },
      { size: "45", price: 4800, stock: 5 },
    ],
  },
];

export default async function seed() {
  console.log("📏 Seeding variant sizes...");

  for (const def of sizeDefinitions) {
    // Find the product first
    const product = await db
      .select()
      .from(products)
      .where(eq(products.slug, def.productSlug))
      .limit(1);

    if (!product[0]) {
      console.warn(`⚠️ Product ${def.productSlug} not found, skipping`);
      continue;
    }

    // Find the specific variant by productId + color
    const variant = await db
      .select()
      .from(productVariants)
      .where(
        and(
          eq(productVariants.productId, product[0].id),
          eq(productVariants.color, def.color),
        ),
      )
      .limit(1);

    if (!variant[0]) {
      console.warn(
        `⚠️ Variant ${def.color} for ${def.productSlug} not found, skipping`,
      );
      continue;
    }

    // Insert all sizes for this variant
    const sizesToInsert = def.sizes.map((s) => ({
      variantId: variant[0].id,
      size: s.size,
      price: s.price,
      stock: s.stock,
    }));

    await db.insert(variantSizes).values(sizesToInsert);

    console.log(
      `✅ Inserted ${sizesToInsert.length} sizes for ${def.productSlug} (${def.color})`,
    );
  }

  console.log("✅ Variant sizes seeded successfully!");
}
