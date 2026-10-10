import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getAccessToken } from "@/lib/auth/session";
import { fetchCart } from "@/lib/api/account";
import { PageHeader } from "@/components/shared/PageHeader";
import { CartView } from "@/components/cart/CartView";

export const metadata: Metadata = { title: "Cart" };

export default async function CartPage() {
  const token = await getAccessToken();
  if (!token) redirect("/login?callbackUrl=/cart");

  const cart = await fetchCart(token);

  return (
    <div className="page-container">
      <PageHeader title="Shopping cart" breadcrumbs={[{ href: "/", label: "Home" }, { label: "Cart" }]} />
      <CartView initialCart={cart} />
    </div>
  );
}
