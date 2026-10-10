import type { Metadata } from "next";
import Link from "next/link";
import { getDictionary, setRequestLocale } from "@/i18n/server";
import { RegisterForm } from "@/components/auth/RegisterForm";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  return { title: getDictionary(setRequestLocale((await params).locale)).auth.createTitle };
}

export default async function RegisterPage({ params }: Props) {
  const t = getDictionary(setRequestLocale((await params).locale));

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h1 className="text-2xl font-bold tracking-tight">{t.auth.createTitle}</h1>
        <p className="text-muted-foreground mt-2 text-sm">{t.auth.createText}</p>
      </div>
      <RegisterForm />
      <p className="text-muted-foreground text-center text-sm">
        {t.auth.haveAccount}{" "}
        <Link href="/login" className="text-foreground font-medium underline-offset-4 hover:underline">
          {t.auth.signIn}
        </Link>
      </p>
    </div>
  );
}
