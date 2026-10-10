import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getCategory, getSubcategories } from "@/lib/api/catalog";
import { getDictionary, setRequestLocale } from "@/i18n/server";
import { PageHeader } from "@/components/shared/PageHeader";
import { FilterPills } from "@/components/catalog/FilterPills";
import { ProductBrowser, type BrowseParams } from "@/components/catalog/ProductBrowser";

type Props = { params: Promise<{ locale: string; categoryId: string }>; searchParams: Promise<BrowseParams> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const category = await getCategory((await params).categoryId);
  return { title: category?.name };
}

export default async function CategoryPage({ params, searchParams }: Props) {
  const { locale, categoryId } = await params;
  const t = getDictionary(setRequestLocale(locale));
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
        breadcrumbs={[
          { href: "/", label: t.nav.home },
          { href: "/categories", label: t.nav.categories },
          { label: category.name },
        ]}
      />
      <ProductBrowser
        pathname={pathname}
        params={query}
        scope={{ category: categoryId }}
        pills={
          subcategories.length > 1 && (
            <FilterPills
              label={t.catalog.filterByType}
              pills={[
                { href: pillHref(), label: t.catalog.all, active: !query.subcategory },
                ...subcategories.map((s) => ({ href: pillHref(s._id), label: s.name, active: query.subcategory === s._id })),
              ]}
            />
          )
        }
      />
    </div>
  );
}
