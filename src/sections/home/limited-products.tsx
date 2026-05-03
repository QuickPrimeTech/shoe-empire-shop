// @/sections/home/limited-products.tsx

import { Button } from "@/components/ui/button";
import { ArrowUpRight } from "lucide-react";
import Link from "next/link";

export const LimitedProducts = () => {
  return (
    <section
      id="latest-products"
      className="py-20 bg-background overflow-hidden"
    >
      <div className="container section mx-auto mb-12">
        <div className="flex justify-between items-center gap-12">
          <div>
            <p className="text-xs font-mono tracking-widest uppercase text-muted-foreground mb-3">
              Soon to be out of stock
            </p>
            <h2 className="font-display text-heading-2 md:text-heading-1 uppercase">
              Limited Products.
            </h2>
          </div>
          <Button className="hidden md:inline-flex" variant={"link"} asChild>
            <Link href={`/collection/limited-products`}>
              View All <ArrowUpRight />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
};
