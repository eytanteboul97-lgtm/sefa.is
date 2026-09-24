/**
 * Données de la démonstration interactive.
 * TOUT est fictif : acheteur, montants, dates, documents et notes.
 * Aucune donnée réelle d'entreprise ne doit être ajoutée ici.
 */

export const consultation = {
  title: "Éclairage LED d'un gymnase municipal",
  buyer: "Une commune d'environ 12 000 habitants (acheteur fictif)",
  procedure: "Procédure adaptée",
  procedureHelp:
    "Procédure plus souple que l'appel d'offres formel, utilisée par l'acheteur en dessous de certains seuils de montant.",
  object:
    "Dépose des anciens projecteurs et fourniture-pose de luminaires LED dans la grande salle et les vestiaires, avec pilotage de l'éclairage.",
  amount: "45 000 € HT estimés",
  duration: "3 mois d'exécution",
  lots: "Lot unique",
  criteria: [
    { label: "Valeur technique", weight: 60 },
    { label: "Prix", weight: 40 },
  ],
};

export type DocState = "ready" | "expiring" | "todo";

export const documents: { name: string; help: string; state: DocState; note: string }[] = [
  { name: "Kbis", help: "Extrait d'immatriculation de l'entreprise.", state: "ready", note: "À jour" },
  {
    name: "Attestation URSSAF",
    help: "Attestation de vigilance : preuve que les cotisations sociales sont à jour.",
    state: "expiring",
    note: "Expire dans 12 jours, avant la date limite",
  },
  { name: "Attestation fiscale", help: "Preuve que l'entreprise est à jour de ses impôts.", state: "ready", note: "À jour" },
  { name: "Assurances", help: "Responsabilité civile professionnelle et décennale.", state: "ready", note: "À jour" },
  { name: "Chiffre d'affaires", help: "Chiffres des trois derniers exercices.", state: "ready", note: "À jour" },
  {
    name: "DC1 · DC2",
    help: "Formulaires de candidature et de présentation de l'entreprise.",
    state: "ready",
    note: "Pré-remplis, à relire",
  },
  {
    name: "Références similaires",
    help: "Chantiers comparables réalisés ces dernières années.",
    state: "ready",
    note: "3 références sélectionnées",
  },
];

export const toProduce: { name: string; help: string }[] = [
  { name: "Mémoire technique", help: "Le document qui explique comment vous allez réaliser le chantier. Il compte ici pour 60 % de la note." },
  { name: "Fiches techniques des luminaires", help: "Exigées par le règlement pour chaque modèle proposé." },
  { name: "Bordereau de prix", help: "Le tableau de prix de l'acheteur, à remplir ligne par ligne." },
  { name: "Attestation de visite", help: "Remise lors de la visite obligatoire du site." },
];

/** Dates exprimées par rapport à « aujourd'hui » pour que l'exemple ne se périme pas. */
export const timeline: { day: number; label: string; detail: string; key?: boolean }[] = [
  { day: -12, label: "Publication de l'avis", detail: "L'annonce paraît sur la plateforme de l'acheteur." },
  { day: 0, label: "Aujourd'hui", detail: "Vous découvrez le marché dans votre sélection de la semaine." },
  { day: 6, label: "Visite obligatoire du gymnase", detail: "Sur rendez-vous. Sans attestation de visite, l'offre peut être écartée.", key: true },
  { day: 8, label: "Dernier jour pour poser vos questions", detail: "Questions écrites, via la plateforme de l'acheteur." },
  { day: 18, label: "Date limite de remise des offres", detail: "À 12 h. Aucun dépôt n'est accepté après l'heure limite.", key: true },
];

export const vigilance: { title: string; detail: string }[] = [
  {
    title: "Visite du site obligatoire",
    detail: "Elle a lieu dans 6 jours. À planifier tout de suite : l'attestation de visite fait partie du dossier.",
  },
  {
    title: "Variantes interdites",
    detail: "Impossible de proposer une autre solution technique que celle décrite par l'acheteur.",
  },
  {
    title: "Fiches techniques exigées",
    detail: "Une fiche par modèle de luminaire proposé. Un oubli peut rendre l'offre incomplète.",
  },
  {
    title: "Valeur technique à 60 %",
    detail: "La qualité du mémoire technique pèse plus que le prix : un dossier soigné compte.",
  },
  {
    title: "Attestation URSSAF bientôt expirée",
    detail: "Elle expire avant la date limite : à renouveler avant le dépôt.",
  },
];

export type Profile = {
  id: string;
  name: string;
  summary: string;
  scores: number[];
  reasons: string[];
};

export const scoreCriteria = [
  "Adéquation au métier",
  "Capacité financière",
  "Références similaires",
  "Zone et logistique",
  "Cohérence avec vos ambitions",
];

export const profiles: Profile[] = [
  {
    id: "distributeur",
    name: "Distributeur d'éclairage",
    summary: "Références sur des équipements sportifs, taille adaptée au montant.",
    scores: [95, 80, 85, 70, 78],
    reasons: [
      "Vos références correspondent au cahier des charges.",
      "Montant adapté à votre chiffre d'affaires.",
      "Valeur technique à 60 % : un dossier soigné compte.",
    ],
  },
  {
    id: "electricien",
    name: "Électricien généraliste",
    summary: "Pas de référence comparable, chantier hors de sa zone habituelle.",
    scores: [70, 60, 10, 25, 40],
    reasons: [
      "Métier compatible, mais aucune référence similaire.",
      "Chantier situé hors de votre zone d'intervention.",
      "Peu cohérent avec les marchés que vous visez.",
    ],
  },
];

export function verdict(score: number) {
  if (score >= 80) return { label: "Allez-y", tone: "go" as const };
  if (score >= 60) return { label: "À étudier", tone: "maybe" as const };
  return { label: "Passez", tone: "pass" as const };
}

export const priceRange = { low: 38000, high: 47000, min: 30000, max: 55000, example: 42016 };

export const weeklyMarkets = [
  { score: 82, title: "Éclairage LED — gymnase municipal" },
  { score: 74, title: "Maintenance éclairage public" },
  { score: 68, title: "Luminaires LED — écoles" },
  { score: 38, title: "Travaux électriques — hôpital" },
];
