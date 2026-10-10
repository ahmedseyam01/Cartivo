import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getCategory, getSubcategories } from "@/lib/api/catalog";
import { PageHeader } from "@/components/shared/PageHeader";
import { FilterPills } from "@/components/catalog/FilterPills";
import { ProductBrowser, type BrowseParams } from "@/components/catalog/ProductBrowser";

type Props = { params: Promise<{ categoryId: string }>; searchParams: Promise<BrowseParams> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const category = await getCategory((await params).categoryId);
  return { title: category?.name ?? "Category not found" };
}

export default async function CategoryPage({ params, searchParams }: Props) {
  const { categoryId } = await params;
  const [category, query] = await Promise.all([getCategory(categoryId), searchParams]);
  if (!category) notFound();

  const subcategories = await getSubcategories(categoryId).catch(() => []);
  const pathname = `/categories/${categoryId}`;
  const pillHref = (subcategory?: string) => {
    const qs = new URLSearchParams();
    if (query.sort) qs.set("sort", query.sort);
    if (subcategory) qs.set("subcategory", subcategory);
    return qs.size ? `${pathname}?${qs}` : pathname;
  };

  return (
    <div className="page-container">
      <PageHeader
        title={category.name}
        breadcrumbs={[{ href: "/", label: "Home" }, { href: "/categories", label: "Categories" }, { label: category.name }]}
      />
      <ProductBrowser
        pathname={pathname}
        params={query}
        scope={{ category: categoryId }}
        filters={
          subcategories.length > 1 && (
            <FilterPills
              label="Filter by type"
              pills={[
                { href: pillHref(), label: "All", active: !query.subcategory },
                ...subcategories.map((s) => ({ href: pillHref(s._id), label: s.name, active: query.subcategory === s._id })),
              ]}
            />
          )
        }
      />
    </div>
  );
}
