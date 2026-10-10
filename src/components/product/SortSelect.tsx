"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useTransition } from "react";
import { ArrowUpDown, Loader2 } from "lucide-react";
import { useI18n } from "@/i18n/I18nProvider";
import type { ProductSort } from "@/types/catalog";

const sorts: ProductSort[] = ["featured", "best-selling", "top-rated", "newest", "price-asc", "price-desc"];

export function SortSelect({ value }: { value: ProductSort }) {
  const { t } = useI18n();
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  function onChange(sort: string) {
    const params = new URLSearchParams(searchParams);
    if (sort === "featured") params.delete("sort");
    else params.set("sort", sort);
    params.delete("page");
    startTransition(() => router.push(`${pathname}?${params}`, { scroll: false }));
  }

  const Icon = isPending ? Loader2 : ArrowUpDown;

  return (
    <label className="relative inline-flex items-center">
      <span className="sr-only">{t.catalog.sortLabel}</span>
      <Icon className={`pointer-events-none absolute start-3 size-4 ${isPending ? "animate-spin" : ""}`} />
      <select
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="focus:border-foreground h-10 appearance-none rounded-full border bg-white ps-9 pe-4 text-sm font-medium outline-none"
      >
        {sorts.map((sort) => (
          <option key={sort} value={sort}>
            {t.catalog.sort[sort]}
          </option>
        ))}
      </select>
    </label>
  );
}
