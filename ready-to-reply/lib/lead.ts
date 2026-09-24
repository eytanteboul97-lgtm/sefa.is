/**
 * Schéma du formulaire « Rejoindre le pilote / demander une démonstration ».
 * Validation partagée entre le navigateur (retour immédiat) et la route
 * serveur `app/api/contact/route.ts` (seule validation qui fait foi).
 */

export const requestTypes = [
  { value: "pilote", label: "Rejoindre la phase pilote" },
  { value: "demo", label: "Demander une démonstration" },
  { value: "rappel", label: "Être recontacté" },
] as const;

export const trades = [
  { value: "distribution-eclairage", label: "Distribution de matériel électrique ou d'éclairage" },
  { value: "installation-electricite", label: "Installation / entreprise d'électricité" },
  { value: "eclairage-public", label: "Éclairage public, maintenance" },
  { value: "autre-btp", label: "Autre métier des travaux" },
  { value: "fournitures-services", label: "Fournitures ou services" },
  { value: "autre", label: "Autre" },
] as const;

export const companySizes = [
  { value: "", label: "Je préfère ne pas répondre" },
  { value: "1-9", label: "1 à 9 salariés" },
  { value: "10-49", label: "10 à 49 salariés" },
  { value: "50-249", label: "50 à 249 salariés" },
  { value: "250+", label: "250 salariés ou plus" },
] as const;

export const needs = [
  { value: "reperer", label: "Repérer les appels d'offres adaptés" },
  { value: "comprendre", label: "Comprendre plus vite les consultations" },
  { value: "preparer", label: "Préparer les dossiers et les pièces" },
  { value: "suivre", label: "Suivre les candidatures" },
  { value: "decouvrir", label: "Je découvre, je veux en savoir plus" },
] as const;

type Values<T extends readonly { value: string }[]> = T[number]["value"];

export type Lead = {
  requestType: Values<typeof requestTypes>;
  fullName: string;
  email: string;
  company: string;
  trade: Values<typeof trades>;
  companySize: Values<typeof companySizes>;
  need: Values<typeof needs>;
  message: string;
  consent: boolean;
};

export type LeadErrors = Partial<Record<keyof Lead, string>>;

const LIMITS = { fullName: 120, email: 200, company: 160, message: 1500 } as const;

// Volontairement simple : on refuse les erreurs évidentes, sans exclure
// d'adresses valides mais inhabituelles.
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

const oneOf = <T extends readonly { value: string }[]>(list: T, v: unknown): v is Values<T> =>
  typeof v === "string" && list.some((o) => o.value === v);

const str = (v: unknown) => (typeof v === "string" ? v.trim() : "");

/** Valide et normalise une saisie brute. Renvoie soit les données, soit les erreurs. */
export function validateLead(
  input: Record<string, unknown>,
): { ok: true; data: Lead } | { ok: false; errors: LeadErrors } {
  const errors: LeadErrors = {};

  const fullName = str(input.fullName);
  const email = str(input.email).toLowerCase();
  const company = str(input.company);
  const message = str(input.message);

  if (!oneOf(requestTypes, input.requestType)) errors.requestType = "Choisissez le type de demande.";

  if (fullName.length < 2) errors.fullName = "Indiquez votre prénom et votre nom.";
  else if (fullName.length > LIMITS.fullName) errors.fullName = "Ce champ est trop long.";

  if (!email) errors.email = "Indiquez votre adresse e-mail professionnelle.";
  else if (email.length > LIMITS.email || !EMAIL_RE.test(email))
    errors.email = "Cette adresse e-mail ne semble pas valide (exemple : prenom@entreprise.fr).";

  if (company.length < 2) errors.company = "Indiquez le nom de votre entreprise.";
  else if (company.length > LIMITS.company) errors.company = "Ce champ est trop long.";

  if (!oneOf(trades, input.trade)) errors.trade = "Choisissez le métier le plus proche du vôtre.";

  const companySize = input.companySize ?? "";
  if (!oneOf(companySizes, companySize)) errors.companySize = "Choisissez une taille dans la liste.";

  if (!oneOf(needs, input.need)) errors.need = "Choisissez votre besoin principal.";

  if (message.length > LIMITS.message)
    errors.message = `Votre message dépasse ${LIMITS.message} caractères.`;

  if (input.consent !== true && input.consent !== "on")
    errors.consent = "Votre accord est nécessaire pour que nous puissions traiter votre demande.";

  if (Object.keys(errors).length > 0) return { ok: false, errors };

  return {
    ok: true,
    data: {
      requestType: input.requestType as Lead["requestType"],
      fullName,
      email,
      company,
      trade: input.trade as Lead["trade"],
      companySize: companySize as Lead["companySize"],
      need: input.need as Lead["need"],
      message,
      consent: true,
    },
  };
}

/** Réponses possibles de l'API, partagées avec le formulaire. */
export type LeadApiResponse =
  | { status: "sent" }
  | { status: "dev-logged" }
  | { status: "invalid"; errors: LeadErrors }
  | { status: "not-configured" }
  | { status: "rate-limited" }
  | { status: "error" };
