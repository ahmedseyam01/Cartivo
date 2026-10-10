import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { getDictionary, setRequestLocale } from "@/i18n/server";
import { LoginForm } from "@/components/auth/LoginForm";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  return { title: getDictionary(setRequestLocale((await params).locale)).auth.signIn };
}

export default async function LoginPage({ params }: Props) {
  const t = getDictionary(setRequestLocale((await params).locale));

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h1 className="text-2xl font-bold tracking-tight">{t.auth.welcomeBack}</h1>
        <p className="text-muted-foreground mt-2 text-sm">{t.auth.signInText}</p>
      </div>
      <Suspense>
        <LoginForm />
      </Suspense>
      <p className="text-muted-foreground text-center text-sm">
        {t.auth.newHere}{" "}
        <Link href="/register" className="text-foreground font-medium underline-offset-4 hover:underline">
          {t.auth.createAccount}
        </Link>
      </p>
    </div>
  );
}
