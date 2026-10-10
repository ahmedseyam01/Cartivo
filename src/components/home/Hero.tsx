import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { Product } from "@/types/catalog";

export function Hero({ showcase }: { showcase: Product[] }) {
  const [main, ...side] = showcase;

  return (
    <section className="page-container pt-6 sm:pt-10">
      <div className="bg-foreground text-background grid overflow-hidden rounded-3xl lg:grid-cols-2">
        <div className="flex flex-col justify-center gap-6 p-8 sm:p-12 lg:p-16">
          <span className="w-fit rounded-full border border-white/20 px-3 py-1 text-xs font-medium tracking-wider text-white/70 uppercase">
            New season · Free delivery
          </span>
          <h1 className="text-4xl leading-[1.05] font-bold tracking-tight text-balance sm:text-5xl lg:text-6xl">
            Everything you love, one cart away.
          </h1>
          <p className="max-w-md text-base text-white/70 sm:text-lg">
            Electronics, fashion and home essentials from the brands you trust — at prices that make sense.
          </p>
          <div className="flex flex-col gap-3 sm:flex-row">
            <Button asChild size="lg" className="bg-background text-foreground hover:bg-background/90 h-12 rounded-full px-7 text-base">
              <Link href="/products">
                Shop now <ArrowRight />
              </Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="h-12 rounded-full border-white/30 bg-transparent px-7 text-base text-white hover:bg-white/10 hover:text-white"
            >
              <Link href="/categories">Browse categories</Link>
            </Button>
          </div>
        </div>

        {main && (
          <div className="grid grid-cols-2 gap-3 p-3 pt-0 sm:p-4 lg:pt-4">
            <Link href={`/products/${main.id}`} className="relative col-span-2 aspect-[16/10] overflow-hidden rounded-2xl bg-white">
              <Image
                src={main.imageCover}
                alt={main.title}
                fill
                priority
                sizes="(min-width: 1024px) 600px, 100vw"
                className="object-cover"
              />
            </Link>
            {side.slice(0, 2).map((product) => (
              <Link key={product.id} href={`/products/${product.id}`} className="relative aspect-square overflow-hidden rounded-2xl bg-white">
                <Image src={product.imageCover} alt={product.title} fill sizes="(min-width: 1024px) 300px, 50vw" className="object-cover" />
              </Link>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
