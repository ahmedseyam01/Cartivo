import Link from "next/link";
import { cn } from "@/lib/utils";
import { siteConfig } from "@/lib/config";

/** Cartivo mark: a shopping bag whose body is drawn as the letter "C". */
export function LogoMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 40 40" aria-hidden="true" className={cn("size-8 shrink-0", className)}>
      <rect width="40" height="40" rx="11" fill="currentColor" />
      <g fill="none" stroke="#fff" strokeWidth="3.2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M15.5 16.5v-2.5a4.5 4.5 0 0 1 9 0v2.5" />
        <path d="M26.2 19.2A8.2 8.2 0 1 0 26.2 29.8" />
      </g>
      <circle cx="26.5" cy="24.5" r="2" fill="#fff" />
    </svg>
  );
}

export function Logo({ className, markClassName }: { className?: string; markClassName?: string }) {
  return (
    <Link
      href="/"
      aria-label={`${siteConfig.name} home`}
      className={cn("inline-flex items-center gap-2 text-xl font-bold tracking-tight", className)}
    >
      <LogoMark className={markClassName} />
      <span>{siteConfig.name}</span>
    </Link>
  );
}
