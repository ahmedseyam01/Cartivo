"use client";

import Link from "next/link";
import { useEffect } from "react";
import { ArrowRight, Loader2, ShoppingBag, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/shared/EmptyState";
import { useCart } from "@/providers/CartProvider";
import type { Cart } from "@/types/commerce";
import { CartLineItem } from "./CartLineItem";
import { OrderSummary } from "./OrderSummary";

export function CartView({ initialCart }: { initialCart: Cart }) {
  const { cart: liveCart, hydrate, clear, pending } = useCart();

  // Seed the shared cart with the server-rendered copy so the badge and page agree instantly.
  useEffect(() => hydrate(initialCart), [hydrate, initialCart]);

  const cart = liveCart ?? initialCart;

  if (!cart.lines.length) {
    return (
      <EmptyState
        icon={ShoppingBag}
        title="Your cart is empty"
        description="Looks like you haven't added anything yet. Start exploring our collection."
        action={
          <Button asChild size="lg" className="rounded-full">
            <Link href="/products">Start shopping</Link>
          </Button>
        }
      />
    );
  }

  return (
    <div className="grid gap-10 lg:grid-cols-[1fr_380px] lg:items-start">
      <section aria-label="Cart items">
        <ul className="divide-y border-y">
          {cart.lines.map((line) => (
            <CartLineItem key={line._id} line={line} />
          ))}
        </ul>
        <div className="mt-4 flex justify-between">
          <Button asChild variant="ghost" className="rounded-full">
            <Link href="/products">← Continue shopping</Link>
          </Button>
          <Button
            variant="ghost"
            onClick={clear}
            disabled={pending.has("*")}
            className="text-muted-foreground hover:text-destructive rounded-full"
          >
            {pending.has("*") ? <Loader2 className="animate-spin" /> : <Trash2 />}
            Clear cart
          </Button>
        </div>
      </section>

      <OrderSummary itemCount={cart.itemCount} total={cart.total} className="lg:sticky lg:top-24">
        <Button asChild size="lg" className="h-12 w-full rounded-full text-base">
          <Link href="/checkout">
            Checkout <ArrowRight />
          </Link>
        </Button>
      </OrderSummary>
    </div>
  );
}
