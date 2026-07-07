import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        // Warm cream — the salon's marble vanity top, not a generic AI cream
        paper: "#F6EFE4",
        beige: "#EDE1CE",
        // Deep noir — never pure black, always a hair warm
        ink: "#17140F",
        "ink-soft": "#2C271E",
        night: "#100D09",
        "night-soft": "#1B160F",
        // Rosewood — replaces the old vivid coral with a muted lipstick tone
        coral: {
          DEFAULT: "#A6584A",
          dim: "#8B4438",
        },
        // Slate blue-grey — the "technology / Israel sky at dusk" accent
        teal: {
          DEFAULT: "#5C6A74",
          deep: "#454F57",
        },
        // Subtle warm gold — metallic, never neon
        gold: {
          DEFAULT: "#B79355",
          light: "#D4B87B",
        },
        pearl: "#FFFBF3",
      },
      fontFamily: {
        // "FA" half of the wordmark + UI labels — modern, geometric, tech
        display: ["var(--font-display)"],
        body: ["var(--font-body)"],
        // "Se" half of the wordmark + hero headlines — editorial luxury serif
        luxury: ["var(--font-luxury)"],
        accent: ["var(--font-accent)"],
        mono: ["var(--font-mono)"],
      },
      borderRadius: {
        porthole: "50%",
        ticket: "1.75rem",
      },
      boxShadow: {
        glass: "0 8px 40px -8px rgba(23, 20, 15, 0.25)",
        "glass-lg": "0 30px 90px -20px rgba(23, 20, 15, 0.4)",
        gold: "0 0 0 1px rgba(183,147,85,0.35), 0 8px 30px -8px rgba(183,147,85,0.35)",
      },
      keyframes: {
        marquee: {
          "0%": { transform: "translateX(0)" },
          "100%": { transform: "translateX(-50%)" },
        },
        "pulse-ring": {
          "0%": { transform: "scale(0.9)", opacity: "0.6" },
          "100%": { transform: "scale(1.6)", opacity: "0" },
        },
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0px) rotate(0deg)" },
          "50%": { transform: "translateY(-16px) rotate(1.5deg)" },
        },
        "float-slow": {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-10px)" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
      },
      animation: {
        marquee: "marquee 28s linear infinite",
        "pulse-ring": "pulse-ring 2.4s cubic-bezier(0.4,0,0.6,1) infinite",
        "accordion-down": "accordion-down 0.25s ease-out",
        "accordion-up": "accordion-up 0.25s ease-out",
        float: "float 7s ease-in-out infinite",
        "float-slow": "float-slow 9s ease-in-out infinite",
        shimmer: "shimmer 3.5s linear infinite",
      },
    },
  },
  plugins: [],
};

export default config;
