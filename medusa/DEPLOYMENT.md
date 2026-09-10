# Déploiement de Nura en production

Ce projet est prêt à être déployé sur n'importe quel serveur (VPS) capable de
faire tourner Docker — Hetzner, DigitalOcean, OVH, Scaleway, etc. Tout tourne
alors sur ton propre serveur : tu possèdes le code et les données.

## Prérequis côté toi

1. **Un VPS** — 2 vCPU / 4 Go de RAM suffisent largement pour démarrer
   (ex. Hetzner CX22 ou équivalent, ~5-10 €/mois).
2. **Un nom de domaine** pointé vers l'IP du serveur (deux sous-domaines :
   un pour la boutique, un pour l'API — ex. `nura-paris.com` et
   `api.nura-paris.com`, en enregistrements DNS de type A).
3. **Docker installé sur le serveur** :
   ```bash
   curl -fsSL https://get.docker.com | sh
   ```

## Étapes

1. **Cloner le dépôt sur le serveur** et se placer dans `medusa/`.

2. **Créer le fichier `.env`** à partir de `.env.example` :
   ```bash
   cp .env.example .env
   ```
   Puis remplir :
   - `POSTGRES_PASSWORD`, `JWT_SECRET`, `COOKIE_SECRET` — générer avec
     `openssl rand -hex 32` (une valeur différente pour chacun).
   - `STORE_CORS` / `ADMIN_CORS` / `AUTH_CORS` — tes vrais domaines.
   - `NEXT_PUBLIC_MEDUSA_BACKEND_URL` / `NEXT_PUBLIC_BASE_URL` — tes vraies
     URLs publiques.
   - `NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY` — laisser vide pour l'instant
     (étape 5).

3. **Adapter `Caddyfile`** avec tes vrais domaines (remplace
   `nura-paris.com` et `api.nura-paris.com`).

4. **Démarrer** :
   ```bash
   docker compose up -d --build postgres redis backend caddy
   ```
   Au premier démarrage, le backend crée automatiquement les tables
   (migrations). Vérifie que tout va bien :
   ```bash
   docker compose logs -f backend
   ```

5. **Créer ton compte admin et une clé publiable** :
   ```bash
   docker compose exec backend npx medusa user -e ton-email@exemple.com -p un-mot-de-passe-solide
   ```
   Connecte-toi ensuite sur `https://api.nura-paris.com/app`, va dans
   **Settings > API Key Management > Publishable Keys**, crée une clé, et
   colle-la dans `NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY` du fichier `.env`.

   ⚠️ **Ne relance plus jamais cette commande `medusa user` après l'étape 7**
   (une fois les rôles Admin/Manager seedés) — bug confirmé de cette version
   de Medusa : la commande efface silencieusement toutes les politiques RBAC
   personnalisées. Pour ajouter d'autres comptes admin ensuite, utilise
   l'invitation depuis le dashboard (**Settings > Team > Invite**).

6. **Construire et démarrer le storefront** (maintenant que la clé existe) :
   ```bash
   docker compose up -d --build storefront
   ```

7. **Seeder le catalogue Nura et les rôles** (une seule fois, dans cet ordre —
   fais-le juste après l'étape 5, avant de créer d'autres comptes admin) :
   ```bash
   docker compose exec backend npx medusa exec ./src/scripts/seed-nura.ts
   docker compose exec backend npx medusa exec ./src/scripts/add-nura-collection.ts
   docker compose exec backend npx medusa exec ./src/scripts/seed-rbac-roles.ts
   ```

Le site est alors accessible sur tes deux domaines, avec HTTPS automatique
(Caddy gère les certificats Let's Encrypt tout seul).

## Paiement réel (Stripe)

Tant que `STRIPE_API_KEY` est vide, le paiement tourne en mode manuel/test
(aucune vraie carte n'est débitée). Pour activer les vrais paiements :

1. Crée un compte sur [stripe.com](https://stripe.com) (nécessite tes
   informations d'entreprise/bancaires — c'est une démarche que toi seul
   peux faire).
2. Récupère tes clés API (`dashboard.stripe.com/apikeys`), mets-les dans
   `.env` (`STRIPE_API_KEY`, `NEXT_PUBLIC_STRIPE_KEY`).
3. Crée un webhook Stripe pointant vers
   `https://api.nura-paris.com/hooks/payment/stripe_stripe`, copie le
   secret de signature dans `STRIPE_WEBHOOK_SECRET`.
4. Redéploie : `docker compose up -d --build backend storefront`.
5. Dans l'admin, **Settings > Regions > Europe**, active le mode de
   paiement Stripe.

## Rôles & permissions (Super Admin / Admin / Manager)

Trois profils existent dans le dashboard admin :

- **Super Admin** — accès total (créé automatiquement pour le premier
  compte admin).
- **Admin** — gère tout l'opérationnel (produits, commandes, clients,
  promotions, prix, inventaire, utilisateurs, réglages boutique), mais ne
  peut pas créer/modifier de rôles.
- **Manager** — peut consulter/créer/modifier produits, commandes, clients
  et inventaire au quotidien, mais ne peut ni supprimer, ni toucher aux
  utilisateurs, réglages boutique, clés API ou rôles.

Pour ajouter un collègue : dashboard → **Settings > Team > Invite**, puis
une fois le compte créé, assigne-lui un rôle via **Settings > Roles**.

## Emails (formulaire de contact via Resend)

Le formulaire `/contact` fonctionne déjà (validation + journal serveur) et
envoie un vrai email dès que Resend est configuré :

1. Crée un compte sur [resend.com](https://resend.com) et vérifies-y ton
   domaine d'envoi (ex. `nura-paris.com`).
2. Récupère une clé API (`resend.com/api-keys`), mets-la dans `.env`
   (`RESEND_API_KEY`) avec une adresse `RESEND_FROM_EMAIL` sur ce domaine
   vérifié (ex. `contact@nura-paris.com`).
3. Redéploie : `docker compose up -d --build backend`.

Tant que ces variables sont vides, les messages restent journalisés côté
serveur uniquement (`docker compose logs backend`), sans erreur pour le
visiteur.

## Mises à jour

```bash
git pull
docker compose up -d --build
```

## Sauvegardes

La base de données vit dans le volume Docker `postgres_data`. Programme une
sauvegarde régulière, par exemple :
```bash
docker compose exec postgres pg_dump -U medusa medusa | gzip > backup-$(date +%F).sql.gz
```
