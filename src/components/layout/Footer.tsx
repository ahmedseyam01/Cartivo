import Link from "next/link";
import { Mail, MapPin, Phone } from "lucide-react";
import { siteConfig } from "@/lib/config";
import { getI18n } from "@/i18n/server";
import { Logo } from "./Logo";

export function Footer() {
  const { t } = getI18n();

  const columns = [
    {
      title: t.footer.shop,
      links: [
        { href: "/products", label: t.footer.allProducts },
        { href: "/products?sort=best-selling", label: t.footer.bestSellers },
        { href: "/categories", label: t.nav.categories },
        { href: "/brands", label: t.nav.brands },
      ],
    },
    {
      title: t.footer.account,
      links: [
        { href: "/profile", label: t.menu.myAccount },
        { href: "/allorders", label: t.nav.orders },
        { href: "/wishlist", label: t.nav.wishlist },
        { href: "/cart", label: t.nav.cart },
      ],
    },
    {
      title: t.footer.help,
      links: [
        { href: "/help", label: t.footer.helpCenter },
        { href: "/contact", label: t.footer.contact },
        { href: "/returns", label: t.footer.returns },
        { href: "/about", label: t.footer.about },
      ],
    },
  ];

  return (
    <footer className="mt-24 border-t bg-white pb-20 md:pb-0">
      <div className="page-container grid gap-10 py-14 md:grid-cols-2 lg:grid-cols-5">
        <div className="lg:col-span-2">
          <Logo />
          <p className="text-muted-foreground mt-4 max-w-sm text-sm leading-relaxed">{t.meta.description}</p>
          <ul className="text-muted-foreground mt-6 space-y-2.5 text-sm">
            <li className="flex items-center gap-2.5">
              <MapPin className="size-4 shrink-0" /> {siteConfig.contact.address}
            </li>
            <li>
              <a href={`tel:${siteConfig.contact.phone.replace(/\s/g, "")}`} className="hover:text-foreground flex items-center gap-2.5">
                <Phone className="size-4 shrink-0" /> <span dir="ltr">{siteConfig.contact.phone}</span>
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
            © {new Date().getFullYear()} {siteConfig.name}. {t.footer.rights} {t.footer.credit}{" "}
            <span className="text-foreground font-semibold">Ahmed Seyam</span>.
          </p>
          <div className="flex gap-5">
            <Link href="/privacy-policy" className="hover:text-foreground">
              {t.footer.privacy}
            </Link>
            <Link href="/terms-of-service" className="hover:text-foreground">
              {t.footer.terms}
            </Link>
            <Link href="/returns" className="hover:text-foreground">
              {t.footer.returnsShort}
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
