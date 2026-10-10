"use client";

import Link from "next/link";
import { signOut, useSession } from "next-auth/react";
import { Heart, LogIn, LogOut, Package, ShoppingBag, User, UserPlus } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useCart } from "@/providers/CartProvider";
import { useWishlist } from "@/providers/WishlistProvider";
import { cn } from "@/lib/utils";

const iconButton =
  "relative inline-flex size-10 items-center justify-center rounded-full transition-colors hover:bg-accent";

export function CountBadge({ count, className }: { count: number; className?: string }) {
  if (count <= 0) return null;
  return (
    <span
      className={cn(
        "bg-foreground text-background absolute -top-0.5 -right-0.5 flex h-[18px] min-w-[18px] items-center justify-center rounded-full px-1 text-[10px] leading-none font-semibold tabular-nums ring-2 ring-white",
        className,
      )}
    >
      {count > 99 ? "99+" : count}
    </span>
  );
}

export function HeaderActions() {
  const { data: session, status } = useSession();
  const { itemCount } = useCart();
  const { ids } = useWishlist();

  return (
    <div className="flex items-center gap-1">
      <Link href="/wishlist" aria-label={`Wishlist, ${ids.size} items`} className={cn(iconButton, "hidden md:inline-flex")}>
        <Heart className="size-5" />
        <CountBadge count={ids.size} />
      </Link>
      <Link href="/cart" aria-label={`Cart, ${itemCount} items`} className={cn(iconButton, "hidden md:inline-flex")}>
        <ShoppingBag className="size-5" />
        <CountBadge count={itemCount} />
      </Link>

      <DropdownMenu modal={false}>
        <DropdownMenuTrigger aria-label="Account menu" className={cn(iconButton, "outline-none")}>
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
              <DropdownMenuItem asChild>
                <Link href="/profile">
                  <User /> My account
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/allorders">
                  <Package /> Orders
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/wishlist">
                  <Heart /> Wishlist
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onSelect={() => signOut({ callbackUrl: "/" })}>
                <LogOut /> Sign out
              </DropdownMenuItem>
            </>
          ) : (
            <>
              <DropdownMenuItem asChild>
                <Link href="/login">
                  <LogIn /> Sign in
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/register">
                  <UserPlus /> Create account
                </Link>
              </DropdownMenuItem>
            </>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
