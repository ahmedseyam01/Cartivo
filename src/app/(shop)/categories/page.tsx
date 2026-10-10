import type { Metadata } from "next";
import { getCategories } from "@/lib/api/catalog";
import { PageHeader } from "@/components/shared/PageHeader";
import { CollectionCard } from "@/components/catalog/CollectionCard";

export const metadata: Metadata = { title: "Categories" };
export const revalidate = 3600;

export default async function CategoriesPage() {
  const categories = await getCategories();

  return (
    <div className="page-container">
      <PageHeader
        title="Categories"
        description={`${categories.length} departments to explore.`}
        breadcrumbs={[{ href: "/", label: "Home" }, { label: "Categories" }]}
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
