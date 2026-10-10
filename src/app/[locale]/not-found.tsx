import Link from "next/link";
import { Button } from "@/components/ui/button";
import { getI18n } from "@/i18n/server";

export default function NotFound() {
  const { t } = getI18n();
  return (
    <div className="page-container flex min-h-[60vh] flex-col items-center justify-center text-center">
      <p className="text-8xl font-bold tracking-tighter">404</p>
      <h1 className="mt-4 text-2xl font-semibold">{t.errors.notFoundTitle}</h1>
      <p className="text-muted-foreground mt-2 max-w-sm">{t.errors.notFoundText}</p>
      <div className="mt-8 flex gap-3">
        <Button asChild size="lg" className="rounded-full">
          <Link href="/">{t.errors.goHome}</Link>
        </Button>
        <Button asChild size="lg" variant="outline" className="rounded-full">
          <Link href="/products">{t.errors.shopProducts}</Link>
        </Button>
      </div>
    </div>
  );
}
