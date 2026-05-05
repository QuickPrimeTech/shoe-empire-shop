// @/sections/checkout/empty-state.tsx

import { Button } from "@/components/ui/button";
import { ShoppingBag } from "lucide-react";
import Link from "next/link";

export const EmptyState = () => {
  return (
    <div className="text-center py-20">
      <div className="w-20 h-20 rounded-full bg-muted flex items-center justify-center mx-auto mb-6">
        <ShoppingBag className="size-8" />
      </div>
      <h2 className="text-xl font-800 text-foreground mb-2">
        Your cart is empty
      </h2>
      <p className="text-sm text-muted-foreground mb-6">
        Add some fresh products to get started
      </p>
      <Button size={"xl"} asChild>
        <Link href="/products">Shop Products</Link>
      </Button>
    </div>
  );
};
