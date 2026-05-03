// @/types/product.ts

import { SelectCategory, SelectOffer, SelectProduct } from "@/db/schemas";

export type ProductSize = {
  size: string;
  stock: number;
};

export type ProductWithOffer = SelectProduct & {
  offer: SelectOffer;
  discountedPrice: number;
};

export type ProductWithOptionalOffer = SelectProduct & {
  offer: SelectOffer | null;
  discountedPrice: number | null;
};

export type LimitedProduct = ProductWithOptionalOffer & {
  totalStock: number;
  sizesWithStock: ProductSize[];
};

export type EnrichedProduct = SelectProduct & {
  category: SelectCategory | null;
  offer: SelectOffer | null;
  discountedPrice: number;
  totalStock: number;
  sizesWithStock: ProductSize[];
};
