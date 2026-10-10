const currency = new Intl.NumberFormat("en-EG", {
  style: "currency",
  currency: "EGP",
  maximumFractionDigits: 0,
});

const date = new Intl.DateTimeFormat("en-GB", {
  day: "numeric",
  month: "short",
  year: "numeric",
});

export function formatPrice(value: number) {
  return currency.format(value);
}

export function formatDate(value: string | Date) {
  return date.format(new Date(value));
}
