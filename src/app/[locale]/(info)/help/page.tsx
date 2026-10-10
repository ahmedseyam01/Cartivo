import type { Metadata } from "next";
import Link from "next/link";
import { ChevronDown } from "lucide-react";
import { siteConfig } from "@/lib/config";
import { getDictionary, setRequestLocale } from "@/i18n/server";
import { InfoPage } from "@/components/shared/InfoPage";
import { Button } from "@/components/ui/button";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  return { title: getDictionary(setRequestLocale((await params).locale)).help.title };
}

export default async function HelpPage({ params }: Props) {
  const t = getDictionary(setRequestLocale((await params).locale));
  const { help } = t;

  return (
    <InfoPage title={help.title} description={help.description}>
      <div className="divide-y border-y">
        {help.faqs.map((faq) => (
          <details key={faq.q} className="group py-1">
            <summary className="text-foreground flex cursor-pointer list-none items-center justify-between gap-4 py-4 font-medium [&::-webkit-details-marker]:hidden">
              {faq.q}
              <ChevronDown className="size-4 shrink-0 transition-transform group-open:rotate-180" />
            </summary>
            <p className="pb-4">{faq.a}</p>
          </details>
        ))}
      </div>
      <section>
        <h2>{help.stillTitle}</h2>
        <p>{help.stillText}</p>
        <div className="mt-4 flex flex-wrap gap-3">
          <Button asChild className="rounded-full">
            <Link href="/contact" className="!text-background !no-underline">
              {t.contact.title}
            </Link>
          </Button>
          <Button asChild variant="outline" className="rounded-full">
            <a href={`mailto:${siteConfig.contact.email}`} className="!no-underline">
              {help.emailSupport}
            </a>
          </Button>
        </div>
      </section>
    </InfoPage>
  );
}
