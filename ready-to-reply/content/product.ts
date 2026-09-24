import type { FeatureStatus } from "@/components/labels";

/**
 * État réel du produit (septembre 2026) : seule la veille BOAMP (/veille)
 * est utilisable, en version de test. Les autres fonctions ne sont montrées
 * que dans la démonstration, sur un marché fictif. Mettre à jour les statuts à
 * mesure que les fonctions sont réellement livrées — jamais avant.
 */
export const productStatus = {
  summary:
    "Ready to Reply est en construction. Une première brique est utilisable en version de test : la veille des avis du BOAMP, triés et notés selon votre profil. Les autres fonctions sont en conception ; la démonstration de ce site les montre sur un marché fictif.",
};

export const steps = [
  {
    n: "01",
    title: "Trouver",
    short: "Recevoir uniquement les appels d'offres de son métier, de sa zone et de sa taille.",
    long: "Les annonces sont publiées sur de nombreuses plateformes. Ready to Reply veut les rassembler et ne garder que celles qui correspondent à votre entreprise : votre métier, les départements où vous intervenez, des montants à votre portée.",
    example:
      "Un distributeur d'éclairage lyonnais reçoit chaque semaine une courte sélection : éclairage LED d'un gymnase, maintenance de l'éclairage public, luminaires pour des écoles.",
    status: "test" as FeatureStatus,
  },
  {
    n: "02",
    title: "Comprendre",
    short: "Une fiche d'une page : ce qui est demandé, la date limite, les pièges, et un avis clair.",
    long: "Pour chaque marché retenu, une fiche de synthèse résume le dossier de consultation : l'objet, le montant, les critères de notation, les dates à ne pas manquer, les pièces exigées et les clauses à risque, avec une note d'affinité et un avis (« allez-y », « à étudier », « passez »).",
    example:
      "Pour le gymnase : visite obligatoire dans 6 jours, variantes interdites, valeur technique à 60 %. Score d'affinité 82/100.",
    status: "v1" as FeatureStatus,
  },
  {
    n: "03",
    title: "Préparer",
    short: "Pièces réutilisées depuis le coffre-fort, prix situés dans une fourchette, dossier mis en page.",
    long: "Les pièces administratives saisies une fois sont réutilisées, les formulaires de candidature pré-remplis, et le dossier mis en page dans l'ordre des critères de l'acheteur. Vous relisez, ajustez, validez et signez.",
    example:
      "Kbis, attestations et assurances sont déjà prêts ; l'attestation URSSAF, qui expire bientôt, est signalée. Reste à rédiger le mémoire technique et à remplir le bordereau de prix.",
    status: "v1" as FeatureStatus,
  },
  {
    n: "04",
    title: "Suivre",
    short: "Chaque candidature suivie jusqu'au résultat, avec des alertes par e-mail.",
    long: "Un tableau de bord réunit vos candidatures en cours, leurs échéances et leurs résultats. Chaque résultat, gagné ou perdu, sert ensuite à affiner les notes et les repères de prix.",
    example: "Le gymnase passe de « déposé » à « attribué » lorsque l'avis d'attribution est publié.",
    status: "later" as FeatureStatus,
  },
];

export const features: {
  title: string;
  description: string;
  detail: string;
  status: FeatureStatus;
  /** Montré, sous forme de maquette, dans la démonstration interactive. */
  inDemo?: boolean;
  /** Lien vers la fonction utilisable, quand elle existe. */
  tryHref?: string;
}[] = [
  {
    title: "Veille et filtrage des appels d'offres",
    description: "Les annonces de votre métier, de votre zone et de votre taille, rassemblées au même endroit.",
    detail:
      "Sources envisagées : les avis publiés au BOAMP (bulletin officiel des annonces des marchés publics) et, pour l'Europe, TED (le journal des marchés européens). La couverture des autres plateformes reste à étudier.",
    tryHref: "/veille",
    status: "test",
  },
  {
    title: "Fiche de synthèse",
    description: "Une consultation de plusieurs dizaines de pages résumée en une page claire.",
    detail: "Objet, acheteur, montant, durée, critères de notation, dates clés.",
    status: "v1",
    inDemo: true,
  },
  {
    title: "Points de vigilance",
    description: "Les clauses qui peuvent faire écarter une offre, signalées en clair.",
    detail: "Visite obligatoire, variantes interdites, pièces exigées, pénalités. La lecture du règlement complet reste indispensable.",
    status: "v1",
    inDemo: true,
  },
  {
    title: "Score d'affinité",
    description: "Une note sur 100 calculée pour votre entreprise, et un avis franc.",
    detail:
      "La note aide à trier les marchés ; elle ne garantit ni la pertinence d'une candidature, ni son succès. Une version simple (mots-clés, type, montant, délai) est utilisable dans la veille de test ; la version complète sera construite avec les entreprises pilotes.",
    status: "v1",
    inDemo: true,
  },
  {
    title: "Coffre-fort documentaire et alertes d'expiration",
    description: "Kbis, attestations, assurances : saisis une fois, réutilisés partout.",
    detail: "Avec une alerte avant l'expiration d'une pièce. Les conditions d'hébergement et de sécurité des documents seront précisées avant toute ouverture.",
    status: "v1",
    inDemo: true,
  },
  {
    title: "Préparation de dossier",
    description: "Formulaires pré-remplis, bordereau de prix, dossier mis en page dans l'ordre des critères.",
    detail: "Vous relisez, modifiez, validez, signez et déposez vous-même votre offre sur la plateforme de l'acheteur.",
    status: "v1",
  },
  {
    title: "Fourchette de prix indicative",
    description: "Un ordre de prix tiré de marchés comparables déjà attribués.",
    detail: "Fonction à l'étude : sa fiabilité dépendra des données d'attribution disponibles pour chaque métier.",
    status: "later",
    inDemo: true,
  },
  {
    title: "Suivi des candidatures",
    description: "Chaque candidature suivie jusqu'au résultat, avec des alertes par e-mail.",
    detail: "Prévu après la première version, une fois le parcours de préparation éprouvé par les pilotes.",
    status: "later",
  },
];

/** Feuille de route, reprise de la plaquette (hypothèses de travail). */
export const roadmap = [
  { step: "Étape 1", title: "Construire la V1", detail: "Annonces filtrées, coffre-fort, fiche marché et préparation du dossier." },
  { step: "Étape 2", title: "Tester sur l'éclairage", detail: "Un premier métier bien connu, avec des PME pilotes et un gain de temps mesuré." },
  { step: "Étape 3", title: "Ouvrir à d'autres métiers", detail: "Travaux, fournitures et services, avec une offre pensée pour chaque profession." },
  { step: "Étape 4", title: "Passer la frontière", detail: "Belgique et Luxembourg d'abord, en s'appuyant sur les avis européens TED." },
];
