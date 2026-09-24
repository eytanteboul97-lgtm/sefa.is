# Ready to Reply — site de présentation

Site de présentation de **Ready to Reply**, la plateforme qui veut aider les
TPE et PME à repérer les appels d'offres publics faits pour elles et à préparer
leur dossier plus simplement.

> **Les bons marchés. Les bonnes réponses.** — Du premier repérage au dossier
> prêt à déposer. *From opportunity to submission.*

Ce dossier est un projet **indépendant** du site sefa.is présent à la racine
du dépôt (même logique que `soleil-pour-tous/`) : sa propre identité, ses
propres dépendances, son propre déploiement.

## État réel du produit (à lire avant toute modification)

Au moment de la création du site (septembre 2026), **aucune fonction de la
plateforme n'existe** : le dépôt ne contient aucun code de veille, de fiche
marché, de score, de coffre-fort ni de préparation de dossier. Le site en tient
compte partout :

| Élément | Statut sur le site |
| --- | --- |
| Site de présentation | Fonctionnel |
| Démonstration interactive (marché fictif) | Fonctionnelle, **maquette** — mention « Exemple fictif — données illustratives » |
| Formulaire pilote / démo / rappel | Fonctionnel, **transmission à brancher** (voir plus bas) |
| Veille, fiche de synthèse, vigilance, score, coffre-fort, préparation | « En conception · V1 » |
| Fourchette de prix, suivi des candidatures | « Envisagé · après la V1 » |
| Paiement, comptes utilisateurs | Absents, volontairement |

Les statuts sont centralisés dans `content/product.ts`. **Ne passer une fonction
en « disponible » que lorsqu'elle l'est réellement.**

## Stack

Next.js 15 (App Router) + React 19 + TypeScript + Tailwind CSS, comme les
autres projets du dépôt. Aucune bibliothèque d'animation ni de composants :
les animations sont en CSS (courtes, désactivées par `prefers-reduced-motion`),
la FAQ utilise des `<details>` natifs, les onglets de la démo et le menu
mobile sont écrits à la main avec les attributs ARIA adaptés. Dépendances
d'exécution : `next`, `react`, `react-dom`, `clsx`, `tailwind-merge`.

## Lancer le site en local

```bash
cd ready-to-reply
npm install
cp .env.example .env.local   # facultatif en local
npm run dev                  # http://localhost:3000
```

Autres commandes :

```bash
npm run lint        # ESLint (next/core-web-vitals)
npm run typecheck   # TypeScript
npm run build       # build de production
npm start           # sert le build de production
```

Ne pas lancer `npm run dev` et `npm start` en même temps dans ce dossier :
les deux écrivent dans `.next/`.

## Configuration (variables d'environnement)

Voir `.env.example`. Aucune valeur secrète n'est présente dans le code.

| Variable | Rôle | Sans elle |
| --- | --- | --- |
| `NEXT_PUBLIC_SITE_URL` | URL publique (canonique, Open Graph, sitemap) | `http://localhost:3000` est utilisé : **à définir avant la mise en ligne** |
| `NEXT_PUBLIC_ALLOW_INDEXING` | `true` pour autoriser l'indexation | `robots.txt` interdit l'indexation (volontaire tant que les textes légaux ne sont pas prêts) |
| `CONTACT_WEBHOOK_URL` | Reçoit les demandes du formulaire en POST JSON | Dev : demande affichée dans la console, le formulaire dit « non transmise ». Prod : réponse 503, le formulaire dit « n'a pas pu être envoyée » |
| `CONTACT_WEBHOOK_SECRET` | Jeton envoyé en `Authorization: Bearer …` au webhook | Pas d'en-tête d'authentification |

### Brancher la réception des demandes

`app/api/contact/route.ts` valide la demande (même schéma que le navigateur,
`lib/lead.ts`), applique l'anti-spam (champ piège, délai minimal de saisie,
limitation en mémoire par IP) puis envoie ce JSON au webhook :

