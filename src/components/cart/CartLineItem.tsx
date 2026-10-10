"use client";

import Image from "next/image";
import Link from "next/link";
import { Trash2 } from "lucide-react";
import { QuantityStepper } from "@/components/product/QuantityStepper";
import { useI18n } from "@/i18n/I18nProvider";
import { format } from "@/i18n/config";
import { useCart } from "@/providers/CartProvider";
import { formatPrice } from "@/lib/format";
import type { CartLine } from "@/types/commerce";

export function CartLineItem({ line }: { line: CartLine }) {
  const { locale, t } = useI18n();
  const { update, remove, pending } = useCart();
  const productId = line.product.id ?? line.product._id;
  const href = `/products/${productId}`;
  const busy = pending.has(productId);
  const stock = line.product.quantity;

  return (
    <li className="flex gap-4 py-5">
      <Link href={href} className="bg-muted relative size-24 shrink-0 overflow-hidden rounded-xl sm:size-28">
        <Image src={line.product.imageCover} alt="" fill sizes="112px" className="object-cover" />
      </Link>

      <div className="flex min-w-0 flex-1 flex-col">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <p className="text-muted-foreground text-[11px] font-medium tracking-wider uppercase">{line.product.brand?.name}</p>
            <Link href={href} className="line-clamp-2 text-sm font-medium hover:underline sm:text-base">
              <bdi>{line.product.title}</bdi>
            </Link>
          </div>
          <p className="shrink-0 font-semibold tabular-nums">{formatPrice(line.price * line.count, locale)}</p>
        </div>
        <p className="text-muted-foreground mt-1 text-xs tabular-nums">
          {format(t.product.each, { price: formatPrice(line.price, locale) })}
        </p>

        <div className="mt-auto flex items-center justify-between pt-3">
          <QuantityStepper value={line.count} max={stock} loading={busy} disabled={busy} onChange={(count) => update(productId, count)} />
          <button
            type="button"
            onClick={() => remove(productId)}
            className="text-muted-foreground hover:text-destructive flex items-center gap-1.5 text-sm transition-colors"
          >
            <Trash2 className="size-4" />
            <span className="hidden sm:inline">{t.product.remove}</span>
          </button>
        </div>
      </div>
    </li>
  );
}
