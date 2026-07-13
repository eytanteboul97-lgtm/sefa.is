"use client";

import { useState, type FormEvent } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Reveal } from "@/components/reveal";

export function WaitingList() {
  const [status, setStatus] = useState<"idle" | "submitting" | "done">("idle");
  const [assignedNumber, setAssignedNumber] = useState<string | null>(null);

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (status !== "idle") return;
    setStatus("submitting");
    window.setTimeout(() => {
      setAssignedNumber(String(Math.floor(Math.random() * 100) + 1).padStart(3, "0"));
      setStatus("done");
    }, 700);
  };

  return (
    <section id="waiting-list" className="naturel-grain bg-naturel-mist px-6 py-28">
      <div className="mx-auto max-w-md text-center">
        <Reveal>
          <span className="naturel-display text-[11px] uppercase tracking-[0.35em] text-naturel-ink/45">
            Private Access
          </span>
          <h2 className="naturel-serif mt-3 text-3xl text-naturel-ink sm:text-4xl">Join the waiting list.</h2>
          <p className="mt-3 text-sm text-naturel-ink/55">
            No checkout. No cart. Just a place in line, and a number that will be yours.
          </p>
        </Reveal>

        <div className="relative mt-10 min-h-[220px]">
          <AnimatePresence mode="wait">
            {status !== "done" ? (
              <motion.form
                key="form"
                initial={{ opacity: 1 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                onSubmit={handleSubmit}
                className="flex flex-col gap-4 text-left"
              >
                <label className="flex flex-col gap-1.5">
                  <span className="text-xs uppercase tracking-[0.2em] text-naturel-ink/50">Name</span>
                  <input
                    required
                    name="name"
                    type="text"
                    autoComplete="name"
                    className="border-b border-naturel-ink/20 bg-transparent py-2 text-naturel-ink outline-none transition-colors focus:border-naturel-gold"
                  />
                </label>
                <label className="flex flex-col gap-1.5">
                  <span className="text-xs uppercase tracking-[0.2em] text-naturel-ink/50">Email</span>
                  <input
                    required
                    name="email"
                    type="email"
                    autoComplete="email"
                    className="border-b border-naturel-ink/20 bg-transparent py-2 text-naturel-ink outline-none transition-colors focus:border-naturel-gold"
                  />
                </label>
                <button
                  type="submit"
                  disabled={status === "submitting"}
                  className="mt-4 border-b border-naturel-ink/40 pb-1 text-xs font-medium uppercase tracking-[0.3em] text-naturel-ink transition-colors hover:border-naturel-gold hover:text-naturel-gold disabled:opacity-50"
                >
                  {status === "submitting" ? "Joining…" : "Join the Waiting List"}
                </button>
              </motion.form>
            ) : (
              <motion.div
                key="confirm"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                className="flex flex-col items-center gap-3"
              >
                <span className="naturel-display text-xs tracking-[0.3em] text-naturel-gold">
                  {assignedNumber} / 100
                </span>
                <p className="naturel-serif text-2xl text-naturel-ink">You are now part of the story.</p>
                <p className="max-w-xs text-sm text-naturel-ink/55">
                  We'll write to you before anyone else, when your number is ready.
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
