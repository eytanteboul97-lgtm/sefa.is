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

Septembre 2026 : **une seule fonction est réellement utilisable, la veille
BOAMP** (`/veille`, version de test). Tout le reste (fiche marché complète,
coffre-fort, préparation, suivi) n'existe qu'en maquette. Le site en tient
compte partout :

| Élément | Statut sur le site |
| --- | --- |
| Site de présentation | Fonctionnel |
| Démonstration interactive (marché fictif) | Fonctionnelle, **maquette** — mention « Exemple fictif — données illustratives » |
| Formulaire pilote / démo / rappel | Fonctionnel, **transmission à brancher** (voir plus bas) |
| **Veille BOAMP** (`/veille`) : avis réels, filtrés et notés selon un profil | **Version de test** |
| Fiche de synthèse, vigilance, score complet, coffre-fort, préparation | « En conception · V1 » |
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

## Veille BOAMP (version de test)

- `lib/boamp.ts` interroge côté serveur l'API ouverte du BOAMP (DILA, jeu
  « boamp » sur Opendatasoft, API Explore v2.1) : avis publiés sur la période
  choisie, recherche plein texte sur les mots-clés (repli automatique sur un
  filtrage local si l'API refuse la requête), 600 avis maximum par recherche,
  cache de 15 minutes. Les avis d'attribution, rectificatifs et annulations sont
  écartés.
- `lib/matching.ts` : profil (mots-clés, types, départements, montant minimum,
  période) et score sur 100 expliqué ligne par ligne : métier 40, type 20,
  montant 20, délai 20. Avis exclus : aucun mot-clé, hors zone, date limite
  passée, montant connu inférieur au minimum. Un avis sans montant est
  conservé et signalé.
- `app/api/marches/route.ts` : `GET /api/marches?keywords=…&types=…&departments=…&minAmount=…&days=…`.
- `components/veille.tsx` : écran de profil et de résultats. Le profil est
  mémorisé dans le navigateur uniquement (aucun compte).

**À vérifier sur les vraies données :** le connecteur a été écrit d'après la
documentation publique du jeu de données et testé contre une copie simulée
de l'API, l'environnement de développement n'ayant pas accès au BOAMP. Au
premier déploiement, ouvrir `/veille` et contrôler que les avis, dates,
départements et liens remontent correctement. Les noms de champs sont lus de
façon tolérante (`normalize()` dans `lib/boamp.ts`) : c'est le seul endroit à
ajuster si un champ s'appelle autrement. Le montant est extrait du détail de
l'avis (`donnees`) quand il y figure ; beaucoup d'avis ne l'indiquent pas.

## Configuration (variables d'environnement)

Voir `.env.example`. Aucune valeur secrète n'est présente dans le code.

| Variable | Rôle | Sans elle |
| --- | --- | --- |
| `NEXT_PUBLIC_SITE_URL` | URL publique (canonique, Open Graph, sitemap) | `http://localhost:3000` est utilisé : **à définir avant la mise en ligne** |
| `NEXT_PUBLIC_ALLOW_INDEXING` | `true` pour autoriser l'indexation | `robots.txt` interdit l'indexation (volontaire tant que les textes légaux ne sont pas prêts) |
| `CONTACT_WEBHOOK_URL` | Reçoit les demandes du formulaire en POST JSON | Dev : demande affichée dans la console, le formulaire dit « non transmise ». Prod : réponse 503, le formulaire dit « n'a pas pu être envoyée » |
| `BOAMP_API_URL` | Adresse de l'API BOAMP (facultatif, pour un miroir ou des tests) | API officielle de la DILA |
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
`/contact` · `/veille` (version de test) · `/mentions-legales` · `/confidentialite` · `/cookies` · 404 ·
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

## Version en un seul fichier (`en-ligne/`)

`en-ligne/index.html` est une version autonome du site (même contenu, veille
BOAMP appelée directement depuis le navigateur). Le projet Netlify
`elaborate-bienenstitch-0f9cb6` est prévu pour publier ce dossier
automatiquement à chaque envoi sur la branche : base et publication =
`ready-to-reply/en-ligne`, sans commande de build.
