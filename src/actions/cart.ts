"use server";

import { z } from "zod";
import { authedAction } from "@/lib/actions";
import { api } from "@/lib/api/http";
import { emptyCart, fetchCart, toCart } from "@/lib/api/account";
import type { CartResponse } from "@/types/commerce";

const productId = z.string().regex(/^[a-f\d]{24}$/i, "invalid");
const count = z.number().int("invalid").min(1, "invalid").max(999, "invalid");

export async function getCart() {
  return authedAction(fetchCart);
}

export async function addToCart(id: string, quantity = 1) {
  return authedAction(async (token) => {
    const product = productId.parse(id);
    const extra = count.parse(quantity) - 1;

    // The API only adds one at a time; its response holds un-populated products.
    await api("/cart", { method: "POST", body: { productId: product }, token });
    const cart = await fetchCart(token);
    if (!extra) return cart;

    const line = cart.lines.find((l) => (l.product.id ?? l.product._id) === product);
    if (!line) return cart;
    const target = Math.min(line.count + extra, line.product.quantity ?? Infinity);
    return toCart(await api<CartResponse>(`/cart/${product}`, { method: "PUT", body: { count: target }, token }));
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
