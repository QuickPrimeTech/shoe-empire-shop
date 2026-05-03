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
