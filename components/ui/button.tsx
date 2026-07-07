import * as React from "react";
import { cn } from "@/lib/utils";

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "dark" | "ghost" | "outline";
  size?: "sm" | "md" | "lg";
};

const variants: Record<NonNullable<ButtonProps["variant"]>, string> = {
  primary: "bg-coral text-white hover:bg-coral-dim hover:shadow-gold hover:-translate-y-0.5",
  dark: "bg-ink text-paper hover:bg-ink-soft hover:shadow-gold hover:-translate-y-0.5",
  ghost: "bg-transparent text-ink hover:bg-ink/5",
  outline: "bg-transparent text-ink border border-ink/15 hover:border-gold/50 hover:-translate-y-0.5",
};

const sizes: Record<NonNullable<ButtonProps["size"]>, string> = {
  sm: "text-sm px-4 py-2",
  md: "text-[15px] px-5 py-3",
  lg: "text-base px-7 py-4",
};

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", size = "md", ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          "inline-flex items-center justify-center gap-2 rounded-full font-display font-medium tracking-tight transition-all duration-300 ease-out active:scale-[0.97] disabled:opacity-40 disabled:pointer-events-none",
          variants[variant],
          sizes[size],
          className
        )}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";
