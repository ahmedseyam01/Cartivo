import Image from "next/image";
import Link from "next/link";
import { getI18n } from "@/i18n/server";
import type { Product } from "@/types/catalog";
import { AddToCartButton } from "./AddToCartButton";
import { WishlistButton } from "./WishlistButton";
import { Price, discountPercent } from "./Price";
import { Rating } from "./Rating";

export function ProductCard({ product, priority = false }: { product: Product; priority?: boolean }) {
  const { t } = getI18n();
  const discount = discountPercent(product.price, product.priceAfterDiscount);
  const inStock = product.quantity > 0;
  const href = `/products/${product.id}`;

  return (
    <article className="group relative flex flex-col overflow-hidden rounded-2xl border bg-white transition-all duration-300 hover:-translate-y-1 hover:border-foreground/20 hover:shadow-xl hover:shadow-black/5">
      {/* Image */}
      <div className="bg-muted relative aspect-square overflow-hidden">
        <Image
          src={product.imageCover}
          alt=""
          fill
          priority={priority}
          sizes="(min-width: 1280px) 300px, (min-width: 1024px) 25vw, (min-width: 640px) 33vw, 50vw"
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />
        {discount > 0 && (
          <span className="bg-foreground text-background absolute start-3 top-3 rounded-full px-2.5 py-1 text-[11px] font-semibold">
            −{discount}%
          </span>
        )}
        <WishlistButton productId={product.id} className="absolute end-3 top-3 z-10" />
        {!inStock && (
          <span className="absolute inset-x-3 bottom-3 rounded-full bg-white/90 py-1.5 text-center text-xs font-semibold backdrop-blur">
            {t.product.outOfStock}
          </span>
        )}
      </div>

      {/* Details */}
      <div className="flex flex-1 flex-col gap-2 p-3 sm:p-4">
        <div className="flex items-center justify-between gap-2">
          <p className="text-muted-foreground truncate text-[11px] font-semibold tracking-wider uppercase">
            {product.brand.name}
          </p>
          <Rating value={product.ratingsAverage} count={product.ratingsQuantity} className="shrink-0" />
        </div>

        <h3 className="line-clamp-2 min-h-10 text-sm leading-5 font-medium">
          <Link href={href} className="after:absolute after:inset-0 after:content-['']">
            <bdi>{product.title}</bdi>
          </Link>
        </h3>

        <div className="mt-auto flex items-end justify-between gap-2 pt-1">
          <Price price={product.price} discounted={product.priceAfterDiscount} className="text-base sm:text-lg" />
          {/* Above the stretched title link so it stays clickable. */}
          <AddToCartButton productId={product.id} inStock={inStock} className="relative z-10" />
        </div>
      </div>
    </article>
  );
}
