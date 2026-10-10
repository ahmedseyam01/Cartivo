import "server-only";
import { jwtDecode } from "jwt-decode";
import type { Product } from "@/types/catalog";
import type { Address, Cart, CartResponse, Order } from "@/types/commerce";
import { api, ApiError } from "./http";

export const emptyCart: Cart = { id: null, lines: [], itemCount: 0, total: 0 };

export function toCart(response: CartResponse): Cart {
  const lines = response.data?.products ?? [];
  return {
    id: response.cartId ?? response.data?._id ?? null,
    lines,
    itemCount: lines.reduce((sum, line) => sum + line.count, 0),
    total: response.data?.totalCartPrice ?? 0,
  };
}

export async function fetchCart(token: string): Promise<Cart> {
  try {
    return toCart(await api<CartResponse>("/cart", { token }));
  } catch (error) {
    // The API answers 404 when the user has never created a cart.
    if (error instanceof ApiError && error.status === 404) return emptyCart;
    throw error;
  }
}

export async function fetchWishlist(token: string) {
  const { data } = await api<{ data: Product[] }>("/wishlist", { token });
  return data;
}

export async function fetchAddresses(token: string) {
  const { data } = await api<{ data: Address[] }>("/addresses", { token });
  return data;
}

export async function fetchOrders(token: string) {
  const { id } = jwtDecode<{ id: string }>(token);
  const orders = await api<Order[]>(`/orders/user/${id}`, { token });
  return orders.sort((a, b) => Date.parse(b.createdAt) - Date.parse(a.createdAt));
}
