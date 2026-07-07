import { cn } from "@/lib/utils";

/**
 * The SEFA wordmark, rebuilt as a two-typeface signature:
 * "Se" in Playfair Display italic (editorial luxury, beauty-world serif)
 * fused directly into "FA" in Space Grotesk (geometric, technological).
 * A single gold diamond floats above the seam where the two typefaces
 * meet — the wordmark's only accent colour, marking the join between
 * beauty and technology rather than decorating a letter.
 */
export function Logo({
  className,
  dark = false,
}: {
  className?: string;
  dark?: boolean;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-baseline gap-[1px] select-none",
        className
      )}
      aria-label="Sefa"
    >
      <span className="font-luxury text-[1.15em] italic font-medium tracking-tight">
        Se
      </span>
      <span className="relative font-display text-[1em] font-semibold tracking-tight">
        <svg
          viewBox="0 0 10 10"
          className="absolute -top-[0.7em] left-1/2 -translate-x-1/2 h-[0.22em] w-[0.22em] animate-diamond-glint"
          aria-hidden="true"
        >
          <rect
            x="1"
            y="1"
            width="8"
            height="8"
            rx="1.5"
            transform="rotate(45 5 5)"
            fill={dark ? "#D4B87B" : "#B79355"}
          />
        </svg>
        FA
      </span>
    </span>
  );
}
