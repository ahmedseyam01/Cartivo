"use client";

import Link from "next/link";
import { Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/shared/EmptyState";
import { useWishlist } from "@/providers/WishlistProvider";
import type { Product } from "@/types/catalog";

/**
 * Renders the server-fetched wishlist, hiding items the user un-hearts on this page
 * without waiting for a reload.
 */
export function WishlistGrid({ products, children }: { products: Product[]; children: React.ReactNode[] }) {
  const { ids, ready } = useWishlist();
  // Until the provider has loaded, trust the server list.
  const visible = products.map((p) => !ready || ids.has(p.id));

  if (!products.length || visible.every((v) => !v)) {
    return (
      <EmptyState
        icon={Heart}
        title="Your wishlist is empty"
        description="Tap the heart on any product to save it for later."
        action={
          <Button asChild size="lg" className="rounded-full">
            <Link href="/products">Discover products</Link>
          </Button>
        }
      />
    );
  }

  return (
    <div className="grid grid-cols-2 gap-3 sm:gap-5 sm:grid-cols-3 lg:grid-cols-4">
      {children.map((child, i) => visible[i] && child)}
    </div>
  );
}
