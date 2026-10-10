import type { Metadata } from "next";
import { getBrands } from "@/lib/api/catalog";
import { format } from "@/i18n/config";
import { getDictionary, setRequestLocale } from "@/i18n/server";
import { PageHeader } from "@/components/shared/PageHeader";
import { CatalogTabs } from "@/components/catalog/CatalogTabs";
import { CollectionCard } from "@/components/catalog/CollectionCard";

type Props = { params: Promise<{ locale: string }> };

export const revalidate = 3600;

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  return { title: getDictionary(setRequestLocale((await params).locale)).nav.brands };
}

export default async function BrandsPage({ params }: Props) {
  const t = getDictionary(setRequestLocale((await params).locale));
  const brands = (await getBrands()).sort((a, b) => a.name.localeCompare(b.name));

  return (
    <div className="page-container">
      <PageHeader
        title={t.nav.brands}
        description={format(t.catalog.brandsDescription, { count: brands.length })}
        breadcrumbs={[{ href: "/", label: t.nav.home }, { label: t.nav.brands }]}
        action={<CatalogTabs active="brands" />}
      />
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4 lg:grid-cols-6">
        {brands.map((brand, i) => (
          <CollectionCard
            key={brand._id}
            href={`/brands/${brand._id}`}
            name={brand.name}
            image={brand.image}
            variant="logo"
            priority={i < 6}
          />
        ))}
      </div>
    </div>
  );
}
