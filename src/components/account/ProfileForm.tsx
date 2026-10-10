"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import toast from "react-hot-toast";
import { Loader2 } from "lucide-react";
import { updateProfile } from "@/actions/account";
import { Button } from "@/components/ui/button";
import { FormError, TextField } from "@/components/shared/FormField";
import { profileSchema, type ProfileValues } from "@/lib/validations";

export function ProfileForm({ name, email }: { name: string; email: string }) {
  const { update } = useSession();
  const [error, setError] = useState<string | null>(null);
  const form = useForm<ProfileValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: { name, email, phone: "" },
  });
  const { errors, isSubmitting, dirtyFields, isDirty } = form.formState;

  async function onSubmit(values: ProfileValues) {
    setError(null);
    const changed = Object.fromEntries(
      Object.entries(values).filter(([key]) => dirtyFields[key as keyof ProfileValues]),
    ) as Partial<ProfileValues>;

    const result = await updateProfile(changed);
    if (!result.ok) return setError(result.error);

    await update({ user: { name: result.data.name, email: result.data.email } });
    form.reset({ name: result.data.name, email: result.data.email, phone: "" });
    toast.success("Profile updated");
  }

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-4 sm:grid-cols-2" noValidate>
      <TextField label="Full name" autoComplete="name" registration={form.register("name")} error={errors.name} />
      <TextField label="Email" type="email" autoComplete="email" registration={form.register("email")} error={errors.email} />
      <TextField
        label="Phone"
        type="tel"
        inputMode="tel"
        autoComplete="tel"
        placeholder="Leave empty to keep current"
        registration={form.register("phone")}
        error={errors.phone}
      />
      <div className="space-y-3 sm:col-span-2">
        <FormError message={error} />
        <Button type="submit" disabled={!isDirty || isSubmitting} className="h-11 rounded-full px-6">
          {isSubmitting && <Loader2 className="animate-spin" />}
          Save changes
        </Button>
      </div>
    </form>
  );
}
