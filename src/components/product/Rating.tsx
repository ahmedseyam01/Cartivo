import { Star } from "lucide-react";
import { format } from "@/i18n/config";
import { getI18n } from "@/i18n/server";
import { cn } from "@/lib/utils";

export function Rating({ value, count, className }: { value: number; count?: number; className?: string }) {
  const { t } = getI18n();

  return (
    <div className={cn("flex items-center gap-1 text-xs", className)} aria-label={format(t.product.rated, { value })}>
      <Star className="size-3.5 fill-amber-400 text-amber-400" aria-hidden />
      <span className="font-semibold tabular-nums">{value.toFixed(1)}</span>
      {count !== undefined && <span className="text-muted-foreground tabular-nums">({count})</span>}
    </div>
  );
}
