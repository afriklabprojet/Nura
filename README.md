# NURA — e-commerce sur-mesure, auto-hébergé

Boutique e-commerce premium pour la marque **Nura** (parfumerie & bodycare).
Direction artistique : minimaliste, féminin, premium, sensoriel.

« Votre aura commence ici. »

---

## Stack active : `medusa/`

Backend [Medusa](https://medusajs.com) (open-source, self-hosted) + storefront
Next.js, en monorepo npm workspaces. Choisi pour un contrôle total du code et
des données — pas de plateforme tierce, hébergement sur ton propre serveur.

```
medusa/
├── apps/
│   ├── backend/     Medusa (API, admin, catalogue, commandes, paiements)
│   │   └── src/scripts/seed-nura.ts   Catalogue Nura (parfums, bodycare, coffrets)
│   └── storefront/  Next.js (boutique publique, charte Nura)
├── docker-compose.yml, Caddyfile, DEPLOYMENT.md   Déploiement production
```

### Démarrage local

```bash
cd medusa
npm run dev              # backend :9000 (admin sur /app) + storefront :8000
```

Prérequis locaux : PostgreSQL et Redis qui tournent (`brew services start
postgresql@16 redis`), variables d'environnement dans
`apps/backend/.env` / `apps/storefront/.env.local`. Voir `medusa/AGENTS.md`
pour les commandes détaillées (migrations, seed, lint, tests).

### Déploiement en production

Voir [`medusa/DEPLOYMENT.md`](medusa/DEPLOYMENT.md) — Docker + Caddy (HTTPS
automatique), sur n'importe quel VPS (Hetzner, DigitalOcean, OVH…).

### Palette & typographie

- **Couleurs** : beige crème `#F7F1E8`, blanc cassé `#FBF8F3`, nude `#E7D3C0`,
  brun profond `#3A2A20`, doré discret `#B79B6E`.
- **Typographie** : Cormorant Garamond (serif, titres) + Jost (sans-serif, UI).

### Reste à faire

- Photos produits réelles (actuellement placeholders).
- Paiement réel : Stripe est câblé dans le code mais désactivé tant
  qu'aucune clé n'est renseignée (voir DEPLOYMENT.md).
- Email transactionnel pour le formulaire `/contact` (actuellement journalisé
  côté serveur, pas encore envoyé par email).
- Pages À propos / FAQ (contenu à rédiger).

---

## Référence historique : `theme/` (thème Shopify)

Un thème Shopify Liquid complet a été construit avant de basculer vers la
stack auto-hébergée ci-dessus (Shopify héberge toujours les données même en
mode headless, ce qui ne correspondait pas à l'objectif de contrôle total).
Conservé ici à titre de référence — non maintenu activement.

```
theme/
├── layout/theme.liquid          Squelette global (head, fonts, CSS/JS, JSON-LD)
├── config/                      Réglages thème (couleurs, typo, header, footer…)
├── locales/fr.default.json      Chaînes UI en français
├── sections/, snippets/         Sections et composants réutilisables
├── templates/                   Templates JSON + compte client
└── assets/                      theme.css (design system) + theme.js
```

Pour le faire tourner : `cd theme && shopify theme dev` (nécessite le
Shopify CLI et une boutique de développement Shopify Partners).
