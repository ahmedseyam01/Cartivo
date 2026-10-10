import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { getBrand } from "@/lib/api/catalog";
import { getDictionary, setRequestLocale } from "@/i18n/server";
import { PageHeader } from "@/components/shared/PageHeader";
import { ProductBrowser, type BrowseParams } from "@/components/catalog/ProductBrowser";

type Props = { params: Promise<{ locale: string; brandId: string }>; searchParams: Promise<BrowseParams> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const brand = await getBrand((await params).brandId);
  return { title: brand?.name };
}

export default async function BrandPage({ params, searchParams }: Props) {
  const { locale, brandId } = await params;
  const t = getDictionary(setRequestLocale(locale));
  const [brand, query] = await Promise.all([getBrand(brandId), searchParams]);
  if (!brand) notFound();

  return (
    <div className="page-container">
      <PageHeader
        title={brand.name}
        breadcrumbs={[{ href: "/", label: t.nav.home }, { href: "/brands", label: t.nav.brands }, { label: brand.name }]}
        action={
          <div className="relative hidden h-16 w-28 rounded-xl border bg-white sm:block">
            <Image src={brand.image} alt="" fill sizes="112px" className="object-contain p-2" />
          </div>
        }
      />
      <ProductBrowser pathname={`/brands/${brandId}`} params={query} scope={{ brand: brandId }} />
    </div>
  );
}
