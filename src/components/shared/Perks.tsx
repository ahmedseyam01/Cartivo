import { RotateCcw, ShieldCheck, Truck } from "lucide-react";
import { cn } from "@/lib/utils";

const perks = [
  { icon: Truck, title: "Free delivery", text: "On every order, nationwide" },
  { icon: RotateCcw, title: "30-day returns", text: "Hassle-free exchanges" },
  { icon: ShieldCheck, title: "Secure checkout", text: "Card or cash on delivery" },
];

export function Perks({ className, compact = false }: { className?: string; compact?: boolean }) {
  return (
    <ul className={cn("grid gap-3", compact ? "grid-cols-1" : "sm:grid-cols-3", className)}>
      {perks.map(({ icon: Icon, title, text }) => (
        <li key={title} className="flex items-center gap-3 rounded-2xl border p-4">
          <span className="bg-muted flex size-10 shrink-0 items-center justify-center rounded-full">
            <Icon className="size-5" />
          </span>
          <div>
            <p className="text-sm font-semibold">{title}</p>
            <p className="text-muted-foreground text-xs">{text}</p>
          </div>
        </li>
      ))}
    </ul>
  );
}
