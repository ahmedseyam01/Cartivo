import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { getI18n } from "@/i18n/server";

export function HomeSection({
  title,
  href,
  linkLabel,
  children,
}: {
  title: string;
  href?: string;
  linkLabel?: string;
  children: React.ReactNode;
}) {
  return (
    <section className="page-container mt-16 sm:mt-24">
      <div className="mb-6 flex items-end justify-between gap-4">
        <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">{title}</h2>
        {href && (
          <Link href={href} className="group flex shrink-0 items-center gap-1 text-sm font-medium">
            {linkLabel ?? getI18n().t.product.viewAll}
            <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5 rtl:rotate-180 rtl:group-hover:-translate-x-0.5" />
          </Link>
        )}
      </div>
      {children}
    </section>
  );
}
