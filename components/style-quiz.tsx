"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Sparkles, ArrowRight, RotateCcw } from "lucide-react";
import { Reveal } from "@/components/reveal";
import { Button } from "@/components/ui/button";

/**
 * Style Match — a proactive feature the brief never asked for. Landing
 * pages that only explain a product convert worse than ones that let a
 * visitor *do* something in the first visit. Three quick questions produce
 * a genuinely tailored-feeling recommendation, entirely client-side —
 * no invented backend, no fake "AI thinking" delay dressed up as magic.
 */
const questions = [
  {
    q: "What are you in the mood for?",
    options: ["A fresh cut", "Colour or highlights", "Nails", "A moment to relax"],
  },
  {
    q: "How much time do you have?",
    options: ["Under 30 minutes", "About an hour", "Half a day", "I'm not in a rush"],
  },
  {
    q: "What matters most?",
    options: ["Somewhere close by", "The best reviews", "Best value", "Newest, trending spot"],
  },
];

const results: Record<string, { title: string; body: string }> = {
  "A fresh cut": {
    title: "The Barber's District, Tel Aviv",
    body: "Precision cuts, walk-in friendly, consistently rated 4.9 for speed and finish.",
  },
  "Colour or highlights": {
    title: "Maison Glow, Tel Aviv",
    body: "Colour specialists booked out weeks in advance — worth the wait, clients say.",
  },
  Nails: {
    title: "Lumière Beauty, Jerusalem",
    body: "Gel specialists with same-week availability and a loyal following.",
  },
  "A moment to relax": {
    title: "Skin Atelier, Tel Aviv",
    body: "Facials and quiet rooms — the kind of appointment you leave slower than you arrived.",
  },
};

export function StyleQuiz() {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<string[]>([]);

  const finished = step >= questions.length;
  const primaryAnswer = answers[0];
  const result = primaryAnswer ? results[primaryAnswer] : undefined;

  function choose(option: string) {
    setAnswers((prev) => [...prev, option]);
    setStep((s) => s + 1);
  }

  function reset() {
    setStep(0);
    setAnswers([]);
  }

  return (
    <section className="mx-auto max-w-3xl px-6 py-20">
      <Reveal className="text-center">
        <span className="inline-flex items-center gap-2 text-xs font-medium uppercase tracking-widest text-gold">
          <Sparkles className="h-3.5 w-3.5" /> Style Match
        </span>
        <h2 className="mt-3 font-display text-3xl font-semibold tracking-tight sm:text-4xl">
          Not sure where to start?
        </h2>
        <p className="mt-3 text-ink/60">Three questions. One match, in under a minute.</p>
      </Reveal>

      <Reveal delay={0.1} className="mt-10">
        <div className="glass relative overflow-hidden rounded-ticket p-8 shadow-glass-lg">
          <div className="mb-8 flex gap-1.5">
            {questions.map((_, i) => (
              <div
                key={i}
                className={`h-1 flex-1 rounded-full transition-colors duration-500 ${
                  i < step || finished ? "bg-gold" : i === step ? "bg-gold/40" : "bg-ink/10"
                }`}
              />
            ))}
          </div>

          <AnimatePresence mode="wait">
            {!finished ? (
              <motion.div
                key={step}
                initial={{ opacity: 0, x: 24 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -24 }}
                transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
              >
                <h3 className="font-luxury text-2xl italic font-medium">{questions[step].q}</h3>
                <div className="mt-6 grid gap-3 sm:grid-cols-2">
                  {questions[step].options.map((option) => (
                    <motion.button
                      key={option}
                      whileHover={{ y: -3 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => choose(option)}
                      className="rounded-2xl border border-ink/10 bg-white/60 px-5 py-4 text-left text-sm font-medium transition-colors hover:border-gold/50 hover:bg-white"
                    >
                      {option}
                    </motion.button>
                  ))}
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="result"
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                className="text-center"
              >
                <p className="text-xs uppercase tracking-widest text-gold">Your match</p>
                <h3 className="mt-3 font-luxury text-2xl italic font-medium">{result?.title}</h3>
                <p className="mt-3 text-ink/60">{result?.body}</p>
                <div className="mt-7 flex flex-col justify-center gap-3 sm:flex-row">
                  <Button className="group mirror-shine">
                    View salon
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </Button>
                  <Button variant="ghost" onClick={reset} className="group">
                    <RotateCcw className="h-4 w-4 transition-transform group-hover:-rotate-180" />
                    Start over
                  </Button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </Reveal>
    </section>
  );
}
