export const siteConfig = {
  name: "Cartivo",
  tagline: "Everything you love, one cart away.",
  description:
    "Cartivo is a modern online store for electronics, fashion and lifestyle products — curated brands, fair prices and fast delivery.",
  url: process.env.NEXTAUTH_URL ?? "http://localhost:3000",
  contact: {
    email: "support@cartivo.com",
    phone: "+20 109 333 3333",
    address: "123 Shop Street, 6th of October City, Egypt",
  },
} as const;

export const API_URL =
  process.env.API_URL ?? process.env.API ?? "https://ecommerce.routemisr.com/api/v1";

/** Seconds that public catalog data (products, categories, brands) stays cached. */
export const CATALOG_REVALIDATE = 3600;

export const PRODUCTS_PAGE_SIZE = 12;

export const mainNav = [
  { href: "/products", label: "Shop" },
  { href: "/categories", label: "Categories" },
  { href: "/brands", label: "Brands" },
] as const;

export const protectedRoutes = ["/cart", "/checkout", "/wishlist", "/allorders", "/profile"];
export const guestOnlyRoutes = ["/login", "/register", "/forgot-password"];
