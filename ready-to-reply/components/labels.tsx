import { cn } from "@/lib/utils";

/**
 * Mentions de transparence. Toute maquette ou donnée d'exemple doit porter
 * l'une d'elles, de façon visible (pas seulement pour les lecteurs d'écran).
 */
export function MockupLabel({ className, tone = "light" }: { className?: string; tone?: "light" | "dark" }) {
  return (
    <p
      className={cn(
        "inline-flex items-baseline gap-2 text-xs font-medium",
        tone === "light" ? "text-ink-muted" : "text-tan",
        className,
      )}
    >
      <span aria-hidden="true" className="h-1.5 w-1.5 shrink-0 translate-y-[-1px] rounded-full bg-current" />
      <span>Aperçu du produit — maquette illustrative · données fictives</span>
    </p>
  );
}

export function FictionalLabel({ className }: { className?: string }) {
  return (
    <p
      className={cn(
        "inline-flex items-center gap-2 rounded-full border border-ochre/30 bg-ochre-soft px-3 py-1 text-xs font-semibold text-ochre",
        className,
      )}
    >
      <span aria-hidden="true">◆</span>
      Exemple fictif — données illustratives
    </p>
  );
}

export type FeatureStatus = "test" | "demo" | "v1" | "later";

export const statusLabels: Record<FeatureStatus, string> = {
  test: "Version de test disponible",
  demo: "Démonstration sur ce site",
  v1: "En conception · V1",
  later: "Envisagé · après la V1",
};

export function StatusBadge({ status, className }: { status: FeatureStatus; className?: string }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 whitespace-nowrap rounded-full px-2.5 py-1 text-xs font-semibold",
        (status === "demo" || status === "test") && "bg-sage-soft text-sage",
        status === "v1" && "bg-terracotta-soft text-terracotta-deep",
        status === "later" && "bg-sand text-ink-soft",
        className,
      )}
    >
      <span aria-hidden="true" className="h-1.5 w-1.5 rounded-full bg-current" />
      {statusLabels[status]}
    </span>
  );
}

/** Champ que le fondateur doit compléter : visible, jamais inventé. */
export function Placeholder({ children }: { children: React.ReactNode }) {
  return (
    <span className="rounded border border-dashed border-terracotta/60 bg-terracotta-soft/50 px-1.5 py-0.5 font-sans text-[0.9em] text-terracotta-deep">
      [{children}]
    </span>
  );
}
