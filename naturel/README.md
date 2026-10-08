# NATUREL — thème Shopify Online Store 2.0

Thème sur mesure pour NATUREL, marque de casquettes en éditions limitées numérotées.
Liquid + JSON templates + sections/blocks, CSS et JavaScript vanilla : pas de
framework ni de build, rien à compiler. Le dossier `theme/` est le thème installable.

Toutes les données commerciales (produits, prix, stocks, variantes, panier,
paiement, réductions, livraison, taxes, comptes, e-mails) viennent de Shopify.
Le thème ne contient aucun prix et aucune disponibilité saisis à la main.

---

## 1. Installer le thème

1. Créez l'archive : `cd naturel && ./build-theme-zip.sh`. Elle est écrite dans `naturel/dist/naturel-theme.zip`.
2. Dans Shopify : **Boutique en ligne > Thèmes > Ajouter un thème > Importer un fichier ZIP**.
3. Cliquez sur **Personnaliser** pour le prévisualiser, puis **Publier** quand tout est prêt.

Vous pouvez aussi utiliser Shopify CLI : `shopify theme push --path naturel/theme --unpublished`.
Pour développer en local : `shopify theme dev --path naturel/theme`.

## 2. Identité (Personnaliser > Paramètres du thème > Identité)

| Réglage | Fichier conseillé |
| --- | --- |
| Logo (mot NATUREL) | PNG transparent du logo original, 1200 px de large. Sa typographie reste ainsi intacte. |
| Logo clair | Même logo en blanc cassé, utilisé sur la photo d'accueil et dans le pied de page. |
| Écusson N | Photo ou export de l'écusson, idéalement détouré. |
| Favicon | Écusson N, carré, 64 px minimum. |

Tant qu'aucun fichier n'est importé, un écusson dessiné en CSS (d'après vos
visuels) et le nom de la boutique en Cormorant Garamond servent de remplacement.

## 3. Produits : modèle conseillé

**Un produit par coloris** (Sable 01, Dune 02, … Pearl 10), regroupés dans une
collection (ex. « Coastal Series »). Chaque coloris a ainsi sa page, son stock
et son édition, et les pastilles « Coloris » permettent de passer de l'un à l'autre.

Pour chaque produit, renseignez :
- les photos HD : face, profil, dos/boucle, écusson, visière, numérotation. Le 2ᵉ visuel apparaît au survol sur ordinateur ;
- le **prix** et le **stock** : activez le suivi des stocks, avec « Continuer à vendre en cas de rupture » **désactivé** ;
- la **description** ;
- les **métachamps** ci-dessous.

### Métachamps à créer (Paramètres > Données personnalisées > Produits)

| Nom | Espace de noms et clé | Type | Exemple | Effet |
| --- | --- | --- | --- | --- |
| Série | `custom.series` | Texte sur une ligne | Coastal Series | Surtitre de la carte et de la fiche |
| Code coloris | `custom.colorway_code` | Texte sur une ligne | 01 | Registre des éditions |
| Taille d'édition | `custom.edition_size` | Nombre entier | 100 | Badge « Édition limitée », mention « 100 exemplaires » |
| Numéro d'édition | `custom.edition_number` | Texte sur une ligne | 045 | « N° 045 / 100 » (aussi possible sur la **variante**) |
| Pastille | `custom.swatch` | Couleur | #E6DDCE | Pastille du coloris (sinon la photo est utilisée) |
| Composition | `custom.composition` | Texte multiligne | — | Onglet « Composition » |
| Entretien | `custom.care` | Texte multiligne | — | Onglet « Entretien » |

**Éditions de 100 exemplaires numérotés.** La section « Limited by nature »
n'affiche « Chaque coloris est produit en 100 exemplaires numérotés » que si
**tous** les produits de la collection choisie ont `custom.edition_size = 100`.
Si une valeur manque ou diffère, la phrase disparaît. Rien n'est affirmé sans
donnée confirmée dans Shopify.

Couleurs de pastilles relevées sur votre planche de coloris, à ajuster :

| Coloris | Couleur | Coloris | Couleur |
| --- | --- | --- | --- |
| Sable 01 | `#E6DDCE` | Cocoa 06 | `#5A3D2C` |
| Dune 02 | `#C9A77A` | Midnight 07 | `#26282C` |
| Palm 03 | `#7E8A62` | Sage 08 | `#9CA58A` |
| Ocean 04 | `#5C6E80` | Terracotta 09 | `#B5583A` |
| Stone 05 | `#E1DCD2` | Pearl 10 | `#EEE8DC` |

## 4. Pages et navigation

Créez dans **Boutique en ligne > Pages** :

| Page | Modèle à choisir | URL attendue |
| --- | --- | --- |
| Notre histoire | `page.histoire` | `/pages/notre-histoire` |
| Le savoir-faire | `page.savoir-faire` | `/pages/savoir-faire` |
| Contact | `page.contact` | `/pages/contact` |

Pour le journal (facultatif), créez un blog « Journal ».

Dans **Boutique en ligne > Navigation** :
- **Menu principal** (`main-menu`) : Collection, Notre histoire, Le savoir-faire, Journal ;
- **Pied de page** (`footer`) : Contact, Livraison, Retours, FAQ…

Les politiques Shopify (CGV, remboursement, confidentialité, livraison,
mentions légales, coordonnées) s'affichent automatiquement dans le pied de page.

## 5. Page d'accueil (Personnaliser)

