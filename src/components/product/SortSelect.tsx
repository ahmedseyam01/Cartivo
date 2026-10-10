"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useTransition } from "react";
import { ArrowUpDown, Loader2 } from "lucide-react";
import type { ProductSort } from "@/types/catalog";

const options: { value: ProductSort; label: string }[] = [
  { value: "featured", label: "Featured" },
  { value: "best-selling", label: "Best selling" },
  { value: "top-rated", label: "Top rated" },
  { value: "newest", label: "Newest" },
  { value: "price-asc", label: "Price: low to high" },
  { value: "price-desc", label: "Price: high to low" },
];

export function SortSelect({ value }: { value: ProductSort }) {
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

  return (
    <label className="relative inline-flex items-center">
      <span className="sr-only">Sort products</span>
      {isPending ? (
        <Loader2 className="pointer-events-none absolute left-3 size-4 animate-spin" />
      ) : (
        <ArrowUpDown className="pointer-events-none absolute left-3 size-4" />
      )}
      <select
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="h-10 appearance-none rounded-full border bg-white pr-4 pl-9 text-sm font-medium outline-none focus:border-foreground"
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </label>
  );
}
