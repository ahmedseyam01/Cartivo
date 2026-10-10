"use client";

import { useI18n } from "@/i18n/I18nProvider";
import { format } from "@/i18n/config";
import { formatPrice } from "@/lib/format";
import { cn } from "@/lib/utils";

export function OrderSummary({
  itemCount,
  total,
  children,
  className,
}: {
  itemCount: number;
  total: number;
  children?: React.ReactNode;
  className?: string;
}) {
  const { locale, t } = useI18n();

  return (
    <div className={cn("bg-muted/60 rounded-2xl p-6", className)}>
      <h2 className="text-lg font-semibold">{t.summary.title}</h2>
      <dl className="mt-5 space-y-3 text-sm">
        <div className="flex justify-between">
          <dt className="text-muted-foreground">{format(t.summary.subtotal, { count: itemCount })}</dt>
          <dd className="font-medium tabular-nums">{formatPrice(total, locale)}</dd>
        </div>
        <div className="flex justify-between">
          <dt className="text-muted-foreground">{t.summary.shipping}</dt>
          <dd className="font-medium">{t.summary.free}</dd>
        </div>
        <div className="flex justify-between border-t pt-4 text-base">
          <dt className="font-semibold">{t.summary.total}</dt>
          <dd className="font-bold tabular-nums">{formatPrice(total, locale)}</dd>
        </div>
      </dl>
      {children && <div className="mt-6 space-y-3">{children}</div>}
    </div>
  );
}
