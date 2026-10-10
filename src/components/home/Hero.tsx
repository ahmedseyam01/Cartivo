import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { getI18n } from "@/i18n/server";
import { Button } from "@/components/ui/button";
import { HeroOrbit } from "./HeroOrbit";

type Stats = { products: number; brands: number; categories: number };

export function Hero({ stats }: { stats: Stats }) {
  const { t } = getI18n();

  const statItems = [
    { value: stats.products, label: t.home.statProducts },
    { value: stats.brands, label: t.nav.brands },
    { value: stats.categories, label: t.nav.categories },
  ];

  return (
    <section className="page-container pt-4 sm:pt-8">
      <div className="bg-foreground text-background relative isolate grid items-center gap-6 overflow-hidden rounded-3xl p-6 sm:p-10 lg:grid-cols-2 lg:p-14">
        {/* Faint grid fading out from the centre */}
        <div
          aria-hidden
          className="absolute inset-0 -z-10 opacity-[0.07] [background-image:linear-gradient(to_right,white_1px,transparent_1px),linear-gradient(to_bottom,white_1px,transparent_1px)] [background-size:48px_48px] [mask-image:radial-gradient(ellipse_at_center,black,transparent_75%)]"
        />

        <div className="flex flex-col gap-6">
          <span className="flex w-fit items-center gap-2 rounded-full border border-white/15 bg-white/5 px-3 py-1.5 text-xs font-medium text-white/80">
            <span className="relative flex size-2">
              <span className="absolute inline-flex size-full animate-ping rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex size-2 rounded-full bg-emerald-400" />
            </span>
            {t.home.badge}
          </span>

          <h1 className="text-4xl leading-[1.08] font-bold tracking-tight text-balance sm:text-5xl xl:text-6xl">
            {t.home.heroTitle}
          </h1>
          <p className="max-w-md text-base leading-relaxed text-white/60 sm:text-lg">{t.home.heroText}</p>

          <div className="flex flex-col gap-3 sm:flex-row">
            <Button asChild size="lg" className="bg-background text-foreground hover:bg-background/90 h-12 rounded-full px-7 text-base">
              <Link href="/products">
                {t.home.shopNow} <ArrowRight className="rtl:rotate-180" />
              </Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="h-12 rounded-full border-white/25 bg-transparent px-7 text-base text-white hover:bg-white/10 hover:text-white"
            >
              <Link href="/categories">{t.home.browseCategories}</Link>
            </Button>
          </div>

          <dl className="flex gap-8 pt-2 sm:gap-12">
            {statItems.map((stat) => (
              <div key={stat.label}>
                <dt className="sr-only">{stat.label}</dt>
                <dd>
                  <span className="block text-2xl font-bold tabular-nums sm:text-3xl">{stat.value}+</span>
                  <span className="text-xs text-white/50 sm:text-sm">{stat.label}</span>
                </dd>
              </div>
            ))}
          </dl>
        </div>

        <HeroOrbit className="mx-auto max-w-[320px] sm:max-w-[420px] lg:max-w-[460px]" />
      </div>
    </section>
  );
}
