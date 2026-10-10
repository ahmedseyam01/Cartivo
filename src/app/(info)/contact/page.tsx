import type { Metadata } from "next";
import { Mail, MapPin, Phone } from "lucide-react";
import { PageHeader } from "@/components/shared/PageHeader";
import { ContactForm } from "@/components/shared/ContactForm";
import { siteConfig } from "@/lib/config";

export const metadata: Metadata = { title: "Contact us" };

const channels = [
  { icon: Mail, label: "Email", value: siteConfig.contact.email, href: `mailto:${siteConfig.contact.email}` },
  { icon: Phone, label: "Phone", value: siteConfig.contact.phone, href: `tel:${siteConfig.contact.phone.replace(/\s/g, "")}` },
  { icon: MapPin, label: "Address", value: siteConfig.contact.address },
];

export default function ContactPage() {
  return (
    <div className="page-container max-w-5xl">
      <PageHeader
        title="Contact us"
        description="We'd love to hear from you. We usually reply within a few hours."
        breadcrumbs={[{ href: "/", label: "Home" }, { label: "Contact" }]}
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
                  <span className="font-medium">{value}</span>
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
