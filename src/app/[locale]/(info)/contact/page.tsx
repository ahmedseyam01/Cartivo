import type { Metadata } from "next";
import { Mail, MapPin, Phone } from "lucide-react";
import { PageHeader } from "@/components/shared/PageHeader";
import { ContactForm } from "@/components/shared/ContactForm";
import { siteConfig } from "@/lib/config";
import { getDictionary, setRequestLocale } from "@/i18n/server";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  return { title: getDictionary(setRequestLocale((await params).locale)).contact.title };
}

export default async function ContactPage({ params }: Props) {
  const t = getDictionary(setRequestLocale((await params).locale));
  const channels = [
    { icon: Mail, label: t.contact.email, value: siteConfig.contact.email, href: `mailto:${siteConfig.contact.email}` },
    { icon: Phone, label: t.contact.phone, value: siteConfig.contact.phone, href: `tel:${siteConfig.contact.phone.replace(/\s/g, "")}` },
    { icon: MapPin, label: t.contact.address, value: siteConfig.contact.address },
  ];

  return (
    <div className="page-container max-w-5xl">
      <PageHeader
        title={t.contact.title}
        description={t.contact.description}
        breadcrumbs={[{ href: "/", label: t.nav.home }, { label: t.contact.title }]}
      />
      <div className="grid gap-10 md:grid-cols-[1fr_1.4fr]">
        <ul className="space-y-3">
          {channels.map(({ icon: Icon, label, value, href }) => {
            const content = (
              <>
                <span className="bg-muted flex size-10 shrink-0 items-center justify-center rounded-full">
                  <Icon className="size-5" />
                </span>
                <span>
                  <span className="text-muted-foreground block text-xs">{label}</span>
                  <span className="font-medium" dir="auto">{value}</span>
                </span>
              </>
            );
            return (
              <li key={label}>
                {href ? (
                  <a href={href} className="hover:border-foreground flex items-center gap-4 rounded-2xl border p-4 transition-colors">
                    {content}
                  </a>
                ) : (
                  <div className="flex items-center gap-4 rounded-2xl border p-4">{content}</div>
                )}
              </li>
            );
          })}
        </ul>
        <ContactForm />
      </div>
    </div>
  );
}
