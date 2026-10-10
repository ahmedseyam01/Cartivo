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
import { forgotPasswordSchema, resetCodeSchema, resetPasswordSchema } from "@/lib/validations";
import type { z } from "zod";

type Step = "email" | "code" | "password";

const titles: Record<Step, { title: string; text: (email: string) => string }> = {
  email: { title: "Reset your password", text: () => "Enter your email and we'll send you a reset code." },
  code: { title: "Check your inbox", text: (email) => `We sent a code to ${email}. It expires in 10 minutes.` },
  password: { title: "Choose a new password", text: () => "Make it strong — you'll be signed in right after." },
};

function Submit({ busy, children }: { busy: boolean; children: React.ReactNode }) {
  return (
    <Button type="submit" size="lg" disabled={busy} className="h-12 w-full rounded-full text-base">
      {busy && <Loader2 className="animate-spin" />}
      {children}
    </Button>
  );
}

export function ForgotPasswordFlow() {
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
    toast.success("Password updated");
    router.replace(session?.ok ? "/" : "/login");
    router.refresh();
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h1 className="text-2xl font-bold tracking-tight">{titles[step].title}</h1>
        <p className="text-muted-foreground mt-2 text-sm">{titles[step].text(email)}</p>
      </div>

      {step === "email" && (
        <form onSubmit={emailForm.handleSubmit(sendCode)} className="space-y-4" noValidate>
          <TextField
            label="Email"
            type="email"
            inputMode="email"
            autoComplete="email"
            registration={emailForm.register("email")}
            error={emailForm.formState.errors.email}
          />
          <FormError message={error} />
          <Submit busy={emailForm.formState.isSubmitting}>Send reset code</Submit>
        </form>
      )}

      {step === "code" && (
        <form onSubmit={codeForm.handleSubmit(checkCode)} className="space-y-4" noValidate>
          <TextField
            label="Reset code"
            inputMode="numeric"
            autoComplete="one-time-code"
            className="[&_input]:text-center [&_input]:text-lg [&_input]:tracking-[0.5em]"
            registration={codeForm.register("resetCode")}
            error={codeForm.formState.errors.resetCode}
          />
          <FormError message={error} />
          <Submit busy={codeForm.formState.isSubmitting}>Verify code</Submit>
          <button
            type="button"
            onClick={() => sendCode({ email })}
            className="text-muted-foreground hover:text-foreground w-full text-center text-sm"
          >
            Didn&apos;t get it? Send again
          </button>
        </form>
      )}

      {step === "password" && (
        <form onSubmit={passwordForm.handleSubmit(savePassword)} className="space-y-4" noValidate>
          <TextField
            label="New password"
            type="password"
            autoComplete="new-password"
            registration={passwordForm.register("newPassword")}
            error={passwordForm.formState.errors.newPassword}
          />
          <TextField
            label="Confirm password"
            type="password"
            autoComplete="new-password"
            registration={passwordForm.register("confirm")}
            error={passwordForm.formState.errors.confirm}
          />
          <FormError message={error} />
          <Submit busy={passwordForm.formState.isSubmitting}>Save and sign in</Submit>
        </form>
      )}
    </div>
  );
}
