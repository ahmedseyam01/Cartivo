"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { TextField } from "@/components/shared/FormField";
import { contactSchema, type ContactValues } from "@/lib/validations";
import { siteConfig } from "@/lib/config";

/** There is no contact endpoint in the API, so the message opens in the visitor's mail app. */
export function ContactForm() {
  const form = useForm<ContactValues>({
    resolver: zodResolver(contactSchema),
    defaultValues: { name: "", email: "", message: "" },
  });
  const { errors } = form.formState;

  function onSubmit({ name, email, message }: ContactValues) {
    const subject = encodeURIComponent(`Message from ${name}`);
    const body = encodeURIComponent(`${message}\n\n— ${name} (${email})`);
    window.location.href = `mailto:${siteConfig.contact.email}?subject=${subject}&body=${body}`;
  }

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="text-foreground grid gap-4" noValidate>
      <TextField label="Name" autoComplete="name" registration={form.register("name")} error={errors.name} />
      <TextField label="Email" type="email" autoComplete="email" registration={form.register("email")} error={errors.email} />
      <div className="grid gap-2">
        <Label htmlFor="message">Message</Label>
        <textarea
          id="message"
          rows={5}
          aria-invalid={!!errors.message}
          className="border-input focus-visible:border-ring focus-visible:ring-ring/50 aria-invalid:border-destructive rounded-xl border px-3 py-2 text-base outline-none focus-visible:ring-[3px] md:text-sm"
          {...form.register("message")}
        />
        {errors.message && <p className="text-destructive text-xs">{errors.message.message}</p>}
      </div>
      <Button type="submit" size="lg" className="h-12 rounded-full">
        <Send /> Send message
      </Button>
    </form>
  );
}
