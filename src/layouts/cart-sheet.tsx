// @/layouts/cart-sheet.tsx

"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X, Minus, Plus, ShoppingBag, ArrowRight } from "lucide-react";
import { useCart } from "@/store/cart";
import { toast } from "sonner";

const FREE_SHIP = 200;

export const CartSheet = () => {
  const { isOpen, close, items, inc, dec, remove, total } = useCart();
  const subtotal = total();
  const progress = Math.min(100, (subtotal / FREE_SHIP) * 100);
  const remaining = Math.max(0, FREE_SHIP - subtotal);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={close}
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
          />
          <motion.aside
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 32, stiffness: 280 }}
            className="fixed top-0 right-0 z-50 h-full w-full max-w-md bg-background border-l border-border flex flex-col"
          >
            <div className="flex items-center justify-between p-6 border-b border-border">
              <h2 className="font-display text-xl uppercase">
                Your Bag ({items.length})
              </h2>
              <button
                onClick={close}
                className="p-2 hover:bg-secondary rounded-full"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Free ship */}
            <div className="px-6 py-4 border-b border-border bg-secondary/40">
              <p className="text-xs mb-2">
                {remaining > 0 ? (
                  <>
                    Add <span className="font-bold">${remaining}</span> more for
                    free shipping
                  </>
                ) : (
                  <span className="text-accent-foreground font-bold">
                    🎉 You unlocked free shipping!
                  </span>
                )}
              </p>
              <div className="h-1 bg-border rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-accent"
                  initial={{ width: 0 }}
                  animate={{ width: `${progress}%` }}
                  transition={{ duration: 0.6 }}
                />
              </div>
            </div>

            <div className="flex-1 overflow-y-auto">
              {items.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center p-8 text-center">
                  <div className="h-24 w-24 rounded-full bg-secondary flex items-center justify-center mb-6">
                    <ShoppingBag className="h-10 w-10 text-muted-foreground" />
                  </div>
                  <h3 className="font-display text-2xl uppercase mb-2">
                    Bag is empty
                  </h3>
                  <p className="text-sm text-muted-foreground mb-6">
                    Time to make some moves.
                  </p>
                  <button
                    onClick={close}
                    className="bg-foreground text-background px-6 py-3 rounded-full text-sm uppercase tracking-wider font-bold hover:bg-accent hover:text-accent-foreground transition"
                  >
                    Continue Shopping
                  </button>
                </div>
              ) : (
                <ul className="divide-y divide-border">
                  {items.map((it) => (
                    <li key={`${it.id}-${it.size}`} className="p-6 flex gap-4">
                      <div className="h-24 w-24 rounded bg-muted overflow-hidden shrink-0">
                        <img
                          src={it.image}
                          alt={it.name}
                          className="h-full w-full object-cover"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between gap-2">
                          <h4 className="font-semibold truncate">{it.name}</h4>
                          <p className="font-display">${it.price * it.qty}</p>
                        </div>
                        <p className="text-xs text-muted-foreground mt-0.5">
                          {it.color} · Size {it.size}
                        </p>
                        <div className="flex items-center justify-between mt-3">
                          <div className="flex items-center border border-border rounded-full">
                            <button
                              onClick={() => dec(it.id, it.size)}
                              className="p-1.5 hover:bg-secondary rounded-l-full"
                            >
                              <Minus className="h-3 w-3" />
                            </button>
                            <span className="px-3 text-sm font-medium">
                              {it.qty}
                            </span>
                            <button
                              onClick={() => inc(it.id, it.size)}
                              className="p-1.5 hover:bg-secondary rounded-r-full"
                            >
                              <Plus className="h-3 w-3" />
                            </button>
                          </div>
                          <button
                            onClick={() => {
                              remove(it.id, it.size);
                              toast("Removed from bag");
                            }}
                            className="text-xs text-muted-foreground hover:text-destructive uppercase tracking-wider"
                          >
                            Remove
                          </button>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {items.length > 0 && (
              <div className="border-t border-border p-6 space-y-4">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span className="font-display text-lg">
                    ${subtotal.toFixed(2)}
                  </span>
                </div>
                <button
                  onClick={() => toast.success("Heading to checkout...")}
                  className="w-full bg-foreground text-background py-4 rounded-full font-bold uppercase tracking-wider text-sm flex items-center justify-center gap-2 hover:bg-accent hover:text-accent-foreground transition group"
                >
                  Checkout{" "}
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </button>
                <p className="text-xs text-center text-muted-foreground">
                  Secure checkout · Free returns within 30 days
                </p>
              </div>
            )}
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
};
