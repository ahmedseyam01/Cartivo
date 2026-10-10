import type { Metadata } from "next";
import { getCategories } from "@/lib/api/catalog";
import { getDictionary, setRequestLocale } from "@/i18n/server";
import { PageHeader } from "@/components/shared/PageHeader";
import { FilterPills } from "@/components/catalog/FilterPills";
import { ProductBrowser, type BrowseParams } from "@/components/catalog/ProductBrowser";

type Props = { params: Promise<{ locale: string }>; searchParams: Promise<BrowseParams> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  return { title: getDictionary(setRequestLocale((await params).locale)).catalog.shopTitle };
}

export default async function ProductsPage({ params, searchParams }: Props) {
  const t = getDictionary(setRequestLocale((await params).locale));
  const [query, categories] = await Promise.all([searchParams, getCategories()]);

  // Switching category keeps the search and sort but resets everything else.
  const pillHref = (category?: string) => {
    const qs = new URLSearchParams();
    if (query.q) qs.set("q", query.q);
    if (query.sort) qs.set("sort", query.sort);
    if (category) qs.set("category", category);
    return qs.size ? `/products?${qs}` : "/products";
  };

  return (
    <div className="page-container">
      <PageHeader
        title={query.q ? t.catalog.searchTitle : t.catalog.shopTitle}
        description={t.catalog.shopDescription}
        breadcrumbs={[{ href: "/", label: t.nav.home }, { label: t.nav.shop }]}
      />
      <ProductBrowser
        pathname="/products"
        params={query}
        pills={
          <FilterPills
            label={t.catalog.filterByCategory}
            pills={[
              { href: pillHref(), label: t.catalog.all, active: !query.category },
              ...categories.map((c) => ({ href: pillHref(c._id), label: c.name, active: query.category === c._id })),
            ]}
          />
        }
      />
    </div>
  );
}
