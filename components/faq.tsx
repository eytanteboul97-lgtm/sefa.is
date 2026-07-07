"use client";

import * as Accordion from "@radix-ui/react-accordion";
import { ChevronDown } from "lucide-react";
import { Reveal } from "@/components/reveal";

const faqs = [
  {
    q: "Do my clients need to download an app?",
    a: "No. Your clients book through a simple webpage — no app, no signup. They pick a time and confirm. That's it.",
  },
  {
    q: "Is Sefa available in Hebrew?",
    a: "Yes. Your client-facing booking page is fully in Hebrew. Your dashboard works in English, French and Hebrew.",
  },
  {
    q: "What happens after the free trial?",
    a: "After 3 months you choose a plan. No automatic charge — we remind you 7 days in advance. No tricks, no surprises.",
  },
  {
    q: "How long does setup take?",
    a: "Under 10 minutes. As a founding partner, we do it together on a dedicated onboarding call.",
  },
  {
    q: "Can I still use WhatsApp alongside Sefa?",
    a: "Absolutely. Share your Sefa link in your WhatsApp status. Clients who prefer messaging can still do so.",
  },
];

export function FAQ() {
  return (
    <section className="mx-auto max-w-3xl px-6 py-24">
      <Reveal>
        <span className="text-xs font-medium uppercase tracking-widest text-gold">FAQ</span>
        <h2 className="mt-3 font-display text-3xl font-semibold tracking-tight sm:text-4xl">Questions.</h2>
      </Reveal>

      <Accordion.Root type="single" collapsible className="mt-10 divide-y divide-ink/10 border-y border-ink/10">
        {faqs.map((faq, i) => (
          <Accordion.Item key={faq.q} value={`item-${i}`}>
            <Accordion.Header>
              <Accordion.Trigger className="group flex w-full items-center justify-between py-5 text-left font-display text-base font-medium">
                {faq.q}
                <ChevronDown className="h-4 w-4 shrink-0 text-ink/40 transition-transform duration-300 group-data-[state=open]:rotate-180" />
              </Accordion.Trigger>
            </Accordion.Header>
            <Accordion.Content className="overflow-hidden pb-5 text-sm text-ink/60 data-[state=open]:animate-accordion-down data-[state=closed]:animate-accordion-up">
              {faq.a}
            </Accordion.Content>
          </Accordion.Item>
        ))}
      </Accordion.Root>
    </section>
  );
}
