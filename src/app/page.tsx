import Image from "next/image";
import Link from "next/link";
import { getBrands, getCategories, getProducts } from "@/lib/api/catalog";
import { Hero } from "@/components/home/Hero";
import { HomeSection } from "@/components/home/Section";
import { CollectionCard } from "@/components/catalog/CollectionCard";
import { ProductGrid } from "@/components/product/ProductGrid";
import { Perks } from "@/components/shared/Perks";

export const revalidate = 3600;

export default async function HomePage() {
  const [products, categories, brands] = await Promise.all([getProducts(), getCategories(), getBrands()]);

  const bestSellers = [...products].sort((a, b) => b.sold - a.sold).slice(0, 8);
  const topRated = [...products]
    .filter((p) => !bestSellers.includes(p))
    .sort((a, b) => b.ratingsAverage - a.ratingsAverage)
    .slice(0, 4);
  const showcase = [...products].sort((a, b) => b.ratingsQuantity - a.ratingsQuantity).slice(0, 3);
  // Brands that actually have products, so every logo leads somewhere.
  const brandIds = new Set(products.map((p) => p.brand._id));
  const featuredBrands = brands.filter((b) => brandIds.has(b._id)).slice(0, 12);

  return (
    <>
      <Hero showcase={showcase} />

      <div className="page-container mt-6">
        <Perks />
      </div>

      <HomeSection title="Shop by category" href="/categories">
        <div className="no-scrollbar -mx-4 flex snap-x snap-mandatory scroll-px-4 gap-3 overflow-x-auto px-4 sm:mx-0 sm:grid sm:grid-cols-3 sm:px-0 lg:grid-cols-5">
          {categories.slice(0, 10).map((category) => (
            <div key={category._id} className="w-40 shrink-0 snap-start sm:w-auto">
              <CollectionCard href={`/categories/${category._id}`} name={category.name} image={category.image} />
            </div>
          ))}
        </div>
      </HomeSection>

      <HomeSection title="Best sellers" href="/products?sort=best-selling">
        <ProductGrid products={bestSellers} />
      </HomeSection>

      <section className="page-container mt-16 sm:mt-24">
        <div className="bg-muted flex flex-col items-start gap-6 rounded-3xl p-8 sm:flex-row sm:items-center sm:justify-between sm:p-12">
          <div>
            <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">Save it for later</h2>
            <p className="text-muted-foreground mt-2 max-w-md">
              Create a free account to build your wishlist, save addresses and check out in seconds.
            </p>
          </div>
          <Link
            href="/register"
            className="bg-foreground text-background inline-flex h-12 shrink-0 items-center rounded-full px-7 font-medium transition-opacity hover:opacity-90"
          >
            Join Cartivo
          </Link>
        </div>
      </section>

      {topRated.length > 0 && (
        <HomeSection title="Top rated" href="/products?sort=top-rated">
          <ProductGrid products={topRated} />
        </HomeSection>
      )}

      <HomeSection title="Brands we carry" href="/brands">
        <ul className="grid grid-cols-3 gap-3 sm:grid-cols-4 lg:grid-cols-6">
          {featuredBrands.map((brand) => (
            <li key={brand._id}>
              <Link
                href={`/brands/${brand._id}`}
                className="hover:border-foreground relative flex aspect-[3/2] items-center justify-center rounded-2xl border bg-white transition-colors"
              >
                <Image
                  src={brand.image}
                  alt={brand.name}
                  fill
                  sizes="(min-width: 1024px) 180px, 30vw"
                  className="object-contain p-3 grayscale transition hover:grayscale-0"
                />
              </Link>
            </li>
          ))}
        </ul>
      </HomeSection>
    </>
  );
}