```json
{
  "requestType": "pilote | demo | rappel",
  "fullName": "…", "email": "…", "company": "…",
  "trade": "distribution-eclairage | …", "companySize": "" ,
  "need": "reperer | comprendre | preparer | suivre | decouvrir",
  "message": "…", "consent": true,
  "receivedAt": "2026-09-24T10:00:00.000Z", "source": "site-ready-to-reply"
}
```

Le site n'affiche « demande transmise » **que si le webhook répond 2xx**.
N'importe quel service acceptant un webhook convient (Make, Zapier, n8n, un
CRM, une fonction qui envoie un e-mail). Pour un envoi d'e-mail direct
(Resend, Brevo…), remplacer l'appel `fetch` par l'appel du fournisseur au même
endroit, avec la clé en variable d'environnement.

Limites connues : la limitation par IP est en mémoire (non partagée entre
instances serverless) ; ajouter un captcha (Turnstile, hCaptcha) si le spam
devient réel. Le formulaire nécessite JavaScript.

### Analytics, paiement

Aucun outil de mesure d'audience, aucun traceur et aucun paiement ne sont
installés. Si un outil de mesure non exempté est ajouté, il faut un bandeau de
consentement et une mise à jour de `app/cookies/page.tsx`. Le tarif fondateur
est désactivé dans `content/pricing.ts` (`founderOffer.enabled: false`).

## Où modifier quoi

| Fichier | Contenu |
| --- | --- |
| `lib/site.ts` | Nom, signatures, navigation, **fondateur, coordonnées et informations légales à compléter** |
| `content/product.ts` | Étapes, fonctions et **statuts réels**, feuille de route |
| `content/demo.ts` | Données **fictives** de la démonstration |
| `content/pricing.ts` | Tarifs (hypothèses) et activation du tarif fondateur |
| `content/faq.ts` | Questions fréquentes |
| `tailwind.config.ts` | Palette et typographie de la plaquette |
| `components/logo.tsx` | Logo (vectorisé depuis la plaquette, 3 déclinaisons) |
| `public/logo-ready-to-reply-*.svg` | Logo exportable : fond clair, fond terracotta, fond foncé |

Les champs laissés à `null` dans `lib/site.ts` s'affichent comme
`[à compléter]` sur le site : ils ne doivent jamais être inventés.

## Pages

`/` accueil · `/comment-ca-marche` · `/produit` · `/tarifs` · `/a-propos` ·
`/contact` · `/mentions-legales` · `/confidentialite` · `/cookies` · 404 ·
`/sitemap.xml` · `/robots.txt` · `/opengraph-image` (image de partage générée).

## Déploiement (Netlify)

Créer un site Netlify séparé pointant sur ce dépôt, avec **Base directory =
`ready-to-reply`** (ce dossier contient son propre `netlify.toml` et utilise
`@netlify/plugin-nextjs`). Renseigner les variables d'environnement ci-dessus
dans l'interface Netlify, puis déployer.

## Avant la mise en ligne publique

Ce qui **bloque** une mise en ligne publique :

1. **Textes juridiques** : mentions légales, politique de confidentialité et
   page cookies sont des modèles à compléter (éditeur, SIREN, hébergeur,
   durée de conservation, outil de réception des demandes) et **à faire
   valider par une personne compétente**. Ce site ne garantit aucune
   conformité légale.
2. **Coordonnées** : nom complet du fondateur, e-mail, téléphone, société et
   statut juridique (`lib/site.ts`).
3. **Réception des demandes** : définir `CONTACT_WEBHOOK_URL` et faire un
   envoi de test de bout en bout.
4. **URL et indexation** : définir `NEXT_PUBLIC_SITE_URL`, puis
   `NEXT_PUBLIC_ALLOW_INDEXING=true` une fois les points 1 à 3 réglés.

À faire confirmer par le fondateur :

- les éléments biographiques repris de la plaquette (entrée chez DRIM à
  19 ans, poste de responsable commercial, année à Londres) et l'usage de la
  photo ;
- les chiffres DAJ/OECP 2024 (233,3 Md€, 60 %, 25 %) et leur source exacte ;
- les tarifs (149 € HT/mois, 1 490 € HT/an, 99 € HT/mois fondateur) ;
- les sources de données envisagées (BOAMP, TED) et la feuille de route.
