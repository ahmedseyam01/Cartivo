import { Suspense } from "react";
import Link from "next/link";
import { SearchX } from "lucide-react";
import { isProductSort, queryProducts } from "@/lib/api/catalog";
import { format } from "@/i18n/config";
import { getI18n } from "@/i18n/server";
import { ProductGrid } from "@/components/product/ProductGrid";
import { SortSelect } from "@/components/product/SortSelect";
import { EmptyState } from "@/components/shared/EmptyState";
import { Pagination } from "@/components/shared/Pagination";
import { Button } from "@/components/ui/button";
import { ProductFilters } from "./ProductFilters";

export type BrowseParams = Record<string, string | undefined>;

function toNumber(value?: string) {
  const n = Number(value);
  return value && Number.isFinite(n) && n >= 0 ? n : undefined;
}

/** Search results, filters, sorting and pagination shared by the shop, category and brand pages. */
export async function ProductBrowser({
  pathname,
  params,
  scope,
  pills,
}: {
  pathname: string;
  params: BrowseParams;
  /** Fixed filters coming from the route, e.g. the current category. */
  scope?: { category?: string; brand?: string };
  pills?: React.ReactNode;
}) {
  const { t } = getI18n();
  const sort = isProductSort(params.sort) ? params.sort : "featured";
  const result = await queryProducts({
    q: params.q,
    category: scope?.category ?? params.category,
    brand: scope?.brand ?? params.brand,
    subcategory: params.subcategory,
    minPrice: toNumber(params.min),
    maxPrice: toNumber(params.max),
    inStock: params.stock === "1",
    sort,
    page: Number(params.page) || 1,
  });

  const count = result.total === 1 ? t.catalog.productCountOne : format(t.catalog.productCount, { count: result.total });

  return (
    <section className="space-y-6">
      {pills}
      <div className="flex flex-wrap items-start justify-between gap-3">
        <ProductFilters pathname={pathname} params={params} />
        <Suspense>
          <SortSelect value={sort} />
        </Suspense>
      </div>
      <p className="text-muted-foreground text-sm">
        {count}
        {params.q && (
          <>
            {" "}
            <span className="text-foreground font-medium">{format(t.catalog.forQuery, { q: params.q })}</span>
          </>
        )}
      </p>

      {result.items.length ? (
        <ProductGrid products={result.items} prioritize={4} />
      ) : (
        <EmptyState
          icon={SearchX}
          title={t.catalog.noResults}
          description={t.catalog.noResultsText}
          action={
            <Button asChild variant="outline" className="rounded-full">
              <Link href={pathname}>{t.catalog.clearFilters}</Link>
            </Button>
          }
        />
      )}

      <Pagination pathname={pathname} params={params} page={result.page} pageCount={result.pageCount} />
    </section>
  );
}
