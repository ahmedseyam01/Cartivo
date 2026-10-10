import type { Metadata, Viewport } from "next";
import { Geist, IBM_Plex_Sans_Arabic } from "next/font/google";
import { AppProviders } from "@/providers/AppProviders";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { BottomNav } from "@/components/layout/BottomNav";
import { siteConfig } from "@/lib/config";
import { getDirection, isLocale, locales } from "@/i18n/config";
import { getDictionary, setRequestLocale } from "@/i18n/server";
import "../globals.css";

const latin = Geist({ subsets: ["latin"], variable: "--font-app", display: "swap" });
const arabic = IBM_Plex_Sans_Arabic({
  subsets: ["arabic", "latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-app",
  display: "swap",
});

type Props = { children: React.ReactNode; params: Promise<{ locale: string }> };

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: Omit<Props, "children">): Promise<Metadata> {
  const { locale } = await params;
  const t = getDictionary(isLocale(locale) ? locale : "en");
  return {
    metadataBase: new URL(siteConfig.url),
    title: { default: `${siteConfig.name} — ${t.meta.tagline}`, template: `%s · ${siteConfig.name}` },
    description: t.meta.description,
    applicationName: siteConfig.name,
    openGraph: { siteName: siteConfig.name, type: "website", locale: locale === "ar" ? "ar_EG" : "en_US" },
  };
}

export const viewport: Viewport = {
  themeColor: "#0a0a0a",
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default async function LocaleLayout({ children, params }: Props) {
  const locale = setRequestLocale((await params).locale);
  const font = locale === "ar" ? arabic : latin;

  return (
    <html lang={locale} dir={getDirection(locale)} className={font.variable}>
      <body className="flex min-h-dvh flex-col">
        <AppProviders locale={locale} t={getDictionary(locale)}>
          <Header />
          <main className="flex-1">{children}</main>
          <Footer />
          <BottomNav />
        </AppProviders>
      </body>
    </html>
  );
}
