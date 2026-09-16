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

## Paiement réel

Deux régions, deux moyens de paiement. Tant que les clés ci-dessous sont
vides, le paiement tourne en mode manuel/test (aucun argent réel ne bouge) —
le site reste utilisable pour tout tester avant d'activer les vrais comptes.

**Important : la création et la vérification des comptes Stripe et Jèko ne
peuvent être faites que par toi.** Ces plateformes exigent tes documents
d'entreprise (immatriculation, pièce d'identité du représentant légal,
coordonnées bancaires) pour vérifier l'identité de l'entreprise — aucune IA
ne peut se substituer à cette vérification. Une fois les comptes créés et
validés, connecte-les au site avec les étapes ci-dessous.

### Stripe (Europe — cartes bancaires)

1. Crée un compte sur [stripe.com](https://stripe.com) et complète la
   vérification (documents d'entreprise, coordonnées bancaires).
2. Récupère tes clés API (`dashboard.stripe.com/apikeys`), mets-les dans
   `.env` (`STRIPE_API_KEY`, `NEXT_PUBLIC_STRIPE_KEY`).
3. Crée un webhook Stripe pointant vers
   `https://api.nura-paris.com/hooks/payment/stripe_stripe`, copie le
   secret de signature dans `STRIPE_WEBHOOK_SECRET`.
4. Redéploie : `docker compose up -d --build backend storefront`.
5. Dans l'admin, **Settings > Regions > Europe**, active le mode de
   paiement Stripe.

### Jèko (Côte d'Ivoire — Wave, Orange Money, MTN, Moov, Djamo)

1. Crée un compte sur [jeko.africa](https://jeko.africa) et complète la
   vérification (documents d'entreprise).
2. Dans le Dashboard Business (`cockpit.jeko.africa`), va dans
   **Paramètres > API & Webhooks** pour récupérer ta clé API et son
   identifiant, mets-les dans `.env` (`JEKO_API_KEY`, `JEKO_API_KEY_ID`).
3. Récupère l'identifiant de ta boutique via
   `GET https://api.jeko.africa/partner_api/stores` (avec les headers
   `X-API-KEY` / `X-API-KEY-ID`), mets-le dans `.env` (`JEKO_STORE_ID`).
4. Configure l'URL de webhook `https://api.nura-paris.com/hooks/payment/jeko_jeko`
   dans le même écran, copie le secret webhook affiché dans `.env`
   (`JEKO_WEBHOOK_SECRET`).
5. Redéploie : `docker compose up -d --build backend`.
6. Dans l'admin, **Settings > Regions > Côte d'Ivoire**, active le mode de
   paiement Jèko.

⚠️ Jèko ne propose pas de remboursement via son API : un remboursement doit
être fait manuellement (transfert mobile money direct) et noté à part —
tenter un remboursement pour Jèko dans le dashboard Medusa affichera une
erreur explicite plutôt que de faire semblant de réussir.

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

## Emails (Resend)

Une fois Resend configuré, le site envoie automatiquement :
- le message du formulaire `/contact` (à toi, `RESEND_FROM_EMAIL`),
- la confirmation de commande (au client, après paiement),
- le lien de réinitialisation de mot de passe,
- le lien de vérification d'email,
- la notification de nouvel inscrit à la newsletter (à toi).

1. Crée un compte sur [resend.com](https://resend.com) et vérifies-y ton
   domaine d'envoi (ex. `nura-paris.com`).
2. Récupère une clé API (`resend.com/api-keys`), mets-la dans `.env`
   (`RESEND_API_KEY`) avec une adresse `RESEND_FROM_EMAIL` sur ce domaine
   vérifié (ex. `contact@nura-paris.com`).
3. Redéploie : `docker compose up -d --build backend`.

Tant que ces variables sont vides, les messages restent journalisés côté
serveur uniquement (`docker compose logs backend`), sans erreur pour le
visiteur.

## Recherche produit (Meilisearch)

Auto-hébergée, aucun compte tiers requis :

1. Génère une clé et mets-la dans `.env` (`MEILISEARCH_API_KEY`) :
   ```bash
   openssl rand -hex 16
   ```
2. Démarre Meilisearch, puis crée l'index des produits avec sa clé primaire
   (sans cela, la graine échoue : Meilisearch ne peut pas inférer la clé
   primaire quand plusieurs champs se terminent par `id`) :
   ```bash
   docker compose up -d meilisearch
   curl -X POST http://localhost:7700/indexes \
     -H "Authorization: Bearer $MEILISEARCH_API_KEY" \
     -H "Content-Type: application/json" \
     -d '{"uid":"products","primaryKey":"id"}'
   ```
   Ensuite démarre tout :
   ```bash
   docker compose up -d --build
   ```
   Au démarrage, le backend remplit automatiquement l'index des produits et
   le maintient à jour à chaque création/modification de produit.
3. Crée une clé « search-only » (celle-ci est exposée au navigateur, elle
   ne doit jamais être la clé maître ci-dessus) :
   ```bash
   docker compose exec meilisearch curl -s -X POST http://localhost:7700/keys \
     -H "Authorization: Bearer $MEILISEARCH_API_KEY" \
     -H "Content-Type: application/json" \
     -d '{"description":"Storefront search-only key","actions":["search"],"indexes":["products"],"expiresAt":null}'
   ```
   Copie le `key` retourné dans `.env` (`NEXT_PUBLIC_MEILISEARCH_API_KEY`),
   mets `NEXT_PUBLIC_MEILISEARCH_HOST` sur l'URL publique de Meilisearch
   (ex. `https://api.nura-paris.com:7700` — pense à l'exposer dans ton
   `Caddyfile` si tu veux l'atteindre depuis l'extérieur), puis :
   ```bash
   docker compose up -d --build storefront
   ```

Tant que `MEILISEARCH_API_KEY` est vide, le site fonctionne normalement,
simplement sans barre de recherche (navigation par catégories/collections
uniquement).

## Détection automatique du marché

Un visiteur en Côte d'Ivoire arrive automatiquement en XOF/Jèko, un visiteur
ailleurs reste sur le marché par défaut (EUR/Stripe) — sans que le client
choisisse quoi que ce soit. Ça se fait via une détection GeoIP faite par
Caddy lui-même (auto-hébergée, aucun service tiers appelé à chaque visite) :

1. Crée un compte gratuit sur
   [maxmind.com/en/geolite2/signup](https://www.maxmind.com/en/geolite2/signup),
   génère une clé de licence (`Manage License Keys`).
2. Mets ton `Account ID` et ta clé dans `.env`
   (`GEOIPUPDATE_ACCOUNT_ID`, `GEOIPUPDATE_LICENSE_KEY`).
3. Premier démarrage uniquement — démarre `geoipupdate` seul et laisse-le
   terminer le premier téléchargement de la base (quelques secondes) avant
   de démarrer Caddy, sinon Caddy n'a pas encore de base à lire :
   ```bash
   docker compose up -d geoipupdate
   sleep 15
   docker compose up -d --build
   ```
   Les démarrages suivants n'ont pas besoin de cette étape séparée — la
   base reste sur le volume `geoip_data` et se rafraîchit automatiquement
   toutes les 72 h.

Si un client choisit manuellement un autre pays dans le sélecteur du site,
ce choix est mémorisé (cookie, 1 an) et prime toujours sur la détection
GeoIP au prochain passage.

Pour affiner la détection par pays plutôt que par grand marché (Europe vs
Côte d'Ivoire), ajoute d'autres blocs `@geo_*` dans le `Caddyfile` — voir le
commentaire au-dessus du bloc `@geo_ci` existant.

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
