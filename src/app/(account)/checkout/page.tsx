import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getAccessToken } from "@/lib/auth/session";
import { fetchAddresses, fetchCart } from "@/lib/api/account";
import { PageHeader } from "@/components/shared/PageHeader";
import { CheckoutForm } from "@/components/checkout/CheckoutForm";

export const metadata: Metadata = { title: "Checkout" };

export default async function CheckoutPage() {
  const token = await getAccessToken();
  if (!token) redirect("/login?callbackUrl=/checkout");

  const [cart, addresses] = await Promise.all([fetchCart(token), fetchAddresses(token).catch(() => [])]);
  if (!cart.lines.length) redirect("/cart");

  return (
    <div className="page-container">
      <PageHeader
        title="Checkout"
        breadcrumbs={[{ href: "/", label: "Home" }, { href: "/cart", label: "Cart" }, { label: "Checkout" }]}
      />
      <CheckoutForm cart={cart} addresses={addresses} />
    </div>
  );
}
