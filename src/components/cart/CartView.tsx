"use client";

import Link from "next/link";
import { useEffect } from "react";
import { ArrowLeft, ArrowRight, Loader2, ShoppingBag, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/shared/EmptyState";
import { useI18n } from "@/i18n/I18nProvider";
import { useCart } from "@/providers/CartProvider";
import type { Cart } from "@/types/commerce";
import { CartLineItem } from "./CartLineItem";
import { OrderSummary } from "./OrderSummary";

export function CartView({ initialCart }: { initialCart: Cart }) {
  const { t } = useI18n();
  const { cart: liveCart, hydrate, clear, pending } = useCart();

  // Seed the shared cart with the server-rendered copy so the badge and page agree instantly.
  useEffect(() => hydrate(initialCart), [hydrate, initialCart]);

  const cart = liveCart ?? initialCart;
  const clearing = pending.has("*");

  if (!cart.lines.length) {
    return (
      <EmptyState
        icon={ShoppingBag}
        title={t.cart.empty}
        description={t.cart.emptyText}
        action={
          <Button asChild size="lg" className="rounded-full">
            <Link href="/products">{t.cart.startShopping}</Link>
          </Button>
        }
      />
    );
  }

  return (
    <div className="grid gap-10 lg:grid-cols-[1fr_380px] lg:items-start">
      <section aria-label={t.cart.items}>
        <ul className="divide-y border-y">
          {cart.lines.map((line) => (
            <CartLineItem key={line._id} line={line} />
          ))}
        </ul>
        <div className="mt-4 flex justify-between">
          <Button asChild variant="ghost" className="rounded-full">
            <Link href="/products">
              <ArrowLeft className="rtl:rotate-180" /> {t.cart.continueShopping}
            </Link>
          </Button>
          <Button
            variant="ghost"
            onClick={clear}
            disabled={clearing}
            className="text-muted-foreground hover:text-destructive rounded-full"
          >
            {clearing ? <Loader2 className="animate-spin" /> : <Trash2 />}
            {t.cart.clear}
          </Button>
        </div>
      </section>

      <OrderSummary itemCount={cart.itemCount} total={cart.total} className="lg:sticky lg:top-24">
        <Button asChild size="lg" className="h-12 w-full rounded-full text-base">
          <Link href="/checkout">
            {t.cart.checkout} <ArrowRight className="rtl:rotate-180" />
          </Link>
        </Button>
      </OrderSummary>
    </div>
  );
}
