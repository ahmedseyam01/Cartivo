import { siteConfig } from "@/lib/config";
import { getI18n } from "@/i18n/server";
import { PageHeader } from "./PageHeader";

/** Layout for static content pages (about, policies, help). */
export function InfoPage({
  title,
  description,
  children,
}: {
  title: string;
  description?: string;
  children: React.ReactNode;
}) {
  const { t } = getI18n();

  return (
    <div className="page-container max-w-3xl">
      <PageHeader title={title} description={description} breadcrumbs={[{ href: "/", label: t.nav.home }, { label: title }]} />
      <div className="text-muted-foreground [&_h2]:text-foreground [&_a]:text-foreground space-y-8 leading-relaxed [&_a]:underline [&_a]:underline-offset-4 [&_h2]:mb-3 [&_h2]:text-lg [&_h2]:font-semibold [&_ul]:list-disc [&_ul]:space-y-2 [&_ul]:ps-5">
        {children}
      </div>
    </div>
  );
}

/** Titled paragraphs, e.g. the privacy policy and terms of service. */
export function InfoSections({ sections }: { sections: { title: string; body: string }[] }) {
  const { t } = getI18n();

  return (
    <>
      {sections.map((section) => (
        <section key={section.title}>
          <h2>{section.title}</h2>
          <p>{section.body}</p>
        </section>
      ))}
      <p>
        {t.questions} <a href={`mailto:${siteConfig.contact.email}`}>{siteConfig.contact.email}</a>
      </p>
    </>
  );
}
