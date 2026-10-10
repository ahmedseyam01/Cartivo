import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getAccessToken } from "@/lib/auth/session";
import { fetchWishlist } from "@/lib/api/account";
import { PageHeader } from "@/components/shared/PageHeader";
import { ProductCard } from "@/components/product/ProductCard";
import { WishlistGrid } from "@/components/product/WishlistGrid";
import { getDictionary, setRequestLocale } from "@/i18n/server";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  return { title: getDictionary(setRequestLocale((await params).locale)).wishlist.title };
}

export default async function WishlistPage({ params }: Props) {
  const t = getDictionary(setRequestLocale((await params).locale));
  const token = await getAccessToken();
  if (!token) redirect("/login?callbackUrl=/wishlist");

  const products = await fetchWishlist(token);

  return (
    <div className="page-container">
      <PageHeader title={t.wishlist.title} breadcrumbs={[{ href: "/", label: t.nav.home }, { label: t.nav.wishlist }]} />
      <WishlistGrid products={products}>
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </WishlistGrid>
    </div>
  );
}
