import Image from "next/image";
import Link from "next/link";
import { ChevronDown } from "lucide-react";
import { formatDate, formatPrice } from "@/lib/format";
import { cn } from "@/lib/utils";
import type { Order } from "@/types/commerce";

function StatusPill({ done, children }: { done: boolean; children: React.ReactNode }) {
  return (
    <span
      className={cn(
        "rounded-full px-2.5 py-1 text-xs font-medium",
        done ? "bg-foreground text-background" : "border text-muted-foreground",
      )}
    >
      {children}
    </span>
  );
}

export function OrderCard({ order }: { order: Order }) {
  const itemCount = order.cartItems.reduce((sum, item) => sum + item.count, 0);

  return (
    <article className="overflow-hidden rounded-2xl border">
      <header className="bg-muted/50 flex flex-wrap items-center justify-between gap-3 px-5 py-4">
        <div>
          <h2 className="font-semibold">Order #{order.id}</h2>
          <p className="text-muted-foreground text-xs">Placed {formatDate(order.createdAt)}</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <StatusPill done={order.isPaid}>{order.isPaid ? "Paid" : "Payment pending"}</StatusPill>
          <StatusPill done={order.isDelivered}>{order.isDelivered ? "Delivered" : "Processing"}</StatusPill>
        </div>
      </header>

      <div className="flex flex-wrap items-center justify-between gap-4 px-5 py-4">
        <div className="flex -space-x-3">
          {order.cartItems.slice(0, 4).map((item) => (
            <div key={item._id} className="bg-muted relative size-14 overflow-hidden rounded-xl ring-2 ring-white">
              <Image src={item.product.imageCover} alt="" fill sizes="56px" className="object-cover" />
            </div>
          ))}
          {order.cartItems.length > 4 && (
            <div className="bg-muted flex size-14 items-center justify-center rounded-xl text-sm font-semibold ring-2 ring-white">
              +{order.cartItems.length - 4}
            </div>
          )}
        </div>
        <dl className="flex gap-8 text-sm">
          <div>
            <dt className="text-muted-foreground text-xs">Items</dt>
            <dd className="font-medium">{itemCount}</dd>
          </div>
          <div>
            <dt className="text-muted-foreground text-xs">Payment</dt>
            <dd className="font-medium">{order.paymentMethodType === "card" ? "Card" : "Cash"}</dd>
          </div>
          <div>
            <dt className="text-muted-foreground text-xs">Total</dt>
            <dd className="font-semibold tabular-nums">{formatPrice(order.totalOrderPrice)}</dd>
          </div>
        </dl>
      </div>

      <details className="group border-t">
        <summary className="hover:bg-muted/40 flex cursor-pointer list-none items-center justify-between px-5 py-3 text-sm font-medium [&::-webkit-details-marker]:hidden">
          Order details
          <ChevronDown className="size-4 transition-transform group-open:rotate-180" />
        </summary>
        <div className="space-y-5 px-5 pb-5">
          <ul className="divide-y">
            {order.cartItems.map((item) => (
              <li key={item._id} className="flex items-center gap-3 py-3">
                <div className="bg-muted relative size-12 shrink-0 overflow-hidden rounded-lg">
                  <Image src={item.product.imageCover} alt="" fill sizes="48px" className="object-cover" />
                </div>
                <Link href={`/products/${item.product.id ?? item.product._id}`} className="line-clamp-1 flex-1 text-sm hover:underline">
                  {item.product.title}
                </Link>
                <span className="text-muted-foreground text-xs">×{item.count}</span>
                <span className="w-24 text-right text-sm font-medium tabular-nums">{formatPrice(item.price * item.count)}</span>
              </li>
            ))}
          </ul>
          {order.shippingAddress && (
            <div className="text-sm">
              <p className="font-medium">Shipping to</p>
              <p className="text-muted-foreground">
                {order.shippingAddress.details}, {order.shippingAddress.city} · {order.shippingAddress.phone}
              </p>
            </div>
          )}
        </div>
      </details>
    </article>
  );
}
