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
import { useCart } from "@/providers/CartProvider";
import { shippingSchema, type ShippingValues } from "@/lib/validations";
import { cn } from "@/lib/utils";
import type { Address, Cart, PaymentMethod } from "@/types/commerce";

const methods: { value: PaymentMethod; label: string; hint: string; icon: typeof CreditCard }[] = [
  { value: "card", label: "Credit / debit card", hint: "Pay securely with Stripe", icon: CreditCard },
  { value: "cash", label: "Cash on delivery", hint: "Pay when your order arrives", icon: Banknote },
];

const choice = "flex cursor-pointer items-start gap-3 rounded-2xl border p-4 transition-colors has-[:checked]:border-foreground has-[:checked]:bg-muted/50";

export function CheckoutForm({ cart, addresses }: { cart: Cart; addresses: Address[] }) {
  const router = useRouter();
  const { hydrate } = useCart();
  const [method, setMethod] = useState<PaymentMethod>("card");
  const [addressId, setAddressId] = useState<string | null>(addresses[0]?._id ?? null);
  const [error, setError] = useState<string | null>(null);

  const first = addresses[0];
  const form = useForm<ShippingValues>({
    resolver: zodResolver(shippingSchema),
    defaultValues: { city: first?.city ?? "", details: first?.details ?? "", phone: first?.phone ?? "" },
  });
  const { errors, isSubmitting } = form.formState;

  function pickAddress(address: Address | null) {
    setAddressId(address?._id ?? null);
    form.reset(address ? { city: address.city, details: address.details, phone: address.phone } : { city: "", details: "", phone: "" });
  }

  async function onSubmit(values: ShippingValues) {
    setError(null);
    if (!cart.id) return setError("Your cart is empty.");

    const result = await placeOrder(cart.id, values, method);
    if (!result.ok) return setError(result.error);

    if (result.data.method === "card") {
      window.location.assign(result.data.url);
      return;
    }
    hydrate({ id: null, lines: [], itemCount: 0, total: 0 });
    toast.success("Order placed! We'll deliver it soon.");
    router.replace("/allorders");
    router.refresh();
  }

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-10 lg:grid-cols-[1fr_380px] lg:items-start">
      <div className="space-y-10">
        <fieldset className="space-y-4">
          <legend className="mb-4 text-lg font-semibold">1. Shipping address</legend>

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
                    <span className="text-muted-foreground block">{address.phone}</span>
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
                <span className="text-sm font-semibold">Use a new address</span>
              </label>
            </div>
          )}

          <div className={cn("grid gap-4 sm:grid-cols-2", addressId && "hidden")}>
            <TextField label="City" autoComplete="address-level2" registration={form.register("city")} error={errors.city} />
            <TextField
              label="Phone"
              type="tel"
              autoComplete="tel"
              inputMode="tel"
              placeholder="01xxxxxxxxx"
              registration={form.register("phone")}
              error={errors.phone}
            />
            <TextField
              className="sm:col-span-2"
              label="Street address"
              autoComplete="street-address"
              placeholder="Street, building, apartment"
              registration={form.register("details")}
              error={errors.details}
            />
          </div>
          {addressId && (errors.city || errors.phone || errors.details) && (
            <FormError message="This saved address is incomplete. Choose “Use a new address” to enter it again." />
          )}
        </fieldset>

        <fieldset>
          <legend className="mb-4 text-lg font-semibold">2. Payment</legend>
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
          {method === "card" ? "Continue to payment" : "Place order"}
        </Button>
        <p className="text-muted-foreground text-center text-xs">
          {method === "card" ? "You'll be redirected to Stripe to pay securely." : "No payment needed now."}
        </p>
      </OrderSummary>
    </form>
  );
}
