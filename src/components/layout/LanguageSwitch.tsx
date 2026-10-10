"use client";

import { Languages } from "lucide-react";
import { useI18n } from "@/i18n/I18nProvider";
import { LOCALE_COOKIE } from "@/i18n/config";
import { cn } from "@/lib/utils";

export function LanguageSwitch({ className }: { className?: string }) {
  const { locale, t } = useI18n();

  function switchLanguage() {
    const next = locale === "ar" ? "en" : "ar";
    document.cookie = `${LOCALE_COOKIE}=${next}; path=/; max-age=31536000; samesite=lax`;
    // A full reload swaps fonts, direction and every cached page in one go.
    window.location.reload();
  }

  return (
    <button
      type="button"
      onClick={switchLanguage}
      aria-label={t.menu.languageLabel}
      className={cn(
        "hover:bg-accent inline-flex h-10 items-center gap-1.5 rounded-full px-3 text-sm font-medium transition-colors",
        className,
      )}
    >
      <Languages className="size-4" />
      {t.menu.language}
    </button>
  );
}
