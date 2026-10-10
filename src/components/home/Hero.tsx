import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Star } from "lucide-react";
import { effectivePrice } from "@/lib/api/catalog";
import { formatPrice } from "@/lib/format";
import { getI18n } from "@/i18n/server";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { Product } from "@/types/catalog";

type Stats = { products: number; brands: number; categories: number };

export function Hero({ showcase, stats }: { showcase: Product[]; stats: Stats }) {
  const { locale, t } = getI18n();
  const [main, ...side] = showcase;

  const statItems = [
    { value: stats.products, label: t.home.statProducts },
    { value: stats.brands, label: t.nav.brands },
    { value: stats.categories, label: t.nav.categories },
  ];

  return (
    <section className="page-container pt-4 sm:pt-8">
      <div className="bg-foreground text-background relative isolate grid items-center gap-10 overflow-hidden rounded-3xl p-6 sm:p-10 lg:grid-cols-2 lg:gap-6 lg:p-14">
        {/* Soft light and a faint grid behind the content */}
        <div aria-hidden className="absolute -start-40 -top-40 -z-10 size-[28rem] rounded-full bg-white/10 blur-3xl" />
        <div
          aria-hidden
          className="absolute inset-0 -z-10 opacity-[0.07] [background-image:linear-gradient(to_right,white_1px,transparent_1px),linear-gradient(to_bottom,white_1px,transparent_1px)] [background-size:48px_48px] [mask-image:radial-gradient(ellipse_at_center,black,transparent_75%)]"
        />

        {/* Copy */}
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

        {/* Visual: one large product with two floating product cards */}
        {main && (
          <div className="relative mx-auto w-full max-w-[440px] lg:me-6">
            <Link
              href={`/products/${main.id}`}
              className="group relative block aspect-square overflow-hidden rounded-[2rem] bg-white shadow-2xl shadow-black/50"
            >
              <Image
                src={main.imageCover}
                alt={main.title}
                fill
                priority
                sizes="(min-width: 1024px) 440px, 90vw"
                className="object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <span className="bg-foreground text-background absolute start-4 top-4 rounded-full px-3 py-1 text-xs font-semibold">
                {t.home.featured}
              </span>
              <span className="text-foreground absolute end-4 top-4 rounded-full bg-white/90 px-3 py-1 text-sm font-bold tabular-nums shadow-sm backdrop-blur">
                {formatPrice(effectivePrice(main), locale)}
              </span>
            </Link>

            {side.map((product, i) => (
              <FloatingCard
                key={product.id}
                product={product}
                className={i === 0 ? "-start-4 bottom-10 sm:-start-12" : "-end-3 top-16 sm:-end-10"}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

function FloatingCard({ product, className }: { product: Product; className?: string }) {
  const { locale } = getI18n();

  return (
    <Link
      href={`/products/${product.id}`}
      className={cn(
        "text-foreground absolute flex w-52 items-center gap-3 rounded-2xl bg-white p-2 pe-3 shadow-2xl ring-1 ring-black/5 transition-transform hover:-translate-y-1 sm:w-60",
        className,
      )}
    >
      <span className="bg-muted relative size-12 shrink-0 overflow-hidden rounded-xl sm:size-14">
        <Image src={product.imageCover} alt="" fill sizes="56px" className="object-cover" />
      </span>
      <span className="min-w-0">
        <span className="block truncate text-xs font-medium">
          <bdi>{product.title}</bdi>
        </span>
        <span className="mt-0.5 flex items-center gap-1.5">
          <span className="text-sm font-bold tabular-nums">{formatPrice(effectivePrice(product), locale)}</span>
          <span className="text-muted-foreground flex items-center gap-0.5 text-[11px]">
            <Star className="size-3 fill-amber-400 text-amber-400" />
            {product.ratingsAverage.toFixed(1)}
          </span>
        </span>
      </span>
    </Link>
  );
}
