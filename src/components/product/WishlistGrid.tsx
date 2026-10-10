"use client";

import Link from "next/link";
import { Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/shared/EmptyState";
import { useI18n } from "@/i18n/I18nProvider";
import { useWishlist } from "@/providers/WishlistProvider";
import type { Product } from "@/types/catalog";

/**
 * Renders the server-fetched wishlist, hiding items the user un-hearts on this page
 * without waiting for a reload.
 */
export function WishlistGrid({ products, children }: { products: Product[]; children: React.ReactNode[] }) {
  const { t } = useI18n();
  const { ids, ready } = useWishlist();
  // Until the provider has loaded, trust the server list.
  const visible = products.map((p) => !ready || ids.has(p.id));

  if (!products.length || visible.every((v) => !v)) {
    return (
      <EmptyState
        icon={Heart}
        title={t.wishlist.empty}
        description={t.wishlist.emptyText}
        action={
          <Button asChild size="lg" className="rounded-full">
            <Link href="/products">{t.wishlist.discover}</Link>
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
