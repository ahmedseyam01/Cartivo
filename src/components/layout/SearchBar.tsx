"use client";

import Form from "next/form";
import { useSearchParams } from "next/navigation";
import { Search } from "lucide-react";
import { useI18n } from "@/i18n/I18nProvider";
import { cn } from "@/lib/utils";

export function SearchBar({ className }: { className?: string }) {
  const { t } = useI18n();
  const searchParams = useSearchParams();
  const query = searchParams.get("q") ?? "";

  return (
    <Form action="/products" role="search" className={cn("relative", className)}>
      <Search className="text-muted-foreground pointer-events-none absolute start-3.5 top-1/2 size-4 -translate-y-1/2" />
      <input
        // Re-mount when the URL query changes so the field reflects it.
        key={query}
        name="q"
        type="search"
        defaultValue={query}
        placeholder={t.search.placeholder}
        aria-label={t.search.label}
        enterKeyHint="search"
        className="bg-muted focus:bg-background focus:border-foreground placeholder:text-muted-foreground h-10 w-full rounded-full border border-transparent ps-10 pe-4 text-sm outline-none transition-colors"
      />
    </Form>
  );
}
