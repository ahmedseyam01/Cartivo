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
  return (
    <div className={cn("bg-muted/60 rounded-2xl p-6", className)}>
      <h2 className="text-lg font-semibold">Order summary</h2>
      <dl className="mt-5 space-y-3 text-sm">
        <div className="flex justify-between">
          <dt className="text-muted-foreground">
            Subtotal ({itemCount} {itemCount === 1 ? "item" : "items"})
          </dt>
          <dd className="font-medium tabular-nums">{formatPrice(total)}</dd>
        </div>
        <div className="flex justify-between">
          <dt className="text-muted-foreground">Shipping</dt>
          <dd className="font-medium">Free</dd>
        </div>
        <div className="flex justify-between border-t pt-4 text-base">
          <dt className="font-semibold">Total</dt>
          <dd className="font-bold tabular-nums">{formatPrice(total)}</dd>
        </div>
      </dl>
      {children && <div className="mt-6 space-y-3">{children}</div>}
    </div>
  );
}