Sections dans l'ordre, toutes déplaçables et modifiables :
1. **Hero immersif** : vidéo de mer calme (MP4 court, muet, < 8 Mo) et/ou photo (2400 px). Une image de remplacement s'affiche pendant le chargement de la vidéo, et un bouton pause est prévu.
2. **Philosophie** : « Simply Naturel », photo de matière, photo de détail, lien vers l'histoire.
3. **Collection** : choisissez la collection des coloris (5 colonnes, soit 2 rangées de 5 pour 10 coloris).
4. **L'art du détail** : 5 blocs (écusson, coutures, visière, boucle, numérotation), un gros plan par bloc.
5. **Limited by nature** : choisissez la même collection. Le registre liste les coloris et leur disponibilité réelle.
6. **L'univers NATUREL** : galerie horizontale (paysages, sable, architecture, mode), avec glisser, swiper et flèches.
7. **Newsletter** : formulaire client natif Shopify (tag `newsletter`).

## 6. Panier et paiement

- Le panier latéral utilise l'API AJAX de Shopify. Sans JavaScript, le panier fonctionne quand même : les formulaires sont envoyés normalement.
- Le bouton « Paiement sécurisé » mène au **checkout Shopify**. Codes promo, livraison, taxes et paiements se configurent dans Shopify.
- Le **paiement express** (Shop Pay, Apple Pay, Google Pay, PayPal) apparaît sur la fiche produit et la page panier s'il est activé dans **Paramètres > Paiements**. Vous pouvez le désactiver bloc par bloc.
- Une note de commande facultative s'active dans **Paramètres du thème > Panier**.

## 7. Animations et ambiance sonore

- **Ouverture signature** : écusson N, puis le mot NATUREL, puis la page (≈ 2,5 s). Elle n'est jouée qu'une fois par visiteur et se passe par clic, Échap ou « Passer ». Elle est désactivée avec « réduire les animations » et dans l'éditeur de thème.
- **Transitions de pages** : fondu natif (View Transitions). La photo d'une carte produit s'enchaîne avec celle de la fiche sur les navigateurs compatibles.
- **Ambiance sonore** : aucun son tant que le visiteur ne clique pas sur « Ambiance sonore ». Le même bouton coupe le son. Deux sources possibles :
  - *Vagues générées* : murmure de vagues synthétisé dans le navigateur, 0 Ko à télécharger ;
  - *Mon fichier* : importez un MP3 léger (< 1 Mo, bouclé) dans **Contenu > Fichiers**, puis collez son lien.
- Chaque effet se règle ou se désactive dans **Paramètres du thème > Animations / Ambiance sonore**.

## 8. Conformité France : à compléter avant ouverture

Le thème fournit les emplacements ; les textes juridiques sont à rédiger ou à faire valider.

- [ ] **Paramètres > Politiques** : CGV, politique de remboursement (droit de rétractation de **14 jours**), confidentialité (RGPD), expédition, **mentions légales** (raison sociale, siège, SIRET/RCS, TVA intracommunautaire, directeur de la publication, hébergeur : Shopify), coordonnées.
- [ ] **Médiateur de la consommation** : nom et coordonnées, à indiquer dans les CGV.
- [ ] **Prix TTC** : Paramètres > Taxes et droits > « Inclure les taxes dans les prix ». Le thème affiche alors « TTC ».
- [ ] **Bandeau cookies** : Paramètres > Confidentialité des clients > activer la bannière de cookies Shopify pour l'UE. Le thème n'ajoute aucun traceur. Il utilise seulement le stockage local du navigateur pour retenir l'ouverture vue et la préférence sonore.
- [ ] **Newsletter** : activer le double opt-in (Paramètres > Notifications clients > Marketing).
- [ ] Pied de page > **Mention commerciale** : raison sociale et SIRET.
- [ ] Fiche produit > onglet **Livraison & retours** : remplacer le texte `[À COMPLÉTER]` par vos délais et tarifs réels.

## 9. Textes et visuels à fournir

Tous les emplacements sans visuel affichent un cadre **« Visuel à venir »** qui
décrit l'image attendue. Cherchez aussi les mentions **`[À COMPLÉTER]`** dans
les pages Notre histoire et Le savoir-faire.

Les textes de détail proposés (écusson, coutures, visière, boucle,
numérotation) décrivent uniquement ce qui est visible sur vos visuels. Aucune
matière ni caractéristique technique n'est inventée. Validez-les ou remplacez-les.

## 10. Vérifications effectuées

- **Shopify Theme Check** (linter officiel) : 0 erreur, 0 avertissement.
- **Rendu local** des pages accueil, collection, produit, panier et Notre histoire avec des données fictives, dans Chromium, en 1440 px et 390 px. 39 tests navigateur réussis : ouverture et mémorisation, panier latéral (ajout, quantité, retrait, Échap), variantes (prix, disponibilité, URL), barre d'achat mobile, menu mobile, son activé/coupé, réduction des animations, navigation au clavier. Aucun débordement horizontal.
- **Non testé** (nécessite une vraie boutique) : checkout, paiement express, comptes clients, envoi des formulaires newsletter et contact, API panier réelle de Shopify. À vérifier sur la boutique après import, en commande test (Paramètres > Paiements > mode test).

## Structure

```
theme/
  layout/       theme.liquid, password.liquid
  sections/     hero, philosophy, featured-collection, details, limited-edition,
                gallery, newsletter, main-product, main-collection, main-cart,
                cart-drawer, header, footer, pages, comptes clients…
  snippets/     product-card, price, availability, emblem, wordmark, intro,
                ambient-sound, placeholder, meta-tags, theme-styles…
  templates/    index, product, collection, cart, page(.histoire|.savoir-faire|.contact),
                blog, article, search, 404, password, customers/*
  assets/       naturel.css, naturel.js, polices Cormorant Garamond & Jost (OFL)
  config/       settings_schema.json, settings_data.json
  locales/      fr.default.json, en.json
licenses/       licences OFL des polices
```
