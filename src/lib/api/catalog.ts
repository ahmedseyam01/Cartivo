import "server-only";
import { cache } from "react";
import { PRODUCTS_PAGE_SIZE } from "@/lib/config";
import type {
  Brand,
  Category,
  Paginated,
  Product,
  ProductPage,
  ProductQuery,
  ProductSort,
  Subcategory,
} from "@/types/catalog";
import { api, ApiError } from "./http";

/** The API caps `limit` at 50, so collections are fetched page by page in parallel. */
async function fetchAll<T>(path: string): Promise<T[]> {
  const separator = path.includes("?") ? "&" : "?";
  const first = await api<Paginated<T>>(`${path}${separator}limit=50&page=1`);
  const pages = first.metadata?.numberOfPages ?? 1;
  if (pages <= 1) return first.data;

  const rest = await Promise.all(
    Array.from({ length: pages - 1 }, (_, i) => api<Paginated<T>>(`${path}${separator}limit=50&page=${i + 2}`)),
  );
  return first.data.concat(...rest.map((page) => page.data));
}

async function fetchOne<T>(path: string): Promise<T | null> {
  try {
    const { data } = await api<{ data: T | null }>(path);
    return data ?? null;
  } catch (error) {
    if (error instanceof ApiError && (error.status === 404 || error.status === 400)) return null;
    throw error;
  }
}

export const getProducts = cache(() => fetchAll<Product>("/products"));
export const getCategories = cache(() => fetchAll<Category>("/categories"));
export const getBrands = cache(() => fetchAll<Brand>("/brands"));

export const getProduct = cache(async (id: string) => {
  const products = await getProducts();
  return products.find((product) => product.id === id) ?? fetchOne<Product>(`/products/${id}`);
});

export const getCategory = cache(async (id: string) => {
  const categories = await getCategories();
  return categories.find((category) => category._id === id) ?? fetchOne<Category>(`/categories/${id}`);
});

export const getBrand = cache(async (id: string) => {
  const brands = await getBrands();
  return brands.find((brand) => brand._id === id) ?? fetchOne<Brand>(`/brands/${id}`);
});

export const getSubcategories = cache((categoryId: string) =>
  fetchAll<Subcategory>(`/categories/${categoryId}/subcategories`),
);

export function effectivePrice(product: Pick<Product, "price" | "priceAfterDiscount">) {
  return product.priceAfterDiscount ?? product.price;
}

const sorters: Record<ProductSort, (a: Product, b: Product) => number> = {
  featured: (a, b) => b.ratingsQuantity * b.ratingsAverage - a.ratingsQuantity * a.ratingsAverage,
  "best-selling": (a, b) => b.sold - a.sold,
  "top-rated": (a, b) => b.ratingsAverage - a.ratingsAverage,
  "price-asc": (a, b) => effectivePrice(a) - effectivePrice(b),
  "price-desc": (a, b) => effectivePrice(b) - effectivePrice(a),
  newest: (a, b) => Date.parse(b.createdAt) - Date.parse(a.createdAt),
};

export function isProductSort(value: unknown): value is ProductSort {
  return typeof value === "string" && value in sorters;
}

/**
 * Search, filter, sort and paginate the catalog on the server.
 * The backend's own keyword search is unreliable, and the catalog is small and cached,
 * so doing it here is both faster and correct.
 */
export async function queryProducts({
  q,
  category,
  brand,
  subcategory,
  minPrice,
  maxPrice,
  inStock,
  sort = "featured",
  page = 1,
  pageSize = PRODUCTS_PAGE_SIZE,
}: ProductQuery): Promise<ProductPage> {
  const term = q?.trim().toLowerCase();

  const items = (await getProducts())
    .filter((product) => {
      if (category && product.category._id !== category) return false;
      if (brand && product.brand._id !== brand) return false;
      if (subcategory && !product.subcategory.some((s) => s._id === subcategory)) return false;
      if (inStock && product.quantity <= 0) return false;
      const price = effectivePrice(product);
      if (minPrice !== undefined && price < minPrice) return false;
      if (maxPrice !== undefined && price > maxPrice) return false;
      if (!term) return true;
      return [product.title, product.brand.name, product.category.name, ...product.subcategory.map((s) => s.name)]
        .join(" ")
        .toLowerCase()
        .includes(term);
    })
    .sort(sorters[sort]);

  const pageCount = Math.max(1, Math.ceil(items.length / pageSize));
  const current = Math.min(Math.max(1, page), pageCount);

  return {
    items: items.slice((current - 1) * pageSize, current * pageSize),
    total: items.length,
    page: current,
    pageCount,
  };
}

export async function getRelatedProducts(product: Product, limit = 4) {
  const products = await getProducts();
  return products
    .filter((p) => p.category._id === product.category._id && p.id !== product.id)
    .sort(sorters["best-selling"])
    .slice(0, limit);
}
