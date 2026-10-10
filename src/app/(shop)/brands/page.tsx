import type { Metadata } from "next";
import { getBrands } from "@/lib/api/catalog";
import { PageHeader } from "@/components/shared/PageHeader";
import { CollectionCard } from "@/components/catalog/CollectionCard";

export const metadata: Metadata = { title: "Brands" };
export const revalidate = 3600;

export default async function BrandsPage() {
  const brands = (await getBrands()).sort((a, b) => a.name.localeCompare(b.name));

  return (
    <div className="page-container">
      <PageHeader
        title="Brands"
        description={`${brands.length} brands we love.`}
        breadcrumbs={[{ href: "/", label: "Home" }, { label: "Brands" }]}
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
