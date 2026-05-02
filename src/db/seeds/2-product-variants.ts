// @/db/seeds/product-variants.ts

import { eq } from "drizzle-orm";
import { db } from "@/index";
import { ProductImage, products } from "@/db/schemas/products";
import { productVariants } from "@/db/schemas/product-variants";

const variantDefinitions = [
  {
    productSlug: "air-jordan-1",
    color: "Charcoal Gray",
    slug: "charcoal-gray",
    images: [
      {
        url: "https://res.cloudinary.com/quick-prime-tech/image/upload/v1777718181/imgi_34_air-jordan-1-low-eastside-golf-dv1759-448-release-date_lq9abc.jpg",
        altText:
          "Side view of the Air Jordan 1 in Charcoal Gray, showcasing its sleek silhouette and visible Air cushioning.",
        isPrimary: true,
      },
      {
        url: "https://res.cloudinary.com/quick-prime-tech/image/upload/v1777718110/imgi_18_air-jordan-1-low-eastside-golf-dv1759-448-release-date_sw3f3z.jpg",
        altText: "Sole view of the Air Jordan 1 in Charcoal Gray.",
        isPrimary: false,
      },
      {
        url: "https://res.cloudinary.com/quick-prime-tech/image/upload/v1777718060/imgi_22_air-jordan-1-low-eastside-golf-dv1759-448-release-date_fydghg.jpg",
        altText:
          "Top view of the Air Jordan 1 in Charcoal Gray, highlighting the lacing system and tongue branding.",
        isPrimary: false,
      },
      {
        url: "https://res.cloudinary.com/quick-prime-tech/image/upload/v1777718213/imgi_30_air-jordan-1-low-eastside-golf-dv1759-448-release-date_hjv2tl.jpg",
        altText:
          "Top view of the Air Jordan 1 in Charcoal Gray, highlighting the lacing system and tongue branding.",
        isPrimary: false,
      },
    ] satisfies ProductImage[],
  },
];

export default async function seed() {
  console.log("👟 Seeding product variants...");
  for (const def of variantDefinitions) {
    // Look up the product by slug
    const product = await db
      .select()
      .from(products)
      .where(eq(products.slug, def.productSlug))
      .limit(1);

    if (!product) {
      console.warn(`Product ${def.productSlug} not found, skipping`);
      continue;
    }

    await db.insert(productVariants).values({
      productId: product[0].id,
      color: def.color,
      slug: def.slug,
      images: def.images,
    });
  }
}
