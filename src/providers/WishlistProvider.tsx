"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { useSession } from "next-auth/react";
import toast from "react-hot-toast";
import { addToWishlist, getWishlistIds, removeFromWishlist } from "@/actions/wishlist";
import { useSignInRedirect } from "@/hooks/useSignInRedirect";

type WishlistContextValue = {
  ids: ReadonlySet<string>;
  /** True once the signed-in user's wishlist has been loaded. */
  ready: boolean;
  has: (productId: string) => boolean;
  toggle: (productId: string) => Promise<void>;
};

const WishlistContext = createContext<WishlistContextValue | null>(null);

export function WishlistProvider({ children }: { children: React.ReactNode }) {
  const { status } = useSession();
  const redirectToSignIn = useSignInRedirect();
  const [ids, setIds] = useState<ReadonlySet<string>>(new Set());
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (status === "unauthenticated") {
      setIds(new Set());
      setReady(false);
    }
    if (status !== "authenticated") return;

    let active = true;
    getWishlistIds().then((result) => {
      if (!active || !result.ok) return;
      setIds(new Set(result.data));
      setReady(true);
    });
    return () => {
      active = false;
    };
  }, [status]);

  const toggle = useCallback(
    async (productId: string) => {
      if (status !== "authenticated") return redirectToSignIn();

      const saved = ids.has(productId);
      // Optimistic: flip immediately, roll back on failure.
      const flip = (prev: ReadonlySet<string>) => {
        const next = new Set(prev);
        if (saved) next.delete(productId);
        else next.add(productId);
        return next;
      };
      setIds(flip);

      const result = saved ? await removeFromWishlist(productId) : await addToWishlist(productId);
      if (result.ok) {
        setIds(new Set(result.data));
        toast.success(saved ? "Removed from wishlist" : "Saved to wishlist");
      } else {
        setIds((prev) => flip(prev));
        if (result.unauthorized) redirectToSignIn();
        else toast.error(result.error);
      }
    },
    [ids, status, redirectToSignIn],
  );

  const value = useMemo(() => ({ ids, ready, has: (id: string) => ids.has(id), toggle }), [ids, ready, toggle]);

  return <WishlistContext.Provider value={value}>{children}</WishlistContext.Provider>;
}

export function useWishlist() {
  const context = useContext(WishlistContext);
  if (!context) throw new Error("useWishlist must be used inside <WishlistProvider>");
  return context;
}
