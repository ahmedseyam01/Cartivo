"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { mainNav } from "@/lib/config";
import { cn } from "@/lib/utils";

export function useIsActive() {
  const pathname = usePathname();
  return (href: string) => (href === "/" ? pathname === "/" : pathname === href || pathname.startsWith(`${href}/`));
}

export function NavLinks({ className }: { className?: string }) {
  const isActive = useIsActive();

  return (
    <nav aria-label="Main" className={cn("flex items-center gap-1", className)}>
      {mainNav.map(({ href, label }) => (
        <Link
          key={href}
          href={href}
          aria-current={isActive(href) ? "page" : undefined}
          className={cn(
            "rounded-full px-3.5 py-2 text-sm font-medium transition-colors",
            isActive(href) ? "bg-foreground text-background" : "text-muted-foreground hover:text-foreground",
          )}
        >
          {label}
        </Link>
      ))}
    </nav>
  );
}
