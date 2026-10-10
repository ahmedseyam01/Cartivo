import { Star } from "lucide-react";
import { cn } from "@/lib/utils";

export function Rating({ value, count, className }: { value: number; count?: number; className?: string }) {
  return (
    <div className={cn("flex items-center gap-1 text-xs", className)} aria-label={`Rated ${value} out of 5`}>
      <Star className="size-3.5 fill-amber-400 text-amber-400" aria-hidden />
      <span className="font-semibold tabular-nums">{value.toFixed(1)}</span>
      {count !== undefined && <span className="text-muted-foreground tabular-nums">({count})</span>}
    </div>
  );
}
