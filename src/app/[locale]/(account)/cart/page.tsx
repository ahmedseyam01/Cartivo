import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getAccessToken } from "@/lib/auth/session";
import { fetchCart } from "@/lib/api/account";
import { getDictionary, setRequestLocale } from "@/i18n/server";
import { PageHeader } from "@/components/shared/PageHeader";
import { CartView } from "@/components/cart/CartView";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  return { title: getDictionary(setRequestLocale((await params).locale)).cart.title };
}

export default async function CartPage({ params }: Props) {
  const t = getDictionary(setRequestLocale((await params).locale));
  const token = await getAccessToken();
  if (!token) redirect("/login?callbackUrl=/cart");

  const cart = await fetchCart(token);

  return (
    <div className="page-container">
      <PageHeader title={t.cart.title} breadcrumbs={[{ href: "/", label: t.nav.home }, { label: t.nav.cart }]} />
      <CartView initialCart={cart} />
    </div>
  );
}
