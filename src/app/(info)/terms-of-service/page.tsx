import type { Metadata } from "next";
import { InfoPage } from "@/components/shared/InfoPage";
import { siteConfig } from "@/lib/config";

export const metadata: Metadata = { title: "Terms of service" };

export default function TermsOfServicePage() {
  return (
    <InfoPage title="Terms of service" description={`The rules for using ${siteConfig.name}.`}>
      <section>
        <h2>Acceptance</h2>
        <p>By using {siteConfig.name} you agree to these terms. If you don&apos;t agree, please don&apos;t use the store.</p>
      </section>
      <section>
        <h2>Products and pricing</h2>
        <p>
          We work hard to keep descriptions, stock and prices accurate. Prices are in Egyptian pounds and may change
          without notice; you always pay the price shown at checkout.
        </p>
      </section>
      <section>
        <h2>Orders and payment</h2>
        <p>Card payments are charged at checkout. Cash-on-delivery orders are paid when they arrive.</p>
      </section>
      <section>
        <h2>Returns</h2>
        <p>Eligible items can be returned within 30 days of delivery, as described in our returns policy.</p>
      </section>
      <section>
        <h2>Contact</h2>
        <p>
          Email <a href={`mailto:${siteConfig.contact.email}`}>{siteConfig.contact.email}</a> with any questions.
        </p>
      </section>
    </InfoPage>
  );
}
