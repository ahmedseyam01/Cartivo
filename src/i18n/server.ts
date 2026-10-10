import "server-only";
import { cache } from "react";
import { notFound } from "next/navigation";
import ar from "./dictionaries/ar";
import en from "./dictionaries/en";
import { defaultLocale, isLocale, type Locale } from "./config";

const dictionaries = { en, ar };

// Per-request slot holding the active locale, so deeply nested server components
// can read it without threading props through every level.
const requestLocale = cache(() => ({ current: defaultLocale as Locale }));

/** Call once at the top of every layout/page with the `[locale]` route param. */
export function setRequestLocale(locale: string): Locale {
  if (!isLocale(locale)) notFound();
  requestLocale().current = locale;
  return locale;
}

export function getI18n() {
  const locale = requestLocale().current;
  return { locale, t: dictionaries[locale] };
}

export function getDictionary(locale: Locale) {
  return dictionaries[locale];
}
