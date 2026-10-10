import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

type Params = Record<string, string | undefined>;

function hrefFor(pathname: string, params: Params, page: number) {
  const query = new URLSearchParams();
  for (const [key, value] of Object.entries(params)) if (value && key !== "page") query.set(key, value);
  if (page > 1) query.set("page", String(page));
  const qs = query.toString();
  return qs ? `${pathname}?${qs}` : pathname;
}

/** Page numbers with ellipses: 1 … 4 5 6 … 12 */
function pageList(page: number, pageCount: number) {
  const pages = new Set([1, pageCount, page - 1, page, page + 1].filter((p) => p >= 1 && p <= pageCount));
  const sorted = [...pages].sort((a, b) => a - b);
  return sorted.flatMap((p, i) => (i > 0 && p - sorted[i - 1] > 1 ? ["…", p] : [p]));
}

export function Pagination({
  pathname,
  params,
  page,
  pageCount,
}: {
  pathname: string;
  params: Params;
  page: number;
  pageCount: number;
}) {
  if (pageCount <= 1) return null;

  const item = "inline-flex size-10 items-center justify-center rounded-full text-sm font-medium transition-colors";

  return (
    <nav aria-label="Pagination" className="mt-12 flex items-center justify-center gap-1">
      {page > 1 ? (
        <Link href={hrefFor(pathname, params, page - 1)} aria-label="Previous page" className={cn(item, "hover:bg-accent")}>
          <ChevronLeft className="size-4" />
        </Link>
      ) : (
        <span className={cn(item, "opacity-30")} aria-hidden>
          <ChevronLeft className="size-4" />
        </span>
      )}

      {pageList(page, pageCount).map((p, i) =>
        p === "…" ? (
          <span key={`gap-${i}`} className={cn(item, "text-muted-foreground")}>
            …
          </span>
        ) : (
          <Link
            key={p}
            href={hrefFor(pathname, params, p as number)}
            aria-current={p === page ? "page" : undefined}
            className={cn(item, p === page ? "bg-foreground text-background" : "hover:bg-accent")}
          >
            {p}
          </Link>
        ),
      )}

      {page < pageCount ? (
        <Link href={hrefFor(pathname, params, page + 1)} aria-label="Next page" className={cn(item, "hover:bg-accent")}>
          <ChevronRight className="size-4" />
        </Link>
      ) : (
        <span className={cn(item, "opacity-30")} aria-hidden>
          <ChevronRight className="size-4" />
        </span>
      )}
    </nav>
  );
}
