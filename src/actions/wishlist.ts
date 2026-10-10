"use server";

import { z } from "zod";
import { authedAction } from "@/lib/actions";
import { api } from "@/lib/api/http";
import { fetchWishlist } from "@/lib/api/account";

const productId = z.string().regex(/^[a-f\d]{24}$/i, "Invalid product");

type WishlistIdsResponse = { data: string[] };

export async function getWishlistIds() {
  return authedAction(async (token) => (await fetchWishlist(token)).map((product) => product.id));
}

export async function addToWishlist(id: string) {
  return authedAction(
    async (token) =>
      (await api<WishlistIdsResponse>("/wishlist", { method: "POST", body: { productId: productId.parse(id) }, token }))
        .data,
  );
}

export async function removeFromWishlist(id: string) {
  return authedAction(
    async (token) =>
      (await api<WishlistIdsResponse>(`/wishlist/${productId.parse(id)}`, { method: "DELETE", token })).data,
  );
}
