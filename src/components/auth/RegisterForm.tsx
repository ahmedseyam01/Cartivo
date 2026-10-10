"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import toast from "react-hot-toast";
import { Loader2 } from "lucide-react";
import { registerUser } from "@/actions/auth";
import { Button } from "@/components/ui/button";
import { FormError, TextField } from "@/components/shared/FormField";
import { registerSchema, type RegisterValues } from "@/lib/validations";

export function RegisterForm() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);

  const form = useForm<RegisterValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: { name: "", email: "", password: "", rePassword: "", phone: "" },
  });
  const { errors, isSubmitting } = form.formState;

  async function onSubmit(values: RegisterValues) {
    setError(null);
    const created = await registerUser(values);
    if (!created.ok) return setError(created.error);

    // Sign the new customer straight in.
    const session = await signIn("credentials", { email: values.email, password: values.password, redirect: false });
    if (!session?.ok) {
      router.push("/login");
      return;
    }
    toast.success(`Welcome to Cartivo, ${values.name.split(" ")[0]}!`);
    router.replace("/");
    router.refresh();
  }

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-4 sm:grid-cols-2" noValidate>
      <TextField className="sm:col-span-2" label="Full name" autoComplete="name" registration={form.register("name")} error={errors.name} />
      <TextField
        label="Email"
        type="email"
        inputMode="email"
        autoComplete="email"
        registration={form.register("email")}
        error={errors.email}
      />
      <TextField
        label="Phone"
        type="tel"
        inputMode="tel"
        autoComplete="tel"
        placeholder="01xxxxxxxxx"
        registration={form.register("phone")}
        error={errors.phone}
      />
      <TextField
        label="Password"
        type="password"
        autoComplete="new-password"
        registration={form.register("password")}
        error={errors.password}
      />
      <TextField
        label="Confirm password"
        type="password"
        autoComplete="new-password"
        registration={form.register("rePassword")}
        error={errors.rePassword}
      />
      <div className="space-y-4 sm:col-span-2">
        <FormError message={error} />
        <Button type="submit" size="lg" disabled={isSubmitting} className="h-12 w-full rounded-full text-base">
          {isSubmitting && <Loader2 className="animate-spin" />}
          Create account
        </Button>
      </div>
    </form>
  );
}
