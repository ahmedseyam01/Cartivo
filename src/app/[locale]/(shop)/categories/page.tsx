import type { Metadata } from "next";
import { getCategories } from "@/lib/api/catalog";
import { format } from "@/i18n/config";
import { getDictionary, setRequestLocale } from "@/i18n/server";
import { PageHeader } from "@/components/shared/PageHeader";
import { CatalogTabs } from "@/components/catalog/CatalogTabs";
import { CollectionCard } from "@/components/catalog/CollectionCard";

type Props = { params: Promise<{ locale: string }> };

export const revalidate = 3600;

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  return { title: getDictionary(setRequestLocale((await params).locale)).nav.categories };
}

export default async function CategoriesPage({ params }: Props) {
  const t = getDictionary(setRequestLocale((await params).locale));
  const categories = await getCategories();

  return (
    <div className="page-container">
      <PageHeader
        title={t.nav.categories}
        description={format(t.catalog.categoriesDescription, { count: categories.length })}
        breadcrumbs={[{ href: "/", label: t.nav.home }, { label: t.nav.categories }]}
        action={<CatalogTabs active="categories" />}
      />
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
        {categories.map((category, i) => (
          <CollectionCard
            key={category._id}
            href={`/categories/${category._id}`}
            name={category.name}
            image={category.image}
            priority={i < 4}
          />
        ))}
      </div>
    </div>
  );
}
