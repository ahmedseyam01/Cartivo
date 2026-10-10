import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getAccessToken } from "@/lib/auth/session";
import { fetchAddresses, fetchCart } from "@/lib/api/account";
import { getDictionary, setRequestLocale } from "@/i18n/server";
import { PageHeader } from "@/components/shared/PageHeader";
import { CheckoutForm } from "@/components/checkout/CheckoutForm";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  return { title: getDictionary(setRequestLocale((await params).locale)).nav.checkout };
}

export default async function CheckoutPage({ params }: Props) {
  const t = getDictionary(setRequestLocale((await params).locale));
  const token = await getAccessToken();
  if (!token) redirect("/login?callbackUrl=/checkout");

  const [cart, addresses] = await Promise.all([fetchCart(token), fetchAddresses(token).catch(() => [])]);
  if (!cart.lines.length) redirect("/cart");

  return (
    <div className="page-container">
      <PageHeader
        title={t.nav.checkout}
        breadcrumbs={[{ href: "/", label: t.nav.home }, { href: "/cart", label: t.nav.cart }, { label: t.nav.checkout }]}
      />
      <CheckoutForm cart={cart} addresses={addresses} />
    </div>
  );
}
