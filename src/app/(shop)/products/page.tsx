import type { Metadata } from "next";
import { getCategories } from "@/lib/api/catalog";
import { PageHeader } from "@/components/shared/PageHeader";
import { FilterPills } from "@/components/catalog/FilterPills";
import { ProductBrowser, type BrowseParams } from "@/components/catalog/ProductBrowser";

export const metadata: Metadata = { title: "Shop all products" };

export default async function ProductsPage({ searchParams }: { searchParams: Promise<BrowseParams> }) {
  const params = await searchParams;
  const categories = await getCategories();

  const pillHref = (category?: string) => {
    const query = new URLSearchParams();
    if (params.q) query.set("q", params.q);
    if (params.sort) query.set("sort", params.sort);
    if (category) query.set("category", category);
    const qs = query.toString();
    return qs ? `/products?${qs}` : "/products";
  };

  return (
    <div className="page-container">
      <PageHeader
        title={params.q ? "Search results" : "Shop all"}
        description="Curated electronics, fashion and lifestyle essentials."
        breadcrumbs={[{ href: "/", label: "Home" }, { label: "Shop" }]}
      />
      <ProductBrowser
        pathname="/products"
        params={params}
        filters={
          <FilterPills
            label="Filter by category"
            pills={[
              { href: pillHref(), label: "All", active: !params.category },
              ...categories.map((c) => ({ href: pillHref(c._id), label: c.name, active: params.category === c._id })),
            ]}
          />
        }
      />
    </div>
  );
}
