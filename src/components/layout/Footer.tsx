import Link from "next/link";
import { Mail, MapPin, Phone } from "lucide-react";
import { siteConfig } from "@/lib/config";
import { Logo } from "./Logo";

const columns = [
  {
    title: "Shop",
    links: [
      { href: "/products", label: "All products" },
      { href: "/products?sort=best-selling", label: "Best sellers" },
      { href: "/categories", label: "Categories" },
      { href: "/brands", label: "Brands" },
    ],
  },
  {
    title: "Account",
    links: [
      { href: "/profile", label: "My account" },
      { href: "/allorders", label: "Orders" },
      { href: "/wishlist", label: "Wishlist" },
      { href: "/cart", label: "Cart" },
    ],
  },
  {
    title: "Help",
    links: [
      { href: "/help", label: "Help center" },
      { href: "/contact", label: "Contact us" },
      { href: "/returns", label: "Returns & exchanges" },
      { href: "/about", label: `About ${siteConfig.name}` },
    ],
  },
];

export function Footer() {
  return (
    <footer className="mt-24 border-t bg-white pb-20 md:pb-0">
      <div className="page-container grid gap-10 py-14 md:grid-cols-2 lg:grid-cols-5">
        <div className="lg:col-span-2">
          <Logo />
          <p className="text-muted-foreground mt-4 max-w-sm text-sm leading-relaxed">{siteConfig.description}</p>
          <ul className="text-muted-foreground mt-6 space-y-2.5 text-sm">
            <li className="flex items-center gap-2.5">
              <MapPin className="size-4 shrink-0" /> {siteConfig.contact.address}
            </li>
            <li>
              <a href={`tel:${siteConfig.contact.phone.replace(/\s/g, "")}`} className="hover:text-foreground flex items-center gap-2.5">
                <Phone className="size-4 shrink-0" /> {siteConfig.contact.phone}
              </a>
            </li>
            <li>
              <a href={`mailto:${siteConfig.contact.email}`} className="hover:text-foreground flex items-center gap-2.5">
                <Mail className="size-4 shrink-0" /> {siteConfig.contact.email}
              </a>
            </li>
          </ul>
        </div>

        {columns.map((column) => (
          <div key={column.title}>
            <h3 className="text-sm font-semibold">{column.title}</h3>
            <ul className="mt-4 space-y-2.5">
              {column.links.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-muted-foreground hover:text-foreground text-sm transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div className="border-t">
        <div className="page-container text-muted-foreground flex flex-col gap-3 py-6 text-xs sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {new Date().getFullYear()} {siteConfig.name}. All rights reserved. Designed &amp; developed by{" "}
            <span className="text-foreground font-semibold">Ahmed Seyam</span>.
          </p>
          <div className="flex gap-5">
            <Link href="/privacy-policy" className="hover:text-foreground">
              Privacy
            </Link>
            <Link href="/terms-of-service" className="hover:text-foreground">
              Terms
            </Link>
            <Link href="/returns" className="hover:text-foreground">
              Returns
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
