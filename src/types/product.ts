// @/types/product.ts

import { SelectOffer, SelectProduct } from "@/db/schemas";

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
  sizesWithStock: {
    size: string;
    stock: number;
  }[];
};
