# Soleil Pour Tous

Landing page de prospection pour l'installation de panneaux photovoltaïques
en France. Site marketing haute conversion : simulateur d'éligibilité,
formulaire de lead multi-étapes, tableau des aides disponibles, simulateur
d'économies, FAQ.

Ce projet est indépendant du site sefa.is présent à la racine de ce repo —
identité de marque, palette et composants distincts.

## Stack

Next.js 15 (App Router) + React 18 + TypeScript + Tailwind CSS, Framer
Motion pour les animations, Radix UI pour les primitives accessibles
(select, checkbox, accordion), React Hook Form + Zod pour la validation du
formulaire.

## Développement

```bash
npm install
npm run dev      # http://localhost:3000
npm run build
npm run lint
```

## Autocomplétion d'adresse (Google Places)

Le champ « Adresse postale complète » de l'étape 2 du formulaire propose des
suggestions d'adresse via l'API Google Places pendant que l'utilisateur tape,
et pré-remplit automatiquement le code postal et la ville.

Pour l'activer :

1. Créer un projet sur [Google Cloud Console](https://console.cloud.google.com/),
   activer l'API **Places API** (et **Maps JavaScript API**).
2. Créer une clé API, puis la restreindre par référent HTTP (le(s) domaine(s)
   de production et `localhost` pour le dev) et par API (Places + Maps
   JavaScript uniquement).
3. Copier `.env.example` en `.env.local` et renseigner
   `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY`.
4. Ajouter la même variable d'environnement sur Netlify (Site settings →
   Environment variables) pour la production.

Sans clé configurée, le champ reste une saisie libre classique (aucune
erreur, juste pas de suggestions) — voir
`components/address-autocomplete-input.tsx`.

## Notification email des prospects (Resend)

Chaque soumission valide du formulaire déclenche l'envoi d'un email
récapitulatif (coordonnées, adresse, logement, budget) via
[Resend](https://resend.com), géré dans `app/api/lead/route.ts`.

Pour l'activer :

1. Créer un compte sur [resend.com](https://resend.com) et générer une clé
   API.
2. Copier `.env.example` en `.env.local` et renseigner `RESEND_API_KEY`.
3. Ajouter/adapter `LEAD_NOTIFICATION_EMAIL` si l'adresse de réception
   change (par défaut `soleilpourtouspro@gmail.com`).
4. Facultatif mais recommandé pour la délivrabilité : vérifier un domaine
   sur Resend et régler `RESEND_FROM_EMAIL` sur une adresse de ce domaine
   (sinon l'envoi se fait depuis `onboarding@resend.dev`, qui fonctionne
   mais atterrit plus souvent en spam).
5. Ajouter les mêmes variables d'environnement sur Netlify (Site settings →
   Environment variables) pour la production.

Sans `RESEND_API_KEY` configurée, le lead est toujours validé et reçu par
le serveur (le formulaire ne plante pas), mais aucun email n'est envoyé —
un avertissement est loggé côté serveur à la place.

Pour brancher en plus (ou à la place) un CRM, un webhook ou Airtable/Google
Sheets, ajouter l'appel correspondant dans `app/api/lead/route.ts`, à côté
de l'envoi Resend.

## Déploiement (Netlify)

Ce dossier contient son propre `netlify.toml`. Si ce site est déployé comme
un site Netlify séparé du site sefa.is racine, configurer le champ **Base
directory** du site Netlify sur `soleil-pour-tous` pour que ce fichier de
config et ce `package.json` soient pris en compte.

## Contenu légal

`app/mentions-legales` et `app/politique-confidentialite` contiennent des
gabarits RGPD/mentions légales avec des champs `[Raison sociale]`,
`[SIREN/SIRET]`, etc. à compléter avec les informations réelles de la
société avant mise en ligne définitive.
