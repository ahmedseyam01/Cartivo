"use client";

import { useEffect } from "react";
import Link from "next/link";
import { RotateCw } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Error({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="page-container flex min-h-[60vh] flex-col items-center justify-center text-center">
      <h1 className="text-2xl font-semibold">Something went wrong</h1>
      <p className="text-muted-foreground mt-2 max-w-sm">
        We couldn&apos;t load this page. Check your connection and try again.
      </p>
      <div className="mt-8 flex gap-3">
        <Button size="lg" onClick={reset} className="rounded-full">
          <RotateCw /> Try again
        </Button>
        <Button asChild size="lg" variant="outline" className="rounded-full">
          <Link href="/">Go home</Link>
        </Button>
      </div>
    </div>
  );
}
