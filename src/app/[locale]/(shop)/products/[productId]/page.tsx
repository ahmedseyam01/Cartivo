import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { effectivePrice, getProduct, getProducts, getRelatedProducts } from "@/lib/api/catalog";
import { siteConfig } from "@/lib/config";
import { formatNumber } from "@/lib/format";
import { format } from "@/i18n/config";
import { getDictionary, setRequestLocale } from "@/i18n/server";
import { PageHeader } from "@/components/shared/PageHeader";
import { Perks } from "@/components/shared/Perks";
import { ProductGallery } from "@/components/product/ProductGallery";
import { ProductGrid } from "@/components/product/ProductGrid";
import { BuyBox } from "@/components/product/AddToCartButton";
import { WishlistButton } from "@/components/product/WishlistButton";
import { Price, discountPercent } from "@/components/product/Price";
import { Rating } from "@/components/product/Rating";
import type { Product } from "@/types/catalog";

type Props = { params: Promise<{ locale: string; productId: string }> };

export const revalidate = 3600;

export async function generateStaticParams() {
  const products = await getProducts();
  return products.map((product) => ({ productId: product.id }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, productId } = await params;
  const product = await getProduct(productId);
  if (!product) return { title: getDictionary(setRequestLocale(locale)).errors.productNotFound };
  return {
    title: product.title,
    description: product.description.slice(0, 160),
    alternates: { canonical: `/products/${product.id}` },
    openGraph: { images: [product.imageCover] },
  };
}

/** schema.org data so search engines can show price, stock and rating. */
function productJsonLd(product: Product) {
  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.title,
    image: product.images.length ? product.images : [product.imageCover],
    description: product.description,
    sku: product.id,
    brand: { "@type": "Brand", name: product.brand.name },
    category: product.category.name,
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: product.ratingsAverage,
      reviewCount: Math.max(product.ratingsQuantity, 1),
    },
    offers: {
      "@type": "Offer",
      url: `${siteConfig.url}/products/${product.id}`,
      priceCurrency: "EGP",
      price: effectivePrice(product),
      availability: product.quantity > 0 ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
    },
  };
}

export default async function ProductPage({ params }: Props) {
  const { productId, ...route } = await params;
  const locale = setRequestLocale(route.locale);
  const t = getDictionary(locale);
  const product = await getProduct(productId);
  if (!product) notFound();

  const related = await getRelatedProducts(product);
  const discount = discountPercent(product.price, product.priceAfterDiscount);
  const images = product.images.length ? product.images : [product.imageCover];
  const stock = product.quantity;

  return (
    <div className="page-container">
      <script
        type="application/ld+json"
        // JSON.stringify output is safe here; "<" is escaped to prevent closing the script tag.
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productJsonLd(product)).replace(/</g, "\\u003c") }}
      />
      <PageHeader
        className="pb-4 sm:pt-6"
        breadcrumbs={[
          { href: "/", label: t.nav.home },
          { href: "/products", label: t.nav.shop },
          { href: `/categories/${product.category._id}`, label: product.category.name },
          { label: product.title },
        ]}
      />

      <div className="grid gap-8 lg:grid-cols-2 lg:gap-14">
        <ProductGallery images={images} title={product.title} />

        <div className="flex flex-col">
          <Link
            href={`/brands/${product.brand._id}`}
            className="text-muted-foreground hover:text-foreground text-xs font-semibold tracking-widest uppercase"
          >
            {product.brand.name}
          </Link>
          <h1 className="mt-2 text-2xl font-bold tracking-tight text-balance sm:text-3xl"><bdi>{product.title}</bdi></h1>

          <div className="mt-3 flex flex-wrap items-center gap-3 text-sm">
            <Rating value={product.ratingsAverage} count={product.ratingsQuantity} className="text-sm" />
            <span className="text-border">|</span>
            <span className="text-muted-foreground">
              {format(t.product.sold, { count: formatNumber(product.sold, locale) })}
            </span>
          </div>

          <div className="mt-6 flex items-center gap-3">
            <Price price={product.price} discounted={product.priceAfterDiscount} className="text-3xl" />
            {discount > 0 && (
              <span className="bg-foreground text-background rounded-full px-2.5 py-1 text-xs font-semibold">
                {format(t.product.save, { percent: discount })}
              </span>
            )}
          </div>
          <p className={stock > 0 ? "text-success mt-2 text-sm font-medium" : "text-destructive mt-2 text-sm font-medium"}>
            {stock <= 0 ? t.product.outOfStock : stock < 20 ? format(t.product.onlyLeft, { count: stock }) : t.product.inStock}
          </p>

          <div className="mt-8 flex items-start gap-3">
            <div className="flex-1">
              <BuyBox productId={product.id} stock={stock} />
            </div>
            <WishlistButton productId={product.id} className="size-12 shrink-0 border bg-white shadow-none" />
          </div>

          <Perks compact className="mt-8" />

          <div className="mt-8 border-t pt-6">
            <h2 className="text-sm font-semibold">{t.product.description}</h2>
            <p className="text-muted-foreground mt-3 text-sm leading-relaxed whitespace-pre-line" dir="auto">
              {product.description.replace(/\t/g, ": ")}
            </p>
            <dl className="mt-6 grid grid-cols-2 gap-4 text-sm">
              <div>
                <dt className="text-muted-foreground">{t.product.category}</dt>
                <dd className="font-medium">{product.category.name}</dd>
              </div>
              {product.subcategory[0] && (
                <div>
                  <dt className="text-muted-foreground">{t.product.type}</dt>
                  <dd className="font-medium">{product.subcategory.map((s) => s.name).join(", ")}</dd>
                </div>
              )}
            </dl>
          </div>
        </div>
      </div>

      {related.length > 0 && (
        <section className="mt-20">
          <div className="mb-6 flex items-end justify-between">
            <h2 className="text-2xl font-bold tracking-tight">{t.product.related}</h2>
            <Link href={`/categories/${product.category._id}`} className="text-sm font-medium underline-offset-4 hover:underline">
              {t.product.viewAll}
            </Link>
          </div>
          <ProductGrid products={related} />
        </section>
      )}
    </div>
  );
}
