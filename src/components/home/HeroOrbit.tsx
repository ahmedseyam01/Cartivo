import {
  Baby,
  BookOpen,
  Headphones,
  Music,
  Shirt,
  ShoppingBasket,
  Smartphone,
  Sofa,
  Sparkles,
  type LucideIcon,
} from "lucide-react";
import { LogoMark } from "@/components/layout/Logo";
import { cn } from "@/lib/utils";

// One icon per store department, placed evenly around two rings.
const outer: LucideIcon[] = [Smartphone, Shirt, Headphones, Music, BookOpen, ShoppingBasket];
const inner: LucideIcon[] = [Sofa, Sparkles, Baby];

/** Icons spaced evenly on a circle; the ring spins and each icon counter-spins to stay upright. */
function Ring({
  icons,
  inset,
  spin,
  counterSpin,
  variant,
}: {
  icons: LucideIcon[];
  inset: string;
  spin: string;
  counterSpin: string;
  variant: "solid" | "glass";
}) {
  return (
    <div className={cn("absolute rounded-full border border-white/10", inset)}>
      <div className={cn("absolute inset-0", spin)}>
        {icons.map((Icon, i) => {
          const angle = (i / icons.length) * 2 * Math.PI - Math.PI / 2;
          return (
            <span
              key={i}
              className="absolute -translate-x-1/2 -translate-y-1/2"
              style={{ left: `${50 + 50 * Math.cos(angle)}%`, top: `${50 + 50 * Math.sin(angle)}%` }}
            >
              <span
                className={cn(
                  "flex items-center justify-center rounded-2xl",
                  counterSpin,
                  variant === "solid"
                    ? "text-foreground size-11 bg-white shadow-lg shadow-black/40 sm:size-12"
                    : "size-10 border border-white/15 bg-white/10 text-white backdrop-blur",
                )}
              >
                <Icon className="size-5" />
              </span>
            </span>
          );
        })}
      </div>
    </div>
  );
}

/** Decorative hero visual: the Cartivo mark with every department orbiting around it. */
export function HeroOrbit({ className }: { className?: string }) {
  return (
    <div aria-hidden className={cn("relative aspect-square w-full", className)}>
      <div className="absolute inset-[30%] rounded-full bg-white/15 blur-3xl" />
      <div className="absolute inset-[6%] rounded-full border border-dashed border-white/10" />

      <Ring
        icons={outer}
        inset="inset-[10%]"
        spin="animate-[spin_60s_linear_infinite]"
        counterSpin="animate-[spin_60s_linear_infinite_reverse]"
        variant="solid"
      />
      <Ring
        icons={inner}
        inset="inset-[28%]"
        spin="animate-[spin_40s_linear_infinite_reverse]"
        counterSpin="animate-[spin_40s_linear_infinite]"
        variant="glass"
      />

      <div className="absolute inset-0 flex items-center justify-center">
        <LogoMark inverted className="size-24 rounded-[1.75rem] shadow-[0_0_80px_10px_rgba(255,255,255,0.18)] sm:size-28" />
      </div>
    </div>
  );
}
