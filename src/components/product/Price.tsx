import { getI18n } from "@/i18n/server";
import { formatPrice } from "@/lib/format";
import { cn } from "@/lib/utils";

export function Price({ price, discounted, className }: { price: number; discounted?: number; className?: string }) {
  const { locale } = getI18n();
  const onSale = discounted !== undefined && discounted < price;

  return (
    <div className={cn("flex flex-wrap items-baseline gap-x-2", className)}>
      <span className="font-semibold tabular-nums">{formatPrice(onSale ? discounted : price, locale)}</span>
      {onSale && <s className="text-muted-foreground text-[0.8em] tabular-nums">{formatPrice(price, locale)}</s>}
    </div>
  );
}

export function discountPercent(price: number, discounted?: number) {
  if (discounted === undefined || discounted >= price) return 0;
  return Math.round(((price - discounted) / price) * 100);
}
