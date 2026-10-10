"use client";

import Image from "next/image";
import Link from "next/link";
import { Loader2, Minus, Plus, Trash2 } from "lucide-react";
import { useCart } from "@/providers/CartProvider";
import { formatPrice } from "@/lib/format";
import type { CartLine } from "@/types/commerce";

export function CartLineItem({ line }: { line: CartLine }) {
  const { update, remove, pending } = useCart();
  const productId = line.product.id ?? line.product._id;
  const busy = pending.has(productId);

  const stepper = "flex size-9 items-center justify-center rounded-full transition-colors hover:bg-accent disabled:opacity-40";

  return (
    <li className="flex gap-4 py-5">
      <Link href={`/products/${productId}`} className="bg-muted relative size-24 shrink-0 overflow-hidden rounded-xl sm:size-28">
        <Image src={line.product.imageCover} alt="" fill sizes="112px" className="object-cover" />
      </Link>

      <div className="flex min-w-0 flex-1 flex-col">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <p className="text-muted-foreground text-[11px] font-medium tracking-wider uppercase">{line.product.brand?.name}</p>
            <Link href={`/products/${productId}`} className="line-clamp-2 text-sm font-medium hover:underline sm:text-base">
              {line.product.title}
            </Link>
          </div>
          <p className="shrink-0 font-semibold tabular-nums">{formatPrice(line.price * line.count)}</p>
        </div>
        <p className="text-muted-foreground mt-1 text-xs tabular-nums">{formatPrice(line.price)} each</p>

        <div className="mt-auto flex items-center justify-between pt-3">
          <div className="flex items-center rounded-full border">
            <button
              type="button"
              className={stepper}
              onClick={() => update(productId, line.count - 1)}
              disabled={busy || line.count <= 1}
              aria-label="Decrease quantity"
            >
              <Minus className="size-4" />
            </button>
            <span className="flex w-8 justify-center text-sm font-semibold tabular-nums" aria-live="polite">
              {busy ? <Loader2 className="size-4 animate-spin" /> : line.count}
            </span>
            <button
              type="button"
              className={stepper}
              onClick={() => update(productId, line.count + 1)}
              disabled={busy}
              aria-label="Increase quantity"
            >
              <Plus className="size-4" />
            </button>
          </div>

          <button
            type="button"
            onClick={() => remove(productId)}
            disabled={busy}
            className="text-muted-foreground hover:text-destructive flex items-center gap-1.5 text-sm transition-colors disabled:opacity-40"
          >
            <Trash2 className="size-4" />
            <span className="hidden sm:inline">Remove</span>
          </button>
        </div>
      </div>
    </li>
  );
}
