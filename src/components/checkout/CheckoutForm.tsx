"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import toast from "react-hot-toast";
import { Banknote, CreditCard, Loader2, MapPin } from "lucide-react";
import { placeOrder } from "@/actions/orders";
import { Button } from "@/components/ui/button";
import { FormError, TextField } from "@/components/shared/FormField";
import { OrderSummary } from "@/components/cart/OrderSummary";
import { useI18n } from "@/i18n/I18nProvider";
import { useCart } from "@/providers/CartProvider";
import { shippingSchema, type ShippingValues } from "@/lib/validations";
import { cn } from "@/lib/utils";
import type { Address, Cart, PaymentMethod } from "@/types/commerce";

const choice =
  "flex cursor-pointer items-start gap-3 rounded-2xl border p-4 transition-colors has-[:checked]:border-foreground has-[:checked]:bg-muted/50";

const emptyAddress = { city: "", details: "", phone: "" };

export function CheckoutForm({ cart, addresses }: { cart: Cart; addresses: Address[] }) {
  const { t } = useI18n();
  const router = useRouter();
  const { hydrate } = useCart();
  const [method, setMethod] = useState<PaymentMethod>("card");
  const [addressId, setAddressId] = useState<string | null>(addresses[0]?._id ?? null);
  const [error, setError] = useState<string | null>(null);

  const methods = [
    { value: "card" as const, label: t.checkout.card, hint: t.checkout.cardHint, icon: CreditCard },
    { value: "cash" as const, label: t.checkout.cash, hint: t.checkout.cashHint, icon: Banknote },
  ];

  const first = addresses[0];
  const form = useForm<ShippingValues>({
    resolver: zodResolver(shippingSchema),
    defaultValues: first ? { city: first.city, details: first.details, phone: first.phone } : emptyAddress,
  });
  const { errors, isSubmitting } = form.formState;

  function pickAddress(address: Address | null) {
    setAddressId(address?._id ?? null);
    form.reset(address ? { city: address.city, details: address.details, phone: address.phone } : emptyAddress);
  }

  async function onSubmit(values: ShippingValues) {
    setError(null);
    if (!cart.id) return setError(t.checkout.emptyCart);

    const result = await placeOrder(cart.id, values, method);
    if (!result.ok) return setError(result.error);

    if (result.data.method === "card") {
      window.location.assign(result.data.url);
      return;
    }
    hydrate({ id: null, lines: [], itemCount: 0, total: 0 });
    toast.success(t.toast.orderPlaced);
    router.replace("/allorders");
    router.refresh();
  }

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-10 lg:grid-cols-[1fr_380px] lg:items-start" noValidate>
      <div className="space-y-10">
        <fieldset className="space-y-4">
          <legend className="mb-4 text-lg font-semibold">{t.checkout.shippingStep}</legend>

          {addresses.length > 0 && (
            <div className="grid gap-3 sm:grid-cols-2">
              {addresses.map((address) => (
                <label key={address._id} className={choice}>
                  <input
                    type="radio"
                    name="saved-address"
                    className="accent-foreground mt-1"
                    checked={addressId === address._id}
                    onChange={() => pickAddress(address)}
                  />
                  <span className="text-sm">
                    <span className="flex items-center gap-1.5 font-semibold">
                      <MapPin className="size-3.5" /> {address.name}
                    </span>
                    <span className="text-muted-foreground block">
                      {address.details}, {address.city}
                    </span>
                    <span className="text-muted-foreground block" dir="ltr">
                      {address.phone}
                    </span>
                  </span>
                </label>
              ))}
              <label className={choice}>
                <input
                  type="radio"
                  name="saved-address"
                  className="accent-foreground mt-1"
                  checked={addressId === null}
                  onChange={() => pickAddress(null)}
                />
                <span className="text-sm font-semibold">{t.checkout.newAddress}</span>
              </label>
            </div>
          )}

          <div className={cn("grid gap-4 sm:grid-cols-2", addressId && "hidden")}>
            <TextField label={t.checkout.city} autoComplete="address-level2" registration={form.register("city")} error={errors.city} />
            <TextField
              label={t.checkout.phone}
              type="tel"
              autoComplete="tel"
              inputMode="tel"
              dir="ltr"
              placeholder="01xxxxxxxxx"
              registration={form.register("phone")}
              error={errors.phone}
            />
            <TextField
              className="sm:col-span-2"
              label={t.checkout.street}
              autoComplete="street-address"
              placeholder={t.checkout.streetPlaceholder}
              registration={form.register("details")}
              error={errors.details}
            />
          </div>
          {addressId && (errors.city || errors.phone || errors.details) && <FormError message={t.checkout.incomplete} />}
        </fieldset>

        <fieldset>
          <legend className="mb-4 text-lg font-semibold">{t.checkout.paymentStep}</legend>
          <div className="grid gap-3 sm:grid-cols-2">
            {methods.map(({ value, label, hint, icon: Icon }) => (
              <label key={value} className={choice}>
                <input
                  type="radio"
                  name="payment"
                  value={value}
                  className="accent-foreground mt-1"
                  checked={method === value}
                  onChange={() => setMethod(value)}
                />
                <span className="text-sm">
                  <span className="flex items-center gap-1.5 font-semibold">
                    <Icon className="size-4" /> {label}
                  </span>
                  <span className="text-muted-foreground block">{hint}</span>
                </span>
              </label>
            ))}
          </div>
        </fieldset>
      </div>

      <OrderSummary itemCount={cart.itemCount} total={cart.total} className="lg:sticky lg:top-24">
        <FormError message={error} />
        <Button type="submit" size="lg" disabled={isSubmitting} className="h-12 w-full rounded-full text-base">
          {isSubmitting && <Loader2 className="animate-spin" />}
          {method === "card" ? t.checkout.continueToPayment : t.checkout.placeOrder}
        </Button>
        <p className="text-muted-foreground text-center text-xs">
          {method === "card" ? t.checkout.cardNote : t.checkout.cashNote}
        </p>
      </OrderSummary>
    </form>
  );
}
