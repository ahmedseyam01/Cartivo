import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { getI18n } from "@/i18n/server";
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

const item = "inline-flex size-10 items-center justify-center rounded-full text-sm font-medium transition-colors";

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
  const { t } = getI18n();

  const step = (target: number, enabled: boolean, label: string, Icon: typeof ChevronLeft) =>
    enabled ? (
      <Link href={hrefFor(pathname, params, target)} aria-label={label} className={cn(item, "hover:bg-accent")}>
        <Icon className="size-4 rtl:rotate-180" />
      </Link>
    ) : (
      <span className={cn(item, "opacity-30")} aria-hidden>
        <Icon className="size-4 rtl:rotate-180" />
      </span>
    );

  return (
    <nav aria-label={t.catalog.pagination} className="mt-12 flex items-center justify-center gap-1">
      {step(page - 1, page > 1, t.catalog.previous, ChevronLeft)}
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
      {step(page + 1, page < pageCount, t.catalog.next, ChevronRight)}
    </nav>
  );
}
