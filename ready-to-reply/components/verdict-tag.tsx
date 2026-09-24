import { verdict } from "@/content/demo";
import { cn } from "@/lib/utils";

export function VerdictTag({ score, className }: { score: number; className?: string }) {
  const v = verdict(score);
  return (
    <span
      className={cn(
        "whitespace-nowrap text-[0.7rem] font-bold uppercase tracking-[0.12em]",
        v.tone === "go" && "text-terracotta-deep",
        v.tone === "maybe" && "text-ink",
        v.tone === "pass" && "text-ink-muted",
        className,
      )}
    >
      {v.label}
    </span>
  );
}
