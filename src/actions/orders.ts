"use server";

import { headers } from "next/headers";
import { authedAction } from "@/lib/actions";
import { api } from "@/lib/api/http";
import { siteConfig } from "@/lib/config";
import { shippingSchema, type ShippingValues } from "@/lib/validations";
import type { PaymentMethod } from "@/types/commerce";

type CheckoutResult = { method: "cash" } | { method: "card"; url: string };

async function getOrigin() {
  const h = await headers();
  const host = h.get("x-forwarded-host") ?? h.get("host");
  if (!host) return siteConfig.url;
  const protocol = h.get("x-forwarded-proto") ?? (host.startsWith("localhost") ? "http" : "https");
  return `${protocol}://${host}`;
}

export async function placeOrder(cartId: string, values: ShippingValues, method: PaymentMethod) {
  return authedAction<CheckoutResult>(async (token) => {
    const shippingAddress = shippingSchema.parse(values);
    const id = encodeURIComponent(cartId);

    if (method === "cash") {
      await api(`/orders/${id}`, { method: "POST", body: { shippingAddress }, token });
      return { method: "cash" };
    }

    // Stripe redirects back to `${url}/allorders` once payment succeeds.
    const origin = encodeURIComponent(await getOrigin());
    const { session } = await api<{ session: { url: string } }>(`/orders/checkout-session/${id}?url=${origin}`, {
      method: "POST",
      body: { shippingAddress },
      token,
    });
    return { method: "card", url: session.url };
  });
}
