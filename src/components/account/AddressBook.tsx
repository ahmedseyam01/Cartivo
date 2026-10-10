"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import toast from "react-hot-toast";
import { Loader2, MapPin, Plus, Trash2 } from "lucide-react";
import { addAddress, removeAddress } from "@/actions/account";
import { Button } from "@/components/ui/button";
import { FormError, TextField } from "@/components/shared/FormField";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { format } from "@/i18n/config";
import { useErrorText, useI18n } from "@/i18n/I18nProvider";
import { addressSchema, type AddressValues } from "@/lib/validations";
import type { Address } from "@/types/commerce";

export function AddressBook({ initialAddresses }: { initialAddresses: Address[] }) {
  const { t } = useI18n();
  const errorText = useErrorText();
  const [addresses, setAddresses] = useState(initialAddresses);
  const [removing, setRemoving] = useState<string | null>(null);
  const [open, setOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const form = useForm<AddressValues>({
    resolver: zodResolver(addressSchema),
    defaultValues: { name: "", city: "", details: "", phone: "" },
  });
  const { errors, isSubmitting } = form.formState;

  async function onSubmit(values: AddressValues) {
    setError(null);
    const result = await addAddress(values);
    if (!result.ok) return setError(result.error);
    setAddresses(result.data);
    form.reset();
    setOpen(false);
    toast.success(t.toast.addressSaved);
  }

  async function onRemove(id: string) {
    setRemoving(id);
    const result = await removeAddress(id);
    setRemoving(null);
    if (!result.ok) return void toast.error(errorText(result.error) ?? t.errors.generic);
    setAddresses(result.data);
    toast.success(t.toast.addressRemoved);
  }

  return (
    <div className="space-y-4">
      {addresses.length > 0 ? (
        <ul className="grid gap-3 sm:grid-cols-2">
          {addresses.map((address) => (
            <li key={address._id} className="flex items-start gap-3 rounded-2xl border p-4">
              <MapPin className="mt-0.5 size-4 shrink-0" />
              <div className="min-w-0 flex-1 text-sm">
                <p className="font-semibold">{address.name}</p>
                <p className="text-muted-foreground">
                  {address.details}, {address.city}
                </p>
                <p className="text-muted-foreground" dir="ltr">{address.phone}</p>
              </div>
              <button
                type="button"
                onClick={() => onRemove(address._id)}
                disabled={removing === address._id}
                aria-label={format(t.profile.removeAddress, { name: address.name })}
                className="text-muted-foreground hover:text-destructive rounded-full p-1.5 transition-colors"
              >
                {removing === address._id ? <Loader2 className="size-4 animate-spin" /> : <Trash2 className="size-4" />}
              </button>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-muted-foreground text-sm">{t.profile.noAddresses}</p>
      )}

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button variant="outline" className="h-11 rounded-full px-5">
            <Plus /> {t.profile.addAddress}
          </Button>
        </DialogTrigger>
        <DialogContent className="rounded-2xl sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{t.profile.newAddress}</DialogTitle>
            <DialogDescription>{t.profile.newAddressText}</DialogDescription>
          </DialogHeader>
          <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-4" noValidate>
            <TextField label={t.profile.label} placeholder={t.profile.labelPlaceholder} registration={form.register("name")} error={errors.name} />
            <TextField label={t.checkout.city} autoComplete="address-level2" registration={form.register("city")} error={errors.city} />
            <TextField
              label={t.checkout.street}
              autoComplete="street-address"
              registration={form.register("details")}
              error={errors.details}
            />
            <TextField
              label={t.checkout.phone}
              dir="ltr"
              type="tel"
              inputMode="tel"
              autoComplete="tel"
              registration={form.register("phone")}
              error={errors.phone}
            />
            <FormError message={error} />
            <Button type="submit" disabled={isSubmitting} className="h-11 rounded-full">
              {isSubmitting && <Loader2 className="animate-spin" />}
              {t.profile.saveAddress}
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
