import { RotateCcw, ShieldCheck, Truck } from "lucide-react";
import { getI18n } from "@/i18n/server";
import { cn } from "@/lib/utils";

const icons = [Truck, RotateCcw, ShieldCheck];

export function Perks({ className, compact = false }: { className?: string; compact?: boolean }) {
  const { t } = getI18n();

  return (
    <ul className={cn("grid gap-3", compact ? "grid-cols-1" : "sm:grid-cols-3", className)}>
      {t.perks.map(({ title, text }, i) => {
        const Icon = icons[i];
        return (
          <li key={title} className="flex items-center gap-3 rounded-2xl border p-4">
            <span className="bg-muted flex size-10 shrink-0 items-center justify-center rounded-full">
              <Icon className="size-5" />
            </span>
            <div>
              <p className="text-sm font-semibold">{title}</p>
              <p className="text-muted-foreground text-xs">{text}</p>
            </div>
          </li>
        );
      })}
    </ul>
  );
}
