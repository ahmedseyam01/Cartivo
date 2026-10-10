import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getProduct, getProducts, getRelatedProducts } from "@/lib/api/catalog";
import { PageHeader } from "@/components/shared/PageHeader";
import { Perks } from "@/components/shared/Perks";
import { ProductGallery } from "@/components/product/ProductGallery";
import { ProductGrid } from "@/components/product/ProductGrid";
import { AddToCartButton } from "@/components/product/AddToCartButton";
import { WishlistButton } from "@/components/product/WishlistButton";
import { Price, discountPercent } from "@/components/product/Price";
import { Rating } from "@/components/product/Rating";

type Props = { params: Promise<{ productId: string }> };

export const revalidate = 3600;

export async function generateStaticParams() {
  const products = await getProducts();
  return products.map((product) => ({ productId: product.id }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const product = await getProduct((await params).productId);
  if (!product) return { title: "Product not found" };
  return {
    title: product.title,
    description: product.description.slice(0, 160),
    openGraph: { images: [product.imageCover] },
  };
}

export default async function ProductPage({ params }: Props) {
  const product = await getProduct((await params).productId);
  if (!product) notFound();

  const related = await getRelatedProducts(product);
  const discount = discountPercent(product.price, product.priceAfterDiscount);
  const images = product.images.length ? product.images : [product.imageCover];
  const inStock = product.quantity > 0;

  return (
    <div className="page-container">
      <PageHeader
        className="pb-4 sm:pt-6"
        breadcrumbs={[
          { href: "/", label: "Home" },
          { href: "/products", label: "Shop" },
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
          <h1 className="mt-2 text-2xl font-bold tracking-tight text-balance sm:text-3xl">{product.title}</h1>

          <div className="mt-3 flex flex-wrap items-center gap-3 text-sm">
            <Rating value={product.ratingsAverage} count={product.ratingsQuantity} className="text-sm" />
            <span className="text-border">|</span>
            <span className="text-muted-foreground">{product.sold.toLocaleString("en-US")} sold</span>
          </div>

          <div className="mt-6 flex items-center gap-3">
            <Price price={product.price} discounted={product.priceAfterDiscount} className="text-3xl" />
            {discount > 0 && (
              <span className="bg-foreground text-background rounded-full px-2.5 py-1 text-xs font-semibold">
                Save {discount}%
              </span>
            )}
          </div>
          <p className={inStock ? "text-success mt-2 text-sm font-medium" : "text-destructive mt-2 text-sm font-medium"}>
            {inStock ? (product.quantity < 20 ? `Only ${product.quantity} left in stock` : "In stock") : "Out of stock"}
          </p>

          <div className="mt-8 flex gap-3">
            <AddToCartButton productId={product.id} inStock={inStock} className="flex-1" />
            <WishlistButton productId={product.id} className="size-12 border bg-white shadow-none" />
          </div>

          <Perks compact className="mt-8" />

          <div className="mt-8 border-t pt-6">
            <h2 className="text-sm font-semibold">Description</h2>
            <p className="text-muted-foreground mt-3 text-sm leading-relaxed whitespace-pre-line">
              {product.description.replace(/\t/g, ": ")}
            </p>
            <dl className="mt-6 grid grid-cols-2 gap-4 text-sm">
              <div>
                <dt className="text-muted-foreground">Category</dt>
                <dd className="font-medium">{product.category.name}</dd>
              </div>
              {product.subcategory[0] && (
                <div>
                  <dt className="text-muted-foreground">Type</dt>
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
            <h2 className="text-2xl font-bold tracking-tight">You may also like</h2>
            <Link href={`/categories/${product.category._id}`} className="text-sm font-medium underline-offset-4 hover:underline">
              View all
            </Link>
          </div>
          <ProductGrid products={related} />
        </section>
      )}
    </div>
  );
}
