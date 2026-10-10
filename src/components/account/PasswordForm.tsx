"use client";

import { useState } from "react";
import { signOut } from "next-auth/react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import toast from "react-hot-toast";
import { Loader2 } from "lucide-react";
import { changePassword } from "@/actions/account";
import { Button } from "@/components/ui/button";
import { FormError, TextField } from "@/components/shared/FormField";
import { useI18n } from "@/i18n/I18nProvider";
import { changePasswordSchema, type ChangePasswordValues } from "@/lib/validations";

export function PasswordForm() {
  const { t } = useI18n();
  const [error, setError] = useState<string | null>(null);
  const form = useForm<ChangePasswordValues>({
    resolver: zodResolver(changePasswordSchema),
    defaultValues: { currentPassword: "", password: "", rePassword: "" },
  });
  const { errors, isSubmitting } = form.formState;

  async function onSubmit(values: ChangePasswordValues) {
    setError(null);
    const result = await changePassword(values);
    if (!result.ok) return setError(result.error);

    // The old access token is revoked by the API, so start a fresh session.
    toast.success(t.toast.passwordChanged);
    await signOut({ callbackUrl: "/login" });
  }

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-4 sm:grid-cols-2" noValidate>
      <TextField
        className="sm:col-span-2"
        label={t.profile.currentPassword}
        type="password"
        autoComplete="current-password"
        registration={form.register("currentPassword")}
        error={errors.currentPassword}
      />
      <TextField
        label={t.profile.newPassword}
        type="password"
        autoComplete="new-password"
        registration={form.register("password")}
        error={errors.password}
      />
      <TextField
        label={t.profile.confirmPassword}
        type="password"
        autoComplete="new-password"
        registration={form.register("rePassword")}
        error={errors.rePassword}
      />
      <div className="space-y-3 sm:col-span-2">
        <FormError message={error} />
        <Button type="submit" disabled={isSubmitting} className="h-11 rounded-full px-6">
          {isSubmitting && <Loader2 className="animate-spin" />}
          {t.profile.updatePassword}
        </Button>
      </div>
    </form>
  );
}
