"use client";

import { useState } from "react";
import { Loader2, ShoppingBag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useI18n } from "@/i18n/I18nProvider";
import { useCart } from "@/providers/CartProvider";
import { cn } from "@/lib/utils";
import { QuantityStepper } from "./QuantityStepper";

/** Round icon button used on product cards. */
export function AddToCartButton({
  productId,
  inStock = true,
  className,
}: {
  productId: string;
  inStock?: boolean;
  className?: string;
}) {
  const { t } = useI18n();
  const { add, pending } = useCart();
  const busy = pending.has(productId);
  const Icon = busy ? Loader2 : ShoppingBag;

  return (
    <button
      type="button"
      onClick={() => add(productId)}
      disabled={busy || !inStock}
      aria-label={t.product.addToCart}
      className={cn(
        "bg-foreground text-background inline-flex size-9 shrink-0 items-center justify-center rounded-full transition-transform hover:scale-105 active:scale-95 disabled:opacity-50",
        className,
      )}
    >
      <Icon className={cn("size-4", busy && "animate-spin")} />
    </button>
  );
}

/** Quantity picker + full-width button used on the product page. */
export function BuyBox({ productId, stock }: { productId: string; stock: number }) {
  const { t } = useI18n();
  const { add, pending } = useCart();
  const [quantity, setQuantity] = useState(1);
  const busy = pending.has(productId);
  const inStock = stock > 0;

  async function onAdd() {
    if (await add(productId, quantity)) setQuantity(1);
  }

  return (
    <div className="flex flex-wrap items-center gap-3">
      {inStock && (
        <QuantityStepper
          value={quantity}
          min={1}
          max={stock}
          onChange={setQuantity}
          disabled={busy}
          className="h-12"
          label={t.product.quantity}
        />
      )}
      <Button size="lg" onClick={onAdd} disabled={busy || !inStock} className="h-12 min-w-48 flex-1 rounded-full text-base">
        {busy ? <Loader2 className="size-5 animate-spin" /> : <ShoppingBag className="size-5" />}
        {inStock ? t.product.addToCart : t.product.outOfStock}
      </Button>
    </div>
  );
}
