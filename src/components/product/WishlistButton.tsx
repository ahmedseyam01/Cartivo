"use client";

import { Heart } from "lucide-react";
import { useI18n } from "@/i18n/I18nProvider";
import { useWishlist } from "@/providers/WishlistProvider";
import { cn } from "@/lib/utils";

export function WishlistButton({ productId, className }: { productId: string; className?: string }) {
  const { t } = useI18n();
  const { has, toggle } = useWishlist();
  const saved = has(productId);

  return (
    <button
      type="button"
      onClick={() => toggle(productId)}
      aria-pressed={saved}
      aria-label={saved ? t.product.removeFromWishlist : t.product.saveToWishlist}
      className={cn(
        "inline-flex size-9 items-center justify-center rounded-full bg-white/90 shadow-sm backdrop-blur transition-transform hover:scale-105 active:scale-95",
        className,
      )}
    >
      <Heart className={cn("size-[18px] transition-colors", saved && "fill-foreground")} />
    </button>
  );
}
