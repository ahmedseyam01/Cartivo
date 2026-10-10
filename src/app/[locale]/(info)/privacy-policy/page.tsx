import type { Metadata } from "next";
import { getDictionary, setRequestLocale } from "@/i18n/server";
import { InfoPage, InfoSections } from "@/components/shared/InfoPage";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  return { title: getDictionary(setRequestLocale((await params).locale)).privacy.title };
}

export default async function PrivacyPolicyPage({ params }: Props) {
  const { privacy } = getDictionary(setRequestLocale((await params).locale));

  return (
    <InfoPage title={privacy.title} description={privacy.description}>
      <InfoSections sections={privacy.sections} />
    </InfoPage>
  );
}
