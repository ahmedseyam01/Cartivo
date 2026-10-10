import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="page-container flex min-h-[60vh] flex-col items-center justify-center text-center">
      <p className="text-8xl font-bold tracking-tighter">404</p>
      <h1 className="mt-4 text-2xl font-semibold">Page not found</h1>
      <p className="text-muted-foreground mt-2 max-w-sm">The page you&apos;re looking for doesn&apos;t exist or has moved.</p>
      <div className="mt-8 flex gap-3">
        <Button asChild size="lg" className="rounded-full">
          <Link href="/">Go home</Link>
        </Button>
        <Button asChild size="lg" variant="outline" className="rounded-full">
          <Link href="/products">Shop products</Link>
        </Button>
      </div>
    </div>
  );
}
