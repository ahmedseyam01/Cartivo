import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { getI18n } from "@/i18n/server";
import { cn } from "@/lib/utils";

type Crumb = { href?: string; label: string };

export function PageHeader({
  title,
  description,
  breadcrumbs,
  action,
  className,
}: {
  title?: string;
  description?: React.ReactNode;
  breadcrumbs?: Crumb[];
  action?: React.ReactNode;
  className?: string;
}) {
  const { t } = getI18n();

  return (
    <div className={cn("flex flex-col gap-4 pt-6 pb-6 sm:flex-row sm:items-end sm:justify-between sm:pt-10", className)}>
      <div className="min-w-0">
        {breadcrumbs && (
          <nav aria-label={t.nav.breadcrumb} className="text-muted-foreground mb-3 flex flex-wrap items-center gap-1 text-xs">
            {breadcrumbs.map((crumb, i) => (
              <span key={crumb.label} className="flex items-center gap-1">
                {i > 0 && <ChevronRight className="size-3 rtl:rotate-180" />}
                {crumb.href ? (
                  <Link href={crumb.href} className="hover:text-foreground">
                    {crumb.label}
                  </Link>
                ) : (
                  <span className="text-foreground">{crumb.label}</span>
                )}
              </span>
            ))}
          </nav>
        )}
        {title && <h1 className="text-3xl font-bold tracking-tight text-balance sm:text-4xl">{title}</h1>}
        {description && <p className="text-muted-foreground mt-2 text-sm sm:text-base">{description}</p>}
      </div>
      {action}
    </div>
  );
}
