"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { useSession } from "next-auth/react";
import toast from "react-hot-toast";
import { addToCart, clearCart, getCart, removeCartLine, updateCartLine } from "@/actions/cart";
import { useSignInRedirect } from "@/hooks/useSignInRedirect";
import type { Cart } from "@/types/commerce";
import type { ActionResult } from "@/types/user";

type CartContextValue = {
  cart: Cart | null;
  itemCount: number;
  isLoading: boolean;
  /** Product ids with a request in flight. */
  pending: ReadonlySet<string>;
  add: (productId: string) => Promise<boolean>;
  update: (productId: string, count: number) => Promise<void>;
  remove: (productId: string) => Promise<void>;
  clear: () => Promise<void>;
  /** Replace local state, e.g. with a server-rendered cart or after checkout. */
  hydrate: (cart: Cart | null) => void;
};

const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const { status } = useSession();
  const redirectToSignIn = useSignInRedirect();
  const [cart, setCart] = useState<Cart | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [pending, setPending] = useState<ReadonlySet<string>>(new Set());

  useEffect(() => {
    if (status === "unauthenticated") setCart(null);
    if (status !== "authenticated") return;

    let active = true;
    setIsLoading(true);
    getCart()
      .then((result) => active && result.ok && setCart(result.data))
      .finally(() => active && setIsLoading(false));
    return () => {
      active = false;
    };
  }, [status]);

  const track = useCallback(async (key: string, run: () => Promise<ActionResult<Cart>>, success?: string) => {
    setPending((prev) => new Set(prev).add(key));
    try {
      const result = await run();
      if (result.ok) {
        setCart(result.data);
        if (success) toast.success(success);
      } else if (result.unauthorized) {
        redirectToSignIn();
      } else {
        toast.error(result.error);
      }
      return result.ok;
    } finally {
      setPending((prev) => {
        const next = new Set(prev);
        next.delete(key);
        return next;
      });
    }
  }, [redirectToSignIn]);

  const value = useMemo<CartContextValue>(
    () => ({
      cart,
      itemCount: cart?.itemCount ?? 0,
      isLoading,
      pending,
      add: async (productId) => {
        if (status !== "authenticated") {
          redirectToSignIn();
          return false;
        }
        return track(productId, () => addToCart(productId), "Added to cart");
      },
      update: async (productId, count) => {
        await track(productId, () => updateCartLine(productId, count));
      },
      remove: async (productId) => {
        await track(productId, () => removeCartLine(productId), "Removed from cart");
      },
      clear: async () => {
        await track("*", clearCart, "Cart cleared");
      },
      hydrate: setCart,
    }),
    [cart, isLoading, pending, status, track, redirectToSignIn],
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) throw new Error("useCart must be used inside <CartProvider>");
  return context;
}
