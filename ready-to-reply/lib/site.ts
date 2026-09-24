/**
 * Configuration centrale du site.
 *
 * Les champs à `null` sont des informations que le fondateur doit fournir :
 * ils s'affichent sur le site comme des champs « à compléter » (voir
 * `Placeholder` dans `components/labels.tsx`) et ne doivent jamais être inventés.
 */
export const site = {
  name: "Ready to Reply",
  tagline: "Les bons marchés. Les bonnes réponses.",
  subTagline: "Du premier repérage au dossier prêt à déposer.",
  brandLine: "From opportunity to submission.",
  description:
    "Ready to Reply aide les TPE et PME à repérer les appels d'offres faits pour elles et à préparer leur dossier plus simplement. Projet en construction : phase pilote en préparation avec des entreprises de l'électricité et de l'éclairage.",
  /** URL publique du site, sans barre finale. Définie par NEXT_PUBLIC_SITE_URL. */
  url: (process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000").replace(/\/$/, ""),
  locale: "fr_FR",
} as const;

export const founder = {
  firstName: "Eytan",
  lastName: "Teboul" as string | null,
  role: "Fondateur de Ready to Reply",
};

/** Coordonnées et informations légales : toutes à compléter avant mise en ligne. */
export const contact = {
  email: null as string | null,
  phone: null as string | null,
};

export const legal = {
  companyName: null as string | null,
  legalForm: null as string | null,
  address: null as string | null,
  siren: null as string | null,
  publicationDirector: null as string | null,
  host: null as string | null,
};

/** Réseaux sociaux : n'en ajouter que s'ils existent réellement. */
export const socials: { label: string; href: string }[] = [];

export const nav = [
  { href: "/comment-ca-marche", label: "Comment ça marche" },
  { href: "/produit", label: "Le produit" },
  { href: "/tarifs", label: "Tarifs" },
  { href: "/a-propos", label: "À propos" },
  { href: "/veille", label: "Veille (test)" },
] as const;

/**
 * Action principale. Seule la veille est utilisable (version de test) :
 * l'action cohérente est de rejoindre la phase pilote (ou demander un échange).
 */
export const primaryCta = { href: "/contact", label: "Rejoindre le pilote" } as const;
export const demoCta = { href: "/#demo", label: "Voir la démonstration" } as const;

export function founderDisplayName() {
  return founder.lastName ? `${founder.firstName} ${founder.lastName}` : founder.firstName;
}
