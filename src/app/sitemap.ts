import type { MetadataRoute } from "next";
import { getBrands, getCategories, getProducts } from "@/lib/api/catalog";
import { siteConfig } from "@/lib/config";

export const revalidate = 3600;

const staticPages = ["", "/products", "/categories", "/brands", "/about", "/help", "/contact", "/returns", "/privacy-policy", "/terms-of-service"];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [products, categories, brands] = await Promise.all([getProducts(), getCategories(), getBrands()]);
  const url = (path: string) => `${siteConfig.url}${path}`;

  return [
    ...staticPages.map((path) => ({ url: url(path || "/"), changeFrequency: "weekly" as const, priority: path ? 0.7 : 1 })),
    ...categories.map((c) => ({ url: url(`/categories/${c._id}`), changeFrequency: "weekly" as const, priority: 0.6 })),
    ...brands.map((b) => ({ url: url(`/brands/${b._id}`), changeFrequency: "weekly" as const, priority: 0.5 })),
    ...products.map((p) => ({
      url: url(`/products/${p.id}`),
      lastModified: p.updatedAt,
      changeFrequency: "daily" as const,
      priority: 0.8,
    })),
  ];
}
