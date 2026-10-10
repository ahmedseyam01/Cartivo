import Link from "next/link";
import { getI18n } from "@/i18n/server";
import { cn } from "@/lib/utils";

/** Categories ⇄ Brands switch, so brands are one tap away on phones too. */
export function CatalogTabs({ active }: { active: "categories" | "brands" }) {
  const { t } = getI18n();
  const tabs = [
    { key: "categories", href: "/categories", label: t.nav.categories },
    { key: "brands", href: "/brands", label: t.nav.brands },
  ] as const;

  return (
    <nav className="bg-muted inline-flex rounded-full p-1">
      {tabs.map((tab) => (
        <Link
          key={tab.key}
          href={tab.href}
          aria-current={tab.key === active ? "page" : undefined}
          className={cn(
            "rounded-full px-5 py-2 text-sm font-medium transition-colors",
            tab.key === active ? "bg-white shadow-sm" : "text-muted-foreground hover:text-foreground",
          )}
        >
          {tab.label}
        </Link>
      ))}
    </nav>
  );
}
