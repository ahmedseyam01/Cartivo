import type { Brand, Category, Product } from "./catalog";

/** Product shape the API embeds inside cart and order lines. */
export type LineProduct = Pick<Product, "_id" | "id" | "title" | "imageCover" | "ratingsAverage"> & {
  /** Units in stock (present on populated cart lines). */
  quantity?: number;
  category: Category;
  brand: Brand;
};

export interface CartLine {
  _id: string;
  count: number;
  price: number;
  product: LineProduct;
}

export interface Cart {
  id: string | null;
  lines: CartLine[];
  itemCount: number;
  total: number;
}

export interface CartResponse {
  status: string;
  numOfCartItems: number;
  cartId: string;
  data: {
    _id: string;
    products: CartLine[];
    totalCartPrice: number;
  };
}

export interface ShippingAddress {
  details: string;
  city: string;
  phone: string;
}

export interface Address extends ShippingAddress {
  _id: string;
  name: string;
}

export type PaymentMethod = "cash" | "card";

export interface Order {
  _id: string;
  id: number;
  shippingAddress?: ShippingAddress;
  taxPrice: number;
  shippingPrice: number;
  totalOrderPrice: number;
  paymentMethodType: PaymentMethod;
  isPaid: boolean;
  isDelivered: boolean;
  paidAt?: string;
  cartItems: CartLine[];
  createdAt: string;
  updatedAt: string;
}
