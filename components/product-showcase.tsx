"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/dist/ScrollTrigger";
import { AnimatePresence, motion } from "framer-motion";

gsap.registerPlugin(ScrollTrigger);

const panels = [
  {
    key: "calendar",
    label: "Calendar",
    title: "Your calendar, always full.",
    body: "Every booking appears in real time. No calls, no back-and-forth. Sefa fills your calendar while you work.",
    points: [
      "Bookings created by clients around the clock",
      "Colour-coded by treatment and stylist",
      "Zero double-bookings, ever",
    ],
  },
  {
    key: "booking",
    label: "Booking",
    title: "Clients book themselves.",
    body: "An elegant booking page accessible from any link — Instagram bio, WhatsApp, or Google.",
    points: ["No app to download", "Choose treatment, stylist, date and time", "Instant SMS confirmation"],
  },
  {
    key: "reminders",
    label: "Reminders",
    title: "Zero no-shows.",
    body: "WhatsApp and SMS reminders sent automatically. No-show rates drop by 40% from day one.",
    points: ["Reminders 24h and 2h before", "Clients confirm in one tap", "Sent under your salon's name"],
  },
  {
    key: "payment",
    label: "Payment",
    title: "Get paid before they arrive.",
    body: "Collect a deposit at booking. Clients who pay always show up. Refunds handled automatically.",
    points: ["Card, Apple Pay, Google Pay", "Automatic refund on cancellation", "Payouts sent straight to your bank"],
  },
];

function CalendarMock() {
  const rows = [
    { time: "10:00", label: "Noa K. — Blowout · 60min" },
    { time: "11:30", label: "Shira M. — Colour · 90min" },
    { time: "13:15", label: "Tamar L. — Cut · 45min" },
  ];
  return (
    <div className="w-full space-y-2">
      <p className="mb-3 font-mono text-xs text-ink/40">Maison Glow — Tuesday, 1 July</p>
      {rows.map((r) => (
        <div key={r.time} className="flex items-center gap-3 rounded-xl bg-coral/10 px-4 py-3">
          <span className="font-mono text-xs text-ink/50">{r.time}</span>
          <span className="text-sm">{r.label}</span>
          <span className="ml-auto rounded-full bg-teal/15 px-2 py-0.5 text-[10px] text-teal">online</span>
        </div>
      ))}
    </div>
  );
}

function BookingMock() {
  return (
    <div className="w-full space-y-4 text-sm">
      <p className="font-mono text-xs text-ink/40">Book at Maison Glow · sefa.co/maison</p>
      <div className="rounded-xl border border-ink/10 p-4">
        <p className="text-ink/45">Treatment</p>
        <p className="font-medium">Cut + Blowout — ₪180</p>
      </div>
      <div className="rounded-xl border border-ink/10 p-4">
        <p className="text-ink/45">Date & time</p>
        <p className="font-medium">Tuesday, 1 July · 3:00 PM</p>
      </div>
      <button className="w-full rounded-full bg-ink py-3 text-center text-sm font-medium text-paper mirror-shine">
        Confirm appointment →
      </button>
    </div>
  );
}

function ReminderMock() {
  return (
    <div className="w-full space-y-3">
      <p className="font-mono text-xs text-ink/40">WhatsApp · Maison Glow · Automated</p>
      <div className="max-w-xs rounded-2xl rounded-tl-none bg-teal/10 px-4 py-3 text-sm">
        Hi Michal, quick reminder: your appointment is tomorrow at 3:00 PM with Liora. Reply YES to confirm.
      </div>
      <div className="ml-auto max-w-[140px] rounded-2xl rounded-tr-none bg-ink px-4 py-3 text-right text-sm text-paper">
        YES ✓
      </div>
      <div className="max-w-xs rounded-2xl rounded-tl-none bg-teal/10 px-4 py-3 text-sm">
        Confirmed! See you tomorrow at 3:00 PM.
      </div>
    </div>
  );
}

function PaymentMock() {
  return (
    <div className="w-full space-y-4 text-sm">
      <p className="font-mono text-xs text-ink/40">Secure payment · SSL encrypted</p>
      <div className="rounded-xl border border-ink/10 p-4">
        <div className="flex justify-between">
          <span>Cut + Blowout</span>
          <span className="font-mono">₪180</span>
        </div>
        <div className="mt-2 flex justify-between text-coral">
          <span>Deposit required</span>
          <span className="font-mono">₪50</span>
        </div>
      </div>
      <button className="w-full rounded-full bg-coral py-3 text-center text-sm font-medium text-white mirror-shine">
        Pay ₪50 deposit
      </button>
    </div>
  );
}

const mocks = [CalendarMock, BookingMock, ReminderMock, PaymentMock];

export function ProductShowcase() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);

  useEffect(() => {
    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReduced || !sectionRef.current) return;

    const st = ScrollTrigger.create({
      trigger: sectionRef.current,
      start: "top top",
      end: `+=${panels.length * 500}`,
      pin: true,
      scrub: 0.4,
      onUpdate: (self) => {
        const idx = Math.min(panels.length - 1, Math.floor(self.progress * panels.length));
        setActive(idx);
      },
    });

    return () => st.kill();
  }, []);

  const Mock = mocks[active];

  return (
    <section ref={sectionRef} className="relative overflow-hidden py-24">
      <div className="mx-auto flex h-[min(80vh,700px)] max-w-6xl flex-col justify-center px-6">
        <div className="mb-10">
          <span className="text-xs font-medium uppercase tracking-widest text-gold">The product</span>
          <h2 className="mt-3 font-display text-3xl font-semibold tracking-tight sm:text-4xl">
            See how <span className="font-accent-italic">Sefa works</span>
          </h2>
        </div>

        <div className="grid gap-10 lg:grid-cols-2 lg:gap-16">
          <div>
            <div className="mb-8 flex gap-6 border-b border-ink/10">
              {panels.map((p, i) => (
                <button
                  key={p.key}
                  onClick={() => setActive(i)}
                  className={`relative pb-3 text-sm font-medium transition-colors ${
                    active === i ? "text-ink" : "text-ink/35"
                  }`}
                >
                  {p.label}
                  {active === i && (
                    <motion.span layoutId="tab-underline" className="absolute -bottom-px left-0 right-0 h-0.5 bg-coral" />
                  )}
                </button>
              ))}
            </div>

            <AnimatePresence mode="wait">
              <motion.div
                key={panels[active].key}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
              >
                <h3 className="font-display text-2xl font-semibold">{panels[active].title}</h3>
                <p className="mt-3 text-ink/60">{panels[active].body}</p>
                <ul className="mt-5 space-y-2">
                  {panels[active].points.map((pt) => (
                    <li key={pt} className="flex items-center gap-2 text-sm text-ink/70">
                      <span className="h-1 w-1 rounded-full bg-teal" /> {pt}
                    </li>
                  ))}
                </ul>
              </motion.div>
            </AnimatePresence>
          </div>

          <div className="glass flex min-h-[320px] items-center rounded-ticket p-8 shadow-glass-lg">
            <AnimatePresence mode="wait">
              <motion.div
                key={panels[active].key}
                initial={{ opacity: 0, scale: 0.97 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.97 }}
                transition={{ duration: 0.35 }}
                className="w-full"
              >
                <Mock />
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
}
