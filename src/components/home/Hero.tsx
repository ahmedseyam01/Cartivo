import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { effectivePrice } from "@/lib/api/catalog";
import { formatPrice } from "@/lib/format";
import { getI18n } from "@/i18n/server";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { Product } from "@/types/catalog";

type Stats = { products: number; brands: number; categories: number };

export function Hero({ showcase, stats }: { showcase: Product[]; stats: Stats }) {
  const { t } = getI18n();
  const [main, ...side] = showcase;

  const statItems = [
    { value: stats.products, label: t.home.statProducts },
    { value: stats.brands, label: t.nav.brands },
    { value: stats.categories, label: t.nav.categories },
  ];

  return (
    <section className="page-container pt-4 sm:pt-8">
      <div className="bg-foreground text-background relative isolate grid overflow-hidden rounded-3xl lg:grid-cols-[1.05fr_1fr]">
        {/* Soft light behind the content */}
        <div aria-hidden className="absolute -start-32 -top-32 -z-10 size-96 rounded-full bg-white/10 blur-3xl" />
        <div aria-hidden className="absolute -end-24 bottom-0 -z-10 size-80 rounded-full bg-white/5 blur-3xl" />

        <div className="flex flex-col justify-center gap-6 p-7 sm:p-12 lg:p-14">
          <span className="flex w-fit items-center gap-2 rounded-full border border-white/15 bg-white/5 px-3 py-1.5 text-xs font-medium text-white/80">
            <span className="relative flex size-2">
              <span className="absolute inline-flex size-full animate-ping rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex size-2 rounded-full bg-emerald-400" />
            </span>
            {t.home.badge}
          </span>

          <h1 className="text-4xl leading-[1.1] font-bold tracking-tight text-balance sm:text-5xl lg:text-[3.5rem]">
            {t.home.heroTitle}
          </h1>
          <p className="max-w-md text-base leading-relaxed text-white/65 sm:text-lg">{t.home.heroText}</p>

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

          <dl className="mt-2 flex divide-x divide-white/15 border-t border-white/10 pt-6 rtl:divide-x-reverse">
            {statItems.map((stat) => (
              <div key={stat.label} className="flex-1 px-4 first:ps-0 last:pe-0">
                <dt className="sr-only">{stat.label}</dt>
                <dd>
                  <span className="block text-2xl font-bold tabular-nums sm:text-3xl">{stat.value}+</span>
                  <span className="text-xs text-white/55 sm:text-sm">{stat.label}</span>
                </dd>
              </div>
            ))}
          </dl>
        </div>

        {main && (
          <div className="grid grid-cols-2 gap-3 p-3 pt-0 sm:p-4 lg:ps-0 lg:pt-4">
            <ShowcaseTile product={main} featured priority className="col-span-2 aspect-[16/10]" />
            {side.map((product) => (
              <ShowcaseTile key={product.id} product={product} className="aspect-square" />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

function ShowcaseTile({
  product,
  featured = false,
  priority = false,
  className,
}: {
  product: Product;
  featured?: boolean;
  priority?: boolean;
  className?: string;
}) {
  const { locale, t } = getI18n();

  return (
    <Link
      href={`/products/${product.id}`}
      className={cn("group text-foreground relative overflow-hidden rounded-2xl bg-white", className)}
    >
      <Image
        src={product.imageCover}
        alt={product.title}
        fill
        priority={priority}
        sizes={featured ? "(min-width: 1024px) 560px, 100vw" : "(min-width: 1024px) 280px, 50vw"}
        className={cn(
          "object-contain transition-transform duration-500 group-hover:scale-105",
          featured ? "p-6 pb-16 sm:p-8 sm:pb-20" : "p-4 pb-12",
        )}
      />
      <span className="bg-foreground/90 text-background absolute start-3 top-3 rounded-full px-2.5 py-1 text-[11px] font-medium backdrop-blur">
        {featured ? t.home.featured : product.category.name}
      </span>
      <div className="absolute inset-x-3 bottom-3 flex items-center justify-between gap-2 rounded-xl bg-white/85 px-3 py-2 shadow-sm ring-1 ring-black/5 backdrop-blur">
        <p className={cn("min-w-0 truncate font-medium", featured ? "text-sm" : "text-xs")}><bdi>{product.title}</bdi></p>
        <p className={cn("shrink-0 font-bold tabular-nums", featured ? "text-sm" : "text-xs")}>
          {formatPrice(effectivePrice(product), locale)}
        </p>
      </div>
    </Link>
  );
}
