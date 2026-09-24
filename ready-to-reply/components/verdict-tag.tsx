import { verdict } from "@/content/demo";
import { cn } from "@/lib/utils";

/**
 * Lecture des notes d'affinité, pensée pour être comprise sans explication :
 * vert = allez-y, ocre = à étudier, gris = passez, toujours avec « /100 ».
 */
export type Tone = "go" | "maybe" | "pass";

export const toneLabel: Record<Tone, string> = { go: "Allez-y", maybe: "À étudier", pass: "Passez" };

export const tonePhrase: Record<Tone, string> = {
  go: "Très bon match avec votre profil : à regarder en priorité.",
  maybe: "Correspond en partie : lisez l'avis avant de décider.",
  pass: "Peu adapté à votre profil.",
};

export const tonePill: Record<Tone, string> = {
  go: "bg-sage-soft text-sage",
  maybe: "bg-ochre-soft text-ochre",
  pass: "bg-sand text-ink-soft",
};

export const toneBox: Record<Tone, string> = {
  go: "bg-sage text-ivory",
  maybe: "bg-ochre-soft text-ink",
  pass: "bg-sand text-ink",
};

export const toneBar: Record<Tone, string> = { go: "bg-sage", maybe: "bg-[#B98A2E]", pass: "bg-[#A8998E]" };

export function VerdictPill({ tone, children, className }: { tone: Tone; children?: React.ReactNode; className?: string }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 whitespace-nowrap rounded-full px-2.5 py-0.5 text-xs font-bold",
        tonePill[tone],
        className,
      )}
    >
      <span aria-hidden="true" className="h-1.5 w-1.5 rounded-full bg-current" />
      {children ?? toneLabel[tone]}
    </span>
  );
}

export function VerdictTag({ score, className }: { score: number; className?: string }) {
  return <VerdictPill tone={verdict(score).tone} className={className} />;
}

/** Rappel des seuils, à placer près de toute liste de notes. */
export function AffinityScale({ className }: { className?: string }) {
  return (
    <span className={cn("inline-flex flex-wrap gap-2", className)}>
      <VerdictPill tone="go">80–100 · Allez-y</VerdictPill>
      <VerdictPill tone="maybe">60–79 · À étudier</VerdictPill>
      <VerdictPill tone="pass">0–59 · Passez</VerdictPill>
    </span>
  );
}
