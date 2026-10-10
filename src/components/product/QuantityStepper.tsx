"use client";

import { Loader2, Minus, Plus } from "lucide-react";
import { useI18n } from "@/i18n/I18nProvider";
import { cn } from "@/lib/utils";

const stepButton =
  "flex aspect-square h-full items-center justify-center rounded-full transition-colors hover:bg-accent disabled:opacity-40 disabled:hover:bg-transparent";

/** − value + control, shared by the product page and the cart. */
export function QuantityStepper({
  value,
  onChange,
  min = 1,
  max,
  disabled = false,
  loading = false,
  label,
  className,
}: {
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  disabled?: boolean;
  loading?: boolean;
  label?: string;
  className?: string;
}) {
  const { t } = useI18n();

  return (
    <div role="group" aria-label={label ?? t.product.quantity} className={cn("flex h-9 items-center rounded-full border", className)}>
      <button
        type="button"
        className={stepButton}
        onClick={() => onChange(value - 1)}
        disabled={disabled || value <= min}
        aria-label={t.product.decrease}
      >
        <Minus className="size-4" />
      </button>
      <span className="flex min-w-8 justify-center text-sm font-semibold tabular-nums" aria-live="polite">
        {loading ? <Loader2 className="size-4 animate-spin" /> : value}
      </span>
      <button
        type="button"
        className={stepButton}
        onClick={() => onChange(value + 1)}
        disabled={disabled || (max !== undefined && value >= max)}
        aria-label={t.product.increase}
      >
        <Plus className="size-4" />
      </button>
    </div>
  );
}
