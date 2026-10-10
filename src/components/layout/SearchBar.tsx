"use client";

import Form from "next/form";
import { useSearchParams } from "next/navigation";
import { Search } from "lucide-react";
import { cn } from "@/lib/utils";

export function SearchBar({ className }: { className?: string }) {
  const searchParams = useSearchParams();

  return (
    <Form action="/products" role="search" className={cn("relative", className)}>
      <Search className="text-muted-foreground pointer-events-none absolute top-1/2 left-3.5 size-4 -translate-y-1/2" />
      <input
        // Re-mount when the URL query changes so the field reflects it.
        key={searchParams.get("q") ?? ""}
        name="q"
        type="search"
        defaultValue={searchParams.get("q") ?? ""}
        placeholder="Search products, brands…"
        aria-label="Search products"
        enterKeyHint="search"
        className="bg-muted focus:bg-background focus:border-foreground h-10 w-full rounded-full border border-transparent pr-4 pl-10 text-sm outline-none transition-colors placeholder:text-muted-foreground"
      />
    </Form>
  );
}
