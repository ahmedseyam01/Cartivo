import type { Metadata } from "next";
import { InfoPage } from "@/components/shared/InfoPage";
import { siteConfig } from "@/lib/config";

export const metadata: Metadata = { title: "Privacy policy" };

export default function PrivacyPolicyPage() {
  return (
    <InfoPage title="Privacy policy" description="How we collect, use and protect your information.">
      <section>
        <h2>Information we collect</h2>
        <p>
          Details you give us when you create an account, place an order or contact support — such as your name,
          email, phone number and delivery address.
        </p>
      </section>
      <section>
        <h2>How we use it</h2>
        <p>To process orders, deliver your purchases, provide support and improve {siteConfig.name}.</p>
      </section>
      <section>
        <h2>Sharing</h2>
        <p>
          We never sell your data. We only share what&apos;s needed with delivery and payment partners to complete
          your order. Card payments are handled by Stripe; we never see or store your card number.
        </p>
      </section>
      <section>
        <h2>Security</h2>
        <p>Your session is encrypted and your access token never leaves our servers.</p>
      </section>
      <section>
        <h2>Contact</h2>
        <p>
          Questions? Email <a href={`mailto:${siteConfig.contact.email}`}>{siteConfig.contact.email}</a>.
        </p>
      </section>
    </InfoPage>
  );
}
