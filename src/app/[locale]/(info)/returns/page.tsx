import type { Metadata } from "next";
import { getDictionary, setRequestLocale } from "@/i18n/server";
import { InfoPage } from "@/components/shared/InfoPage";
import { siteConfig } from "@/lib/config";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  return { title: getDictionary(setRequestLocale((await params).locale)).returns.title };
}

export default async function ReturnsPage({ params }: Props) {
  const { returns, questions } = getDictionary(setRequestLocale((await params).locale));

  return (
    <InfoPage title={returns.title} description={returns.description}>
      <div className="bg-foreground text-background rounded-2xl p-6">
        <p className="text-lg font-semibold">{returns.windowTitle}</p>
        <p className="mt-1 text-white/70">{returns.windowText}</p>
      </div>
      <section>
        <h2>{returns.conditionsTitle}</h2>
        <ul>
          {returns.conditions.map((condition) => (
            <li key={condition}>{condition}</li>
          ))}
        </ul>
      </section>
      <section>
        <h2>{returns.howTitle}</h2>
        <ol className="space-y-4">
          {returns.steps.map((step, i) => (
            <li key={step.title} className="flex gap-4">
              <span className="bg-foreground text-background flex size-7 shrink-0 items-center justify-center rounded-full text-sm font-semibold">
                {i + 1}
              </span>
              <div>
                <p className="text-foreground font-medium">{step.title}</p>
                <p>{step.text}</p>
              </div>
            </li>
          ))}
        </ol>
      </section>
      <p>
        {questions} <a href={`mailto:${siteConfig.contact.email}`}>{siteConfig.contact.email}</a>
      </p>
    </InfoPage>
  );
}
