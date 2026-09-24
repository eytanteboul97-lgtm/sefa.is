/**
 * Tarifs issus de la plaquette : ce sont des HYPOTHÈSES COMMERCIALES À CONFIRMER.
 * Aucun paiement n'est connecté. `founderOffer.enabled` doit rester à false
 * tant que l'offre fondateur n'est pas réellement configurée et confirmée.
 */
export const pricing = {
  monthly: { price: 149, label: "149 € HT", period: "par mois" },
  yearly: { price: 1490, label: "1 490 € HT", period: "par an" },
  founderOffer: {
    enabled: false,
    price: 99,
    label: "99 € HT",
    period: "par mois",
    seats: 100,
  },
};

/** Écart annuel entre 12 mensualités et la formule annuelle (calcul, pas une promotion). */
export const yearlyDifference = pricing.monthly.price * 12 - pricing.yearly.price;

export const included = [
  "Sélection des appels d'offres de votre métier et de votre zone",
  "Fiche d'une page par marché, avec points de vigilance",
  "Score d'affinité et avis sur chaque marché",
  "Coffre-fort documentaire avec alertes d'expiration",
  "Préparation du dossier, que vous validez et déposez",
];
