"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import toast from "react-hot-toast";
import { Loader2 } from "lucide-react";
import { requestPasswordReset, resetPassword, verifyResetCode } from "@/actions/auth";
import { Button } from "@/components/ui/button";
import { FormError, TextField } from "@/components/shared/FormField";
import { format } from "@/i18n/config";
import { useI18n } from "@/i18n/I18nProvider";
import { forgotPasswordSchema, resetCodeSchema, resetPasswordSchema } from "@/lib/validations";
import type { z } from "zod";

type Step = "email" | "code" | "password";

function Submit({ busy, children }: { busy: boolean; children: React.ReactNode }) {
  return (
    <Button type="submit" size="lg" disabled={busy} className="h-12 w-full rounded-full text-base">
      {busy && <Loader2 className="animate-spin" />}
      {children}
    </Button>
  );
}

export function ForgotPasswordFlow() {
  const { t } = useI18n();
  const router = useRouter();
  const [step, setStep] = useState<Step>("email");
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | null>(null);

  const emailForm = useForm<z.infer<typeof forgotPasswordSchema>>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: { email: "" },
  });
  const codeForm = useForm<z.infer<typeof resetCodeSchema>>({
    resolver: zodResolver(resetCodeSchema),
    defaultValues: { resetCode: "" },
  });
  const passwordForm = useForm<z.infer<typeof resetPasswordSchema>>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: { newPassword: "", confirm: "" },
  });

  async function sendCode({ email }: { email: string }) {
    setError(null);
    const result = await requestPasswordReset(email);
    if (!result.ok) return setError(result.error);
    setEmail(email);
    setStep("code");
  }

  async function checkCode({ resetCode }: { resetCode: string }) {
    setError(null);
    const result = await verifyResetCode(resetCode);
    if (!result.ok) return setError(result.error);
    setStep("password");
  }

  async function savePassword({ newPassword }: { newPassword: string }) {
    setError(null);
    const result = await resetPassword(email, newPassword);
    if (!result.ok) return setError(result.error);

    const session = await signIn("credentials", { email, password: newPassword, redirect: false });
    toast.success(t.toast.passwordUpdated);
    router.replace(session?.ok ? "/" : "/login");
    router.refresh();
  }

  const heading = {
    email: { title: t.auth.resetEmailTitle, text: t.auth.resetEmailText },
    code: { title: t.auth.resetCodeTitle, text: format(t.auth.resetCodeText, { email }) },
    password: { title: t.auth.resetPasswordTitle, text: t.auth.resetPasswordText },
  }[step];

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h1 className="text-2xl font-bold tracking-tight">{heading.title}</h1>
        <p className="text-muted-foreground mt-2 text-sm">{heading.text}</p>
      </div>

      {step === "email" && (
        <form onSubmit={emailForm.handleSubmit(sendCode)} className="space-y-4" noValidate>
          <TextField
            label={t.auth.email}
            dir="ltr"
            type="email"
            inputMode="email"
            autoComplete="email"
            registration={emailForm.register("email")}
            error={emailForm.formState.errors.email}
          />
          <FormError message={error} />
          <Submit busy={emailForm.formState.isSubmitting}>{t.auth.sendCode}</Submit>
        </form>
      )}

      {step === "code" && (
        <form onSubmit={codeForm.handleSubmit(checkCode)} className="space-y-4" noValidate>
          <TextField
            label={t.auth.code}
            inputMode="numeric"
            autoComplete="one-time-code"
            className="[&_input]:text-center [&_input]:text-lg [&_input]:tracking-[0.5em]"
            registration={codeForm.register("resetCode")}
            error={codeForm.formState.errors.resetCode}
          />
          <FormError message={error} />
          <Submit busy={codeForm.formState.isSubmitting}>{t.auth.verify}</Submit>
          <button
            type="button"
            onClick={() => sendCode({ email })}
            className="text-muted-foreground hover:text-foreground w-full text-center text-sm"
          >
            {t.auth.resend}
          </button>
        </form>
      )}

      {step === "password" && (
        <form onSubmit={passwordForm.handleSubmit(savePassword)} className="space-y-4" noValidate>
          <TextField
            label={t.auth.newPassword}
            type="password"
            autoComplete="new-password"
            registration={passwordForm.register("newPassword")}
            error={passwordForm.formState.errors.newPassword}
          />
          <TextField
            label={t.auth.confirmPassword}
            type="password"
            autoComplete="new-password"
            registration={passwordForm.register("confirm")}
            error={passwordForm.formState.errors.confirm}
          />
          <FormError message={error} />
          <Submit busy={passwordForm.formState.isSubmitting}>{t.auth.saveAndSignIn}</Submit>
        </form>
      )}
    </div>
  );
}
