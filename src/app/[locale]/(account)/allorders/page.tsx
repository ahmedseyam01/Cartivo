import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { Package } from "lucide-react";
import { getAccessToken } from "@/lib/auth/session";
import { fetchOrders } from "@/lib/api/account";
import { format } from "@/i18n/config";
import { getDictionary, setRequestLocale } from "@/i18n/server";
import { PageHeader } from "@/components/shared/PageHeader";
import { EmptyState } from "@/components/shared/EmptyState";
import { OrderCard } from "@/components/orders/OrderCard";
import { Button } from "@/components/ui/button";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  return { title: getDictionary(setRequestLocale((await params).locale)).nav.orders };
}

export default async function OrdersPage({ params }: Props) {
  const t = getDictionary(setRequestLocale((await params).locale));
  const token = await getAccessToken();
  if (!token) redirect("/login?callbackUrl=/allorders");

  const orders = await fetchOrders(token);

  return (
    <div className="page-container max-w-4xl">
      <PageHeader
        title={t.orders.title}
        description={orders.length ? format(t.orders.count, { count: orders.length }) : undefined}
        breadcrumbs={[{ href: "/", label: t.nav.home }, { href: "/profile", label: t.nav.account }, { label: t.nav.orders }]}
      />
      {orders.length ? (
        <div className="space-y-4">
          {orders.map((order) => (
            <OrderCard key={order._id} order={order} />
          ))}
        </div>
      ) : (
        <EmptyState
          icon={Package}
          title={t.orders.empty}
          description={t.orders.emptyText}
          action={
            <Button asChild size="lg" className="rounded-full">
              <Link href="/products">{t.cart.startShopping}</Link>
            </Button>
          }
        />
      )}
    </div>
  );
}
