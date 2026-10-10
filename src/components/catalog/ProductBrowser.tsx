import { Suspense } from "react";
import Link from "next/link";
import { SearchX } from "lucide-react";
import { isProductSort, queryProducts } from "@/lib/api/catalog";
import { ProductGrid } from "@/components/product/ProductGrid";
import { SortSelect } from "@/components/product/SortSelect";
import { EmptyState } from "@/components/shared/EmptyState";
import { Pagination } from "@/components/shared/Pagination";
import { Button } from "@/components/ui/button";

export type BrowseParams = Record<string, string | undefined>;

/** Search results, sorting and pagination shared by the shop, category and brand pages. */
export async function ProductBrowser({
  pathname,
  params,
  scope,
  filters,
}: {
  pathname: string;
  params: BrowseParams;
  /** Fixed filters coming from the route, e.g. the current category. */
  scope?: { category?: string; brand?: string };
  filters?: React.ReactNode;
}) {
  const sort = isProductSort(params.sort) ? params.sort : "featured";
  const result = await queryProducts({
    q: params.q,
    category: scope?.category ?? params.category,
    brand: scope?.brand ?? params.brand,
    subcategory: params.subcategory,
    sort,
    page: Number(params.page) || 1,
  });

  return (
    <section className="space-y-6">
      {filters}
      <div className="flex items-center justify-between gap-4">
        <p className="text-muted-foreground text-sm">
          {result.total} {result.total === 1 ? "product" : "products"}
          {params.q && (
            <>
              {" "}
              for “<span className="text-foreground font-medium">{params.q}</span>”
            </>
          )}
        </p>
        <Suspense>
          <SortSelect value={sort} />
        </Suspense>
      </div>

      {result.items.length ? (
        <ProductGrid products={result.items} prioritize={4} />
      ) : (
        <EmptyState
          icon={SearchX}
          title="No products found"
          description="Try a different search term or clear the filters."
          action={
            <Button asChild variant="outline" className="rounded-full">
              <Link href={pathname}>Clear filters</Link>
            </Button>
          }
        />
      )}

      <Pagination pathname={pathname} params={params} page={result.page} pageCount={result.pageCount} />
    </section>
  );
}
