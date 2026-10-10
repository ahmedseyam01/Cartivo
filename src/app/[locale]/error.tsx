"use client";

import { useEffect } from "react";
import Link from "next/link";
import { RotateCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useI18n } from "@/i18n/I18nProvider";

export default function Error({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  const { t } = useI18n();
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="page-container flex min-h-[60vh] flex-col items-center justify-center text-center">
      <h1 className="text-2xl font-semibold">{t.errors.errorTitle}</h1>
      <p className="text-muted-foreground mt-2 max-w-sm">
        {t.errors.errorText}
      </p>
      <div className="mt-8 flex gap-3">
        <Button size="lg" onClick={reset} className="rounded-full">
          <RotateCw /> {t.errors.tryAgain}
        </Button>
        <Button asChild size="lg" variant="outline" className="rounded-full">
          <Link href="/">{t.errors.goHome}</Link>
        </Button>
      </div>
    </div>
  );
}
