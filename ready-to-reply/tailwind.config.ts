import type { Config } from "tailwindcss";

/**
 * Palette tirée de la plaquette Ready to Reply (septembre 2026) :
 * crème chaud, terracotta, brun très foncé, blanc cassé, et deux accents
 * sobres (sauge pour « prêt / allez-y », ocre pour « à étudier »).
 * Utiliser ces noms sémantiques plutôt que des valeurs hexadécimales brutes.
 */
const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./content/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        cream: "#F7EEE5", // fond principal
        ivory: "#FFFCF7", // cartes, surfaces
        sand: "#EFE2D4", // fonds secondaires
        line: "#E2D2C1", // filets et bordures
        tan: "#E6C9AB", // jambage du logo sur fond clair
        terracotta: {
          DEFAULT: "#BC542F", // couleur de marque (fonds, grands titres)
          bright: "#D05E2C", // logo sur fond clair
          deep: "#9A3F1E", // texte terracotta sur fond clair (contraste AA)
          soft: "#F3DCCD", // surlignages
        },
        ink: {
          DEFAULT: "#2B1E18", // brun très foncé : texte, fonds sombres
          soft: "#5A463C", // texte courant secondaire
          muted: "#6F5A4E", // mentions, légendes (≥ 4.5:1 sur crème)
        },
        sage: { DEFAULT: "#33653F", soft: "#DCE9DD" },
        ochre: { DEFAULT: "#7A5810", soft: "#F4E6C4" },
      },
      fontFamily: {
        serif: ["var(--font-serif)", "Georgia", "serif"],
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
      },
      maxWidth: { content: "72rem" },
      boxShadow: {
        card: "0 1px 2px rgba(43,30,24,0.04), 0 12px 32px -12px rgba(43,30,24,0.18)",
        float: "0 2px 4px rgba(43,30,24,0.06), 0 24px 48px -16px rgba(43,30,24,0.28)",
      },
      keyframes: {
        rise: {
          from: { opacity: "0", transform: "translateY(12px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        grow: { from: { transform: "scaleX(0)" }, to: { transform: "scaleX(1)" } },
      },
      animation: {
        rise: "rise 0.6s cubic-bezier(0.2, 0.7, 0.2, 1) both",
        grow: "grow 0.7s cubic-bezier(0.2, 0.7, 0.2, 1) both",
      },
    },
  },
  plugins: [],
};

export default config;
