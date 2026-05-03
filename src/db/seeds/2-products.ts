// @/db/seeds/products.ts

import { db } from "@/index"; // Path to your drizzle db instance
import { categories, InsertProduct, products } from "@/db/schemas"; // Import the products schema

const seedShoes: (InsertProduct & { categorySlug: string })[] = [
  {
    name: "Air Jordan 1 Charcoal Gray",
    slug: "air-jordan-1-charcoal-gray",
    price: 4500,
    categorySlug: "basketball-shoes",
    description:
      "The Air Jordan 1 is the iconic sneaker that started it all. Premium leather upper and the iconic Wings logo.",
    brand: "Nike",
    images: [
      {
        url: "https://res.cloudinary.com/quick-prime-tech/image/upload/v1777718181/imgi_34_air-jordan-1-low-eastside-golf-dv1759-448-release-date_lq9abc.jpg",
        altText:
          "Side view of the Air Jordan 1 in Charcoal Gray, showcasing its sleek silhouette and visible Air cushioning.",
      },
      {
        url: "https://res.cloudinary.com/quick-prime-tech/image/upload/v1777718110/imgi_18_air-jordan-1-low-eastside-golf-dv1759-448-release-date_sw3f3z.jpg",
        altText: "Sole view of the Air Jordan 1 in Charcoal Gray.",
      },
      {
        url: "https://res.cloudinary.com/quick-prime-tech/image/upload/v1777718060/imgi_22_air-jordan-1-low-eastside-golf-dv1759-448-release-date_fydghg.jpg",
        altText:
          "Top view of the Air Jordan 1 in Charcoal Gray, highlighting the lacing system and tongue branding.",
      },
      {
        url: "https://res.cloudinary.com/quick-prime-tech/image/upload/v1777718213/imgi_30_air-jordan-1-low-eastside-golf-dv1759-448-release-date_hjv2tl.jpg",
        altText:
          "Top view of the Air Jordan 1 in Charcoal Gray, highlighting the lacing system and tongue branding.",
      },
    ],
    sizes: [
      {
        size: "40",
        stock: 2,
      },
      {
        size: "39",
        stock: 7,
      },
    ],
    gender: "men",
  },
  {
    name: "Air Jordan 1 Obsidian",
    slug: "air-jordan-1-obsidian",
    price: 4500,
    description:
      "The Air Jordan 1 is the iconic sneaker that started it all. Premium leather upper and the iconic Wings logo.",
    brand: "Nike",
    categorySlug: "basketball-shoes",
    images: [
      {
        url: "https://res.cloudinary.com/quick-prime-tech/image/upload/v1777726051/imgi_36_UNCLow2_oq7few.jpg",
        altText: "Side view of the Air Jordan 1 in Obsidian colour",
      },
      {
        url: "https://res.cloudinary.com/quick-prime-tech/image/upload/v1777726096/imgi_35_UNCLow_fu7yd5.jpg",
        altText: "Sole view of the Air Jordan 1 in Obsidian colour.",
      },
      {
        url: "https://res.cloudinary.com/quick-prime-tech/image/upload/v1777726119/imgi_37_UNCLow3_u30qth.jpg",
        altText: "Bottom view of the Air Jordan 1 in Obsidian colour",
      },
    ],
    sizes: [
      {
        size: "40",
        stock: 2,
      },
      {
        size: "39",
        stock: 7,
      },
    ],
    gender: "men",
  },
];

export default async function seed() {
  console.log("🌱 Seeding products...");

  try {
    await db.delete(products);

    // 1. Fetch all categories
    const allCategories = await db.select().from(categories);

    // 2. Create lookup map
    const categoryMap = new Map(allCategories.map((cat) => [cat.slug, cat.id]));

    // 3. Transform products
    const finalProducts: InsertProduct[] = seedShoes.map(
      ({ categorySlug, ...product }) => {
        const categoryId = categoryMap.get(categorySlug);

        if (!categoryId) {
          throw new Error(`❌ Category not found for slug: ${categorySlug}`);
        }

        return {
          ...product,
          categoryId,
        };
      },
    );

    // 4. Insert
    await db.insert(products).values(finalProducts);

    console.log("✅ Products seeded");
  } catch (error) {
    console.error("❌ Product seed failed:", error);
  }
}
