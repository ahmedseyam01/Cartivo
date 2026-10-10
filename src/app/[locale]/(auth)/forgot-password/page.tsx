import type { Metadata } from "next";
import Link from "next/link";
import { getDictionary, setRequestLocale } from "@/i18n/server";
import { ForgotPasswordFlow } from "@/components/auth/ForgotPasswordFlow";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  return { title: getDictionary(setRequestLocale((await params).locale)).auth.resetTitle };
}

export default async function ForgotPasswordPage({ params }: Props) {
  const t = getDictionary(setRequestLocale((await params).locale));

  return (
    <div className="space-y-6">
      <ForgotPasswordFlow />
      <p className="text-muted-foreground text-center text-sm">
        {t.auth.remembered}{" "}
        <Link href="/login" className="text-foreground font-medium underline-offset-4 hover:underline">
          {t.auth.backToSignIn}
        </Link>
      </p>
    </div>
  );
}
