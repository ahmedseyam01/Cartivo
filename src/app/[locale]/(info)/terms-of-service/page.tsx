import type { Metadata } from "next";
import { getDictionary, setRequestLocale } from "@/i18n/server";
import { InfoPage, InfoSections } from "@/components/shared/InfoPage";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  return { title: getDictionary(setRequestLocale((await params).locale)).terms.title };
}

export default async function TermsOfServicePage({ params }: Props) {
  const { terms } = getDictionary(setRequestLocale((await params).locale));

  return (
    <InfoPage title={terms.title} description={terms.description}>
      <InfoSections sections={terms.sections} />
    </InfoPage>
  );
}
