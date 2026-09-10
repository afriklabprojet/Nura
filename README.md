# NURA — Thème Shopify sur-mesure

Thème e-commerce premium pour la marque **Nura** (parfumerie & bodycare).
Direction artistique : minimaliste, féminin, premium, sensoriel.

« Votre aura commence ici. »

---

## Structure du thème

```
theme/
├── layout/theme.liquid          Squelette global (head, fonts, CSS/JS, JSON-LD)
├── config/
│   ├── settings_schema.json     Réglages thème (couleurs, typo, header, footer…)
│   └── settings_data.json       Valeurs par défaut
├── locales/fr.json              Chaînes UI en français
├── sections/                    Sections (header, footer, hero, collections…)
├── snippets/                    Composants réutilisables (carte produit, prix…)
├── templates/
│   ├── *.json                   Templates JSON (index, product, collection…)
│   └── customers/*.liquid       Compte client (connexion, adresses, commandes)
└── assets/
    ├── theme.css                Design system + composants
    └── theme.js                 Drawer panier, AJAX add-to-cart, accordéons…
```

## Palette & typographie

- **Couleurs** : beige crème `#F7F1E8`, blanc cassé `#FBF8F3`, nude `#E7D3C0`,
  brun profond `#3A2A20`, doré discret `#B79B6E`.
- **Typographie** : Cormorant Garamond (serif, titres/éditorial) + Jost (sans-serif, UI).
  Chargées via Google Fonts dans `layout/theme.liquid`.

## Démarrage (développement local)

1. Créer un compte [Shopify Partners](https://www.shopify.com/partners) puis une **boutique de développement**.
2. Installer Shopify CLI : `npm install -g @shopify/cli@latest`.
3. Se connecter : `shopify login --store votre-boutique.myshopify.com`.
4. Depuis le dossier du thème, lancer l'aperçu local :

   ```bash
   cd theme
   shopify theme dev
   ```

   Le thème est alors visible sur `http://localhost:9292` (hot-reload).
5. Pousser en production : `shopify theme push --unpublished` (boutique de dev).

## Données à configurer dans l'admin Shopify

- **Menus** : créer les menus `main-menu` (Accueil, Parfums, Bodycare, Collections,
  À propos, Contact) et `footer` (liens légaux + navigation).
- **Metafields produits** (namespace `custom`) utilisés par le thème :
  - `custom.type_produit` (Parfum / Bodycare / Coffret)
  - `custom.contenance` (ex. « 50 ml »)
  - `custom.notes_tete`, `custom.notes_coeur`, `custom.notes_fond` (profil olfactif)
  - `custom.conseils_utilisation` (rich text)
  - `custom.ingredients` (rich text)
  - `custom.badge` (Best-seller / Nouveau / Édition limitée)
- **Filtres collection** : activer l'app gratuite *Shopify Search & Discovery*
  pour les filtres de prix/disponibilité.
- **Avis clients** : installer **Judge.me** puis insérer son widget dans
  `sections/main-product.liquid` (emplacement marqué par un commentaire).
- **Newsletter** : le formulaire utilise la collection de contacts Shopify
  (`form 'customer'`) — compatible Shopify Email / Klaviyo.

## Pages à créer dans l'admin

- `À propos` (template `page.about`), `FAQ` (`page.faq`), `Contact` (`page.contact`)
- Pages légales : CGV, Politique de confidentialité, Mentions légales,
  Livraison & retours (template `page`).

## Évolutivité

- **Nouvelles collections/catégories** : sections `shop-by-category` et
  `featured-collection` extensibles depuis l'éditeur de thème.
- **International** : locales prêtes, activer Shopify Markets (FR/EN) plus tard.
- **Fidélité/coffrets/collaborations** : s'appuient sur les collections et
  metafields existants, sans refonte.
