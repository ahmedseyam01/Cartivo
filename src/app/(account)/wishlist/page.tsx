import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getAccessToken } from "@/lib/auth/session";
import { fetchWishlist } from "@/lib/api/account";
import { PageHeader } from "@/components/shared/PageHeader";
import { ProductCard } from "@/components/product/ProductCard";
import { WishlistGrid } from "@/components/product/WishlistGrid";

export const metadata: Metadata = { title: "Wishlist" };

export default async function WishlistPage() {
  const token = await getAccessToken();
  if (!token) redirect("/login?callbackUrl=/wishlist");

  const products = await fetchWishlist(token);

  return (
    <div className="page-container">
      <PageHeader title="Wishlist" breadcrumbs={[{ href: "/", label: "Home" }, { label: "Wishlist" }]} />
      <WishlistGrid products={products}>
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </WishlistGrid>
    </div>
  );
}
