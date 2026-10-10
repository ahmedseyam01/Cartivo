"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { useSession } from "next-auth/react";
import toast from "react-hot-toast";
import { addToCart, clearCart, getCart, removeCartLine, updateCartLine } from "@/actions/cart";
import { useSignInRedirect } from "@/hooks/useSignInRedirect";
import { useErrorText, useI18n } from "@/i18n/I18nProvider";
import { format } from "@/i18n/config";
import type { Cart, CartLine } from "@/types/commerce";
import type { ActionResult } from "@/types/user";

type CartContextValue = {
  cart: Cart | null;
  itemCount: number;
  /** Product ids with a request in flight ("*" while clearing). */
  pending: ReadonlySet<string>;
  add: (productId: string, quantity?: number) => Promise<boolean>;
  update: (productId: string, count: number) => Promise<void>;
  remove: (productId: string) => Promise<void>;
  clear: () => Promise<void>;
  /** Replace local state, e.g. with a server-rendered cart or after checkout. */
  hydrate: (cart: Cart | null) => void;
};

const CartContext = createContext<CartContextValue | null>(null);

const lineId = (line: CartLine) => line.product.id ?? line.product._id;

/** Recomputes totals so optimistic edits show correct numbers instantly. */
function withLines(cart: Cart, lines: CartLine[]): Cart {
  return {
    ...cart,
    lines,
    itemCount: lines.reduce((sum, line) => sum + line.count, 0),
    total: lines.reduce((sum, line) => sum + line.count * line.price, 0),
  };
}

export function CartProvider({ children }: { children: React.ReactNode }) {
  const { status } = useSession();
  const { t } = useI18n();
  const errorText = useErrorText();
  const redirectToSignIn = useSignInRedirect();
  const [cart, setCart] = useState<Cart | null>(null);
  const [pending, setPending] = useState<ReadonlySet<string>>(new Set());

  const refresh = useCallback(async () => {
    const result = await getCart();
    if (result.ok) setCart(result.data);
  }, []);

  useEffect(() => {
    if (status === "authenticated") refresh();
    if (status === "unauthenticated") setCart(null);
  }, [status, refresh]);

  /** Runs a cart action, tracks it as pending, and resyncs with the server if it fails. */
  const run = useCallback(
    async (key: string, action: () => Promise<ActionResult<Cart>>, success?: string) => {
      setPending((prev) => new Set(prev).add(key));
      try {
        const result = await action();
        if (result.ok) {
          setCart(result.data);
          if (success) toast.success(success);
        } else if (result.unauthorized) {
          redirectToSignIn();
        } else {
          toast.error(errorText(result.error) ?? t.errors.generic);
          await refresh();
        }
        return result.ok;
      } finally {
        setPending((prev) => {
          const next = new Set(prev);
          next.delete(key);
          return next;
        });
      }
    },
    [redirectToSignIn, refresh, errorText, t],
  );

  const value = useMemo<CartContextValue>(() => {
    const editLines = (edit: (lines: CartLine[]) => CartLine[]) =>
      setCart((current) => (current ? withLines(current, edit(current.lines)) : current));

    return {
      cart,
      itemCount: cart?.itemCount ?? 0,
      pending,
      add: async (productId, quantity = 1) => {
        if (status !== "authenticated") {
          redirectToSignIn();
          return false;
        }
        return run(productId, () => addToCart(productId, quantity), t.toast.addedToCart);
      },
      update: async (productId, count) => {
        const line = cart?.lines.find((l) => lineId(l) === productId);
        const stock = line?.product.quantity;
        if (stock !== undefined && count > stock) {
          toast.error(format(t.toast.stockLimit, { count: stock }));
          return;
        }
        // Optimistic: show the new quantity immediately.
        editLines((lines) => lines.map((l) => (lineId(l) === productId ? { ...l, count } : l)));
        await run(productId, () => updateCartLine(productId, count));
      },
      remove: async (productId) => {
        editLines((lines) => lines.filter((l) => lineId(l) !== productId));
        await run(productId, () => removeCartLine(productId), t.toast.removedFromCart);
      },
      clear: async () => {
        await run("*", clearCart, t.toast.cartCleared);
      },
      hydrate: setCart,
    };
  }, [cart, pending, status, run, redirectToSignIn, t]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) throw new Error("useCart must be used inside <CartProvider>");
  return context;
}
