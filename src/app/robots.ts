import type { MetadataRoute } from "next";
import { protectedRoutes, guestOnlyRoutes, siteConfig } from "@/lib/config";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: "*", allow: "/", disallow: ["/api/", ...protectedRoutes, ...guestOnlyRoutes] },
    sitemap: `${siteConfig.url}/sitemap.xml`,
  };
}
