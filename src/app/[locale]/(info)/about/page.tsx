import type { Metadata } from "next";
import { getDictionary, setRequestLocale } from "@/i18n/server";
import { InfoPage } from "@/components/shared/InfoPage";
import { Perks } from "@/components/shared/Perks";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  return { title: getDictionary(setRequestLocale((await params).locale)).about.title };
}

export default async function AboutPage({ params }: Props) {
  const t = getDictionary(setRequestLocale((await params).locale));
  const { about } = t;

  return (
    <InfoPage title={about.title} description={t.meta.tagline}>
      <p className="text-foreground text-lg">{about.lead}</p>
      {about.sections.map((section) => (
        <section key={section.title}>
          <h2>{section.title}</h2>
          <p>{section.body}</p>
        </section>
      ))}
      <section>
        <h2>{about.valuesTitle}</h2>
        <ul>
          {about.values.map((value) => (
            <li key={value}>{value}</li>
          ))}
        </ul>
      </section>
      <Perks />
    </InfoPage>
  );
}
