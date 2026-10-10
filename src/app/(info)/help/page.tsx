import type { Metadata } from "next";
import Link from "next/link";
import { ChevronDown } from "lucide-react";
import { InfoPage } from "@/components/shared/InfoPage";
import { Button } from "@/components/ui/button";
import { siteConfig } from "@/lib/config";

export const metadata: Metadata = { title: "Help center" };

const faqs = [
  {
    q: "How do I place an order?",
    a: "Add products to your cart, open the cart and tap Checkout. Pick a saved address or enter a new one, choose card or cash on delivery, and confirm.",
  },
  {
    q: "Which payment methods do you accept?",
    a: "Credit and debit cards (processed securely by Stripe) and cash on delivery.",
  },
  {
    q: "How much is delivery and how long does it take?",
    a: "Delivery is free on every order. Most orders arrive within 3–5 business days.",
  },
  {
    q: "How do I track my order?",
    a: "Go to Account → Orders. Each order shows its payment and delivery status, plus everything you bought.",
  },
  {
    q: "Can I return an item?",
    a: "Yes — you have 30 days from delivery. See our returns page for the full policy.",
  },
  {
    q: "I forgot my password.",
    a: "Use “Forgot password?” on the sign-in page. We'll email you a code to set a new one.",
  },
];

export default function HelpPage() {
  return (
    <InfoPage title="Help center" description="Answers to the questions we hear most.">
      <div className="divide-y border-y">
        {faqs.map((faq) => (
          <details key={faq.q} className="group py-1">
            <summary className="text-foreground flex cursor-pointer list-none items-center justify-between gap-4 py-4 font-medium [&::-webkit-details-marker]:hidden">
              {faq.q}
              <ChevronDown className="size-4 shrink-0 transition-transform group-open:rotate-180" />
            </summary>
            <p className="pb-4">{faq.a}</p>
          </details>
        ))}
      </div>
      <section>
        <h2>Still need help?</h2>
        <p>Our team usually replies within a few hours.</p>
        <div className="mt-4 flex flex-wrap gap-3">
          <Button asChild className="rounded-full">
            <Link href="/contact" className="!text-background !no-underline">
              Contact us
            </Link>
          </Button>
          <Button asChild variant="outline" className="rounded-full">
            <a href={`mailto:${siteConfig.contact.email}`} className="!no-underline">
              Email support
            </a>
          </Button>
        </div>
      </section>
    </InfoPage>
  );
}
