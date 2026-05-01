// @/data/products.ts

import product1 from "@/assets/product-1.png";
import product2 from "@/assets/product-2.png";
import product3 from "@/assets/product-3.png";
import product4 from "@/assets/product-4.png";
import catBasketball from "@/assets/cat-basketball.png";
import catRunning from "@/assets/cat-running.png";
import catLifestyle from "@/assets/cat-lifestyle.png";
import catTraining from "@/assets/cat-training.png";

export const products = [
  {
    id: "se-001",
    name: "Empire Air Max",
    category: "Lifestyle",
    price: 189,
    image: product1,
    color: "White / Pure",
  },
  {
    id: "se-002",
    name: "Empire Court 1",
    category: "Basketball",
    price: 249,
    image: product2,
    color: "Black / Crimson",
  },
  {
    id: "se-003",
    name: "Empire Volt Knit",
    category: "Running",
    price: 219,
    image: product3,
    color: "Volt / Knit",
  },
  {
    id: "se-004",
    name: "Empire Bold 90",
    category: "Lifestyle",
    price: 169,
    image: product4,
    color: "Sand / Cream",
  },
] as const;

export const categories = [
  {
    name: "Basketball",
    image: catBasketball,
    span: "lg:col-span-2 lg:row-span-2",
  },
  { name: "Running", image: catRunning, span: "" },
  { name: "Lifestyle", image: catLifestyle, span: "" },
  { name: "Training", image: catTraining, span: "lg:col-span-2" },
];
