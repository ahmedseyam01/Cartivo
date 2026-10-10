import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { Package } from "lucide-react";
import { getAccessToken } from "@/lib/auth/session";
import { fetchOrders } from "@/lib/api/account";
import { PageHeader } from "@/components/shared/PageHeader";
import { EmptyState } from "@/components/shared/EmptyState";
import { OrderCard } from "@/components/orders/OrderCard";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = { title: "Orders" };

export default async function OrdersPage() {
  const token = await getAccessToken();
  if (!token) redirect("/login?callbackUrl=/allorders");

  const orders = await fetchOrders(token);

  return (
    <div className="page-container max-w-4xl">
      <PageHeader
        title="Your orders"
        description={orders.length ? `${orders.length} orders so far` : undefined}
        breadcrumbs={[{ href: "/", label: "Home" }, { href: "/profile", label: "Account" }, { label: "Orders" }]}
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
          title="No orders yet"
          description="When you place an order, you'll be able to track it here."
          action={
            <Button asChild size="lg" className="rounded-full">
              <Link href="/products">Start shopping</Link>
            </Button>
          }
        />
      )}
    </div>
  );
}
