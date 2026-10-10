import type { Metadata } from "next";
import { InfoPage } from "@/components/shared/InfoPage";
import { Perks } from "@/components/shared/Perks";
import { siteConfig } from "@/lib/config";

export const metadata: Metadata = { title: "About" };

export default function AboutPage() {
  return (
    <InfoPage title={`About ${siteConfig.name}`} description={siteConfig.tagline}>
      <p className="text-foreground text-lg">
        {siteConfig.name} is an online store for people who want great products without the noise — a focused
        catalogue of electronics, fashion and lifestyle essentials from brands we trust.
      </p>
      <section>
        <h2>Our mission</h2>
        <p>
          Make shopping simple, honest and fast. Clear prices, real stock levels, free delivery and a checkout that
          takes seconds — on your phone or your laptop.
        </p>
      </section>
      <section>
        <h2>What we stand for</h2>
        <ul>
          <li>Quality — every product is hand-picked from reputable brands.</li>
          <li>Transparency — no hidden fees, ever.</li>
          <li>Service — real people ready to help, 7 days a week.</li>
          <li>Trust — secure payments and a 30-day return window.</li>
        </ul>
      </section>
      <Perks />
    </InfoPage>
  );
}
