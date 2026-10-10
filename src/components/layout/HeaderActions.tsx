"use client";

import Link from "next/link";
import { signOut, useSession } from "next-auth/react";
import { Heart, LogIn, LogOut, Package, ShoppingBag, Tags, User, UserPlus } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useI18n } from "@/i18n/I18nProvider";
import { useCart } from "@/providers/CartProvider";
import { useWishlist } from "@/providers/WishlistProvider";
import { cn } from "@/lib/utils";
import { LanguageSwitch } from "./LanguageSwitch";

const iconButton =
  "relative inline-flex size-10 items-center justify-center rounded-full transition-colors hover:bg-accent";

export function CountBadge({ count, className }: { count: number; className?: string }) {
  if (count <= 0) return null;
  return (
    <span
      className={cn(
        "bg-foreground text-background absolute -end-0.5 -top-0.5 flex h-[18px] min-w-[18px] items-center justify-center rounded-full px-1 text-[10px] leading-none font-semibold tabular-nums ring-2 ring-white",
        className,
      )}
    >
      {count > 99 ? "99+" : count}
    </span>
  );
}

export function HeaderActions() {
  const { t } = useI18n();
  const { data: session, status } = useSession();
  const { itemCount } = useCart();
  const { ids } = useWishlist();

  return (
    <div className="flex items-center gap-1">
      <LanguageSwitch />
      <Link href="/wishlist" aria-label={t.nav.wishlist} className={cn(iconButton, "hidden md:inline-flex")}>
        <Heart className="size-5" />
        <CountBadge count={ids.size} />
      </Link>
      <Link href="/cart" aria-label={t.nav.cart} className={cn(iconButton, "hidden md:inline-flex")}>
        <ShoppingBag className="size-5" />
        <CountBadge count={itemCount} />
      </Link>

      <DropdownMenu modal={false}>
        <DropdownMenuTrigger aria-label={t.menu.label} className={cn(iconButton, "outline-none")}>
          {status === "authenticated" ? (
            <span className="bg-foreground text-background flex size-8 items-center justify-center rounded-full text-sm font-semibold uppercase">
              {session.user.name?.[0] ?? "U"}
            </span>
          ) : (
            <User className="size-5" />
          )}
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56 rounded-xl p-1.5">
          {status === "authenticated" ? (
            <>
              <DropdownMenuLabel className="font-normal">
                <p className="truncate text-sm font-semibold">{session.user.name}</p>
                <p className="text-muted-foreground truncate text-xs">{session.user.email}</p>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <MenuLink href="/profile" icon={User} label={t.menu.myAccount} />
              <MenuLink href="/allorders" icon={Package} label={t.nav.orders} />
              <MenuLink href="/wishlist" icon={Heart} label={t.nav.wishlist} />
            </>
          ) : (
            <>
              <MenuLink href="/login" icon={LogIn} label={t.menu.signIn} />
              <MenuLink href="/register" icon={UserPlus} label={t.menu.createAccount} />
            </>
          )}
          <DropdownMenuSeparator />
          {/* Brands has no tab in the phone bottom bar, so it lives here too. */}
          <MenuLink href="/brands" icon={Tags} label={t.nav.brands} />
          {status === "authenticated" && (
            <DropdownMenuItem onSelect={() => signOut({ callbackUrl: "/" })}>
              <LogOut /> {t.menu.signOut}
            </DropdownMenuItem>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}

function MenuLink({ href, icon: Icon, label }: { href: string; icon: typeof User; label: string }) {
  return (
    <DropdownMenuItem asChild>
      <Link href={href}>
        <Icon /> {label}
      </Link>
    </DropdownMenuItem>
  );
}
