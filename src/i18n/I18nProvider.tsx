"use client";

import { createContext, useContext } from "react";
import { DirectionProvider } from "@radix-ui/react-direction";
import type { Dictionary } from "./dictionaries/en";
import { getDirection, type Locale } from "./config";

const I18nContext = createContext<{ locale: Locale; t: Dictionary } | null>(null);

export function I18nProvider({ locale, t, children }: { locale: Locale; t: Dictionary; children: React.ReactNode }) {
  return (
    <I18nContext.Provider value={{ locale, t }}>
      <DirectionProvider dir={getDirection(locale)}>{children}</DirectionProvider>
    </I18nContext.Provider>
  );
}

export function useI18n() {
  const context = useContext(I18nContext);
  if (!context) throw new Error("useI18n must be used inside <I18nProvider>");
  return context;
}

/** Translates a validation/error key coming from a zod schema or a server action. */
export function useErrorText() {
  const { t } = useI18n();
  return (message?: string | null) => {
    if (!message) return undefined;
    return (
      (t.validation as Record<string, string>)[message] ?? (t.errors as Record<string, string>)[message] ?? message
    );
  };
}
