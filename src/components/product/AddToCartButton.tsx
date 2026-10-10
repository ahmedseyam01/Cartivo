"use client";

import { Loader2, ShoppingBag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCart } from "@/providers/CartProvider";
import { cn } from "@/lib/utils";

export function AddToCartButton({
  productId,
  inStock = true,
  compact = false,
  className,
}: {
  productId: string;
  inStock?: boolean;
  /** Icon-only round button, used on product cards. */
  compact?: boolean;
  className?: string;
}) {
  const { add, pending } = useCart();
  const busy = pending.has(productId);
  const Icon = busy ? Loader2 : ShoppingBag;

  if (compact) {
    return (
      <button
        type="button"
        onClick={() => add(productId)}
        disabled={busy || !inStock}
        aria-label="Add to cart"
        className={cn(
          "bg-foreground text-background inline-flex size-9 shrink-0 items-center justify-center rounded-full transition-transform hover:scale-105 active:scale-95 disabled:opacity-50",
          className,
        )}
      >
        <Icon className={cn("size-4", busy && "animate-spin")} />
      </button>
    );
  }

  return (
    <Button
      size="lg"
      onClick={() => add(productId)}
      disabled={busy || !inStock}
      className={cn("h-12 rounded-full text-base", className)}
    >
      <Icon className={cn("size-5", busy && "animate-spin")} />
      {inStock ? "Add to cart" : "Out of stock"}
    </Button>
  );
}
