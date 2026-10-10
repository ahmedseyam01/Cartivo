import type { Locale } from "@/i18n/config";

// Arabic UI keeps Western digits (latn), which Egyptian shoppers read most easily for prices.
const intlLocale: Record<Locale, string> = { en: "en-EG", ar: "ar-EG-u-nu-latn" };

const currency = Object.fromEntries(
  Object.entries(intlLocale).map(([key, tag]) => [
    key,
    new Intl.NumberFormat(tag, { style: "currency", currency: "EGP", maximumFractionDigits: 0 }),
  ]),
) as Record<Locale, Intl.NumberFormat>;

const date = Object.fromEntries(
  Object.entries(intlLocale).map(([key, tag]) => [
    key,
    new Intl.DateTimeFormat(tag, { day: "numeric", month: "short", year: "numeric" }),
  ]),
) as Record<Locale, Intl.DateTimeFormat>;

const number = Object.fromEntries(
  Object.entries(intlLocale).map(([key, tag]) => [key, new Intl.NumberFormat(tag)]),
) as Record<Locale, Intl.NumberFormat>;

export function formatPrice(value: number, locale: Locale) {
  return currency[locale].format(value);
}

export function formatDate(value: string | Date, locale: Locale) {
  return date[locale].format(new Date(value));
}

export function formatNumber(value: number, locale: Locale) {
  return number[locale].format(value);
}
