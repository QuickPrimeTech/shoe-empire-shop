import { ProductImage } from "@/db/schema";

// The "Raw" shape of the query string
export type RawSearchParams = {
  [key: string]: string | string[] | undefined;
};

/**
 * Generic SearchParams type
 * @template T - The shape of the resolved params. Defaults to RawSearchParams.
 */
export type SearchParams<T = RawSearchParams> = {
  searchParams: Promise<T>;
};

export type NavProducts = {
  id: string;
  name: string;
  slug: string;
  price: number;
  image: ProductImage;
}[];
