"use client";

import { Check } from "lucide-react";
import { Reveal } from "@/components/reveal";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const plans = [
  {
    name: "Start",
    price: "₪100",
    featured: false,
    features: [
      "Online booking page",
      "WhatsApp & SMS reminders",
      "Up to 2 staff members",
      "Calendar management",
      "Instagram & WhatsApp link",
    ],
    cta: "Start free →",
  },
  {
    name: "Premium",
    price: "₪299",
    featured: true,
    features: [
      "Everything in Start, plus:",
      "Unlimited staff",
      "Online payments & deposits",
      "Visibility in Sefa's search",
      "Analytics dashboard",
      "Automatic waitlist",
      "Priority support",
    ],
    cta: "Start free →",
  },
  {
    name: "Business",
    price: "₪599",
    featured: false,
    features: [
      "Everything in Premium, plus:",
      "Multi-location support",
      "Custom branding",
      "Advanced reporting & API",
      "Dedicated account manager",
    ],
    cta: "Contact us →",
  },
];

export function Pricing() {
  return (
    <section id="pricing" className="mx-auto max-w-6xl px-6 py-24">
      <Reveal className="text-center">
        <span className="text-xs font-medium uppercase tracking-widest text-gold">Pricing</span>
        <h2 className="mt-3 font-display text-3xl font-semibold tracking-tight sm:text-4xl">
          Simple. <span className="font-accent-italic">No surprises.</span>
        </h2>
        <p className="mt-4 inline-block rounded-full bg-gold/15 px-4 py-1.5 text-sm text-ink/70">
          3 months free for every founding salon · No credit card required
        </p>
      </Reveal>

      <div className="mt-12 grid gap-6 lg:grid-cols-3">
        {plans.map((plan, i) => (
          <Reveal key={plan.name} delay={i * 0.08}>
            <div
              className={cn(
                "flex h-full flex-col rounded-ticket border p-8 transition-transform duration-500 hover:-translate-y-2",
                plan.featured
                  ? "border-gold/40 bg-ink text-paper shadow-glass-lg"
                  : "border-ink/10 bg-white/50"
              )}
            >
              {plan.featured && (
                <span className="mb-4 w-fit rounded-full bg-gold px-3 py-1 text-xs font-medium text-ink">
                  Most popular
                </span>
              )}
              <h3 className="font-luxury text-xl italic font-medium">{plan.name}</h3>
              <p className="mt-3">
                <span className="font-display text-3xl font-semibold">{plan.price}</span>
                <span className={cn("text-sm", plan.featured ? "text-paper/50" : "text-ink/45")}>/mo after free trial</span>
              </p>

              <ul className="mt-6 flex-1 space-y-3">
                {plan.features.map((f) => (
                  <li key={f} className="flex items-start gap-2 text-sm">
                    <Check className={cn("mt-0.5 h-4 w-4 shrink-0", plan.featured ? "text-gold" : "text-teal")} />
                    <span className={plan.featured ? "text-paper/80" : "text-ink/75"}>{f}</span>
                  </li>
                ))}
              </ul>

              <Button variant={plan.featured ? "primary" : "outline"} className="mt-8 w-full mirror-shine">
                {plan.cta}
              </Button>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
