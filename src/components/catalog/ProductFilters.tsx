import Form from "next/form";
import Link from "next/link";
import { SlidersHorizontal } from "lucide-react";
import { getI18n } from "@/i18n/server";
import { Button } from "@/components/ui/button";
import type { BrowseParams } from "./ProductBrowser";

// Filters that live in the URL but aren't edited by this form are carried over as hidden fields.
const carried = ["q", "sort", "category", "subcategory", "brand"];

const input =
  "focus:border-foreground h-10 w-full rounded-xl border bg-white px-3 text-sm outline-none [appearance:textfield]";

/** Price range + availability. A plain GET form: works before JavaScript loads. */
export function ProductFilters({ pathname, params }: { pathname: string; params: BrowseParams }) {
  const { t } = getI18n();
  const active = [params.min, params.max, params.stock].filter(Boolean).length;

  const resetQuery = new URLSearchParams();
  for (const key of carried) if (params[key]) resetQuery.set(key, params[key]!);
  const resetHref = resetQuery.size ? `${pathname}?${resetQuery}` : pathname;

  return (
    <details className="group relative" open={active > 0 ? true : undefined}>
      <summary className="hover:border-foreground flex h-10 cursor-pointer list-none items-center gap-2 rounded-full border px-4 text-sm font-medium [&::-webkit-details-marker]:hidden">
        <SlidersHorizontal className="size-4" />
        {t.catalog.filters}
        {active > 0 && (
          <span className="bg-foreground text-background flex size-5 items-center justify-center rounded-full text-[11px]">
            {active}
          </span>
        )}
      </summary>

      <Form
        action={pathname}
        scroll={false}
        className="mt-3 grid w-full gap-3 rounded-2xl border bg-white p-4 sm:absolute sm:start-0 sm:top-full sm:z-20 sm:w-80 sm:shadow-xl"
      >
        {carried.map((key) => params[key] && <input key={key} type="hidden" name={key} value={params[key]} />)}
        <div className="grid grid-cols-2 gap-3">
          <label className="grid gap-1.5 text-xs font-medium">
            {t.catalog.minPrice}
            <input name="min" type="number" min={0} inputMode="numeric" defaultValue={params.min} placeholder="0" className={input} />
          </label>
          <label className="grid gap-1.5 text-xs font-medium">
            {t.catalog.maxPrice}
            <input name="max" type="number" min={0} inputMode="numeric" defaultValue={params.max} placeholder="∞" className={input} />
          </label>
        </div>
        <label className="flex items-center gap-2 text-sm">
          <input name="stock" type="checkbox" value="1" defaultChecked={params.stock === "1"} className="accent-foreground size-4" />
          {t.catalog.inStockOnly}
        </label>
        <div className="flex gap-2">
          <Button type="submit" className="flex-1 rounded-full">
            {t.catalog.apply}
          </Button>
          {active > 0 && (
            <Button asChild variant="outline" className="rounded-full">
              <Link href={resetHref} scroll={false}>
                {t.catalog.reset}
              </Link>
            </Button>
          )}
        </div>
      </Form>
    </details>
  );
}
