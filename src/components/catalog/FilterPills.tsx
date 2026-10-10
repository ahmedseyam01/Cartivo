import Link from "next/link";
import { cn } from "@/lib/utils";

export type Pill = { href: string; label: string; active: boolean };

/** Horizontally scrollable filter chips; swipeable on phones. */
export function FilterPills({ pills, label }: { pills: Pill[]; label: string }) {
  return (
    <nav aria-label={label} className="no-scrollbar -mx-4 overflow-x-auto px-4 sm:mx-0 sm:px-0">
      <ul className="flex gap-2">
        {pills.map((pill) => (
          <li key={pill.href} className="shrink-0">
            <Link
              href={pill.href}
              scroll={false}
              aria-current={pill.active ? "true" : undefined}
              className={cn(
                "inline-flex h-9 items-center rounded-full border px-4 text-sm font-medium whitespace-nowrap transition-colors",
                pill.active ? "border-foreground bg-foreground text-background" : "hover:border-foreground",
              )}
            >
              {pill.label}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
