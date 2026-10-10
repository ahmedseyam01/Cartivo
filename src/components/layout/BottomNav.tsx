"use client";

import Link from "next/link";
import { Heart, Home, LayoutGrid, ShoppingBag, Store } from "lucide-react";
import { useI18n } from "@/i18n/I18nProvider";
import { useCart } from "@/providers/CartProvider";
import { useWishlist } from "@/providers/WishlistProvider";
import { cn } from "@/lib/utils";
import { CountBadge } from "./HeaderActions";
import { useIsActive } from "./NavLinks";

/** App-style tab bar shown on phones. */
export function BottomNav() {
  const { t } = useI18n();
  const isActive = useIsActive();
  const { itemCount } = useCart();
  const { ids } = useWishlist();

  const tabs = [
    { href: "/", label: t.nav.home, icon: Home },
    { href: "/products", label: t.nav.shop, icon: Store },
    { href: "/categories", label: t.nav.categories, icon: LayoutGrid },
    { href: "/wishlist", label: t.nav.wishlist, icon: Heart, count: ids.size },
    { href: "/cart", label: t.nav.cart, icon: ShoppingBag, count: itemCount },
  ];

  return (
    <nav
      aria-label={t.nav.quick}
      className="fixed inset-x-0 bottom-0 z-40 border-t bg-white/95 pb-[env(safe-area-inset-bottom)] backdrop-blur md:hidden"
    >
      <ul className="grid grid-cols-5">
        {tabs.map(({ href, label, icon: Icon, count = 0 }) => {
          const active = isActive(href);
          return (
            <li key={href}>
              <Link
                href={href}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "flex h-16 flex-col items-center justify-center gap-1 text-[11px] font-medium transition-colors",
                  active ? "text-foreground" : "text-muted-foreground",
                )}
              >
                <span className="relative">
                  <Icon className={cn("size-[22px]", active && "stroke-[2.4]")} />
                  <CountBadge count={count} className="-end-2.5 -top-1.5" />
                </span>
                {label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
