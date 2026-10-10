"use server";

import { z } from "zod";
import { authedAction } from "@/lib/actions";
import { api } from "@/lib/api/http";
import { emptyCart, fetchCart, toCart } from "@/lib/api/account";
import type { CartResponse } from "@/types/commerce";

const productId = z.string().regex(/^[a-f\d]{24}$/i, "Invalid product");
const count = z.number().int().min(1).max(999);

export async function getCart() {
  return authedAction(fetchCart);
}

export async function addToCart(id: string) {
  return authedAction(async (token) => {
    // The POST response contains un-populated products, so re-read the full cart.
    await api("/cart", { method: "POST", body: { productId: productId.parse(id) }, token });
    return fetchCart(token);
  });
}

export async function updateCartLine(id: string, quantity: number) {
  return authedAction(async (token) =>
    toCart(
      await api<CartResponse>(`/cart/${productId.parse(id)}`, {
        method: "PUT",
        body: { count: count.parse(quantity) },
        token,
      }),
    ),
  );
}

export async function removeCartLine(id: string) {
  return authedAction(async (token) =>
    toCart(await api<CartResponse>(`/cart/${productId.parse(id)}`, { method: "DELETE", token })),
  );
}

export async function clearCart() {
  return authedAction(async (token) => {
    await api("/cart", { method: "DELETE", token });
    return emptyCart;
  });
}
