import type { Metadata } from "next";
import { InfoPage } from "@/components/shared/InfoPage";
import { siteConfig } from "@/lib/config";

export const metadata: Metadata = { title: "Returns & exchanges" };

const steps = [
  { title: "Contact us", text: `Email ${siteConfig.contact.email} with your order number.` },
  { title: "Get a return label", text: "We'll send you a prepaid shipping label." },
  { title: "Ship it back", text: "Pack the items and drop them at any courier point." },
  { title: "Get your refund", text: "Refunds are processed within 5–7 business days." },
];

export default function ReturnsPage() {
  return (
    <InfoPage title="Returns & exchanges" description="Not quite right? We'll make it right.">
      <div className="bg-foreground text-background rounded-2xl p-6">
        <p className="text-lg font-semibold">30-day return window</p>
        <p className="mt-1 text-white/70">Return or exchange any eligible item within 30 days of delivery.</p>
      </div>
      <section>
        <h2>Conditions</h2>
        <ul>
          <li>Items must be unused, in original condition, with tags attached.</li>
          <li>Include the original packaging where possible.</li>
          <li>Some items (e.g. personal care) can&apos;t be returned for hygiene reasons.</li>
        </ul>
      </section>
      <section>
        <h2>How to return</h2>
        <ol className="space-y-4">
          {steps.map((step, i) => (
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
    </InfoPage>
  );
}
