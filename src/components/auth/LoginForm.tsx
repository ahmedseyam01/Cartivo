"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { signIn } from "next-auth/react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { FormError, TextField } from "@/components/shared/FormField";
import { useI18n } from "@/i18n/I18nProvider";
import { loginSchema, type LoginValues } from "@/lib/validations";
import { safeRedirect } from "@/lib/safe-redirect";

export function LoginForm() {
  const { t } = useI18n();
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = safeRedirect(searchParams.get("callbackUrl"));
  const [error, setError] = useState<string | null>(null);

  const form = useForm<LoginValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  });
  const { errors, isSubmitting } = form.formState;

  async function onSubmit(values: LoginValues) {
    setError(null);
    const result = await signIn("credentials", { ...values, redirect: false });
    if (!result?.ok) {
      setError(result?.error && result.error !== "CredentialsSignin" ? result.error : t.auth.invalidLogin);
      return;
    }
    router.replace(callbackUrl);
    router.refresh();
  }

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4" noValidate>
      <TextField
        label={t.auth.email}
        type="email"
        autoComplete="email"
        inputMode="email"
        placeholder="you@example.com"
        dir="ltr"
        registration={form.register("email")}
        error={errors.email}
      />
      <div className="space-y-2">
        <TextField
          label={t.auth.password}
          type="password"
          autoComplete="current-password"
          registration={form.register("password")}
          error={errors.password}
        />
        <Link href="/forgot-password" className="text-muted-foreground hover:text-foreground block text-end text-xs">
          {t.auth.forgot}
        </Link>
      </div>
      <FormError message={error} />
      <Button type="submit" size="lg" disabled={isSubmitting} className="h-12 w-full rounded-full text-base">
        {isSubmitting && <Loader2 className="animate-spin" />}
        {t.auth.signIn}
      </Button>
    </form>
  );
}
