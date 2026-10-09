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
    - `ORDER_ACCESS_SECRET` et `BACKUP_ENCRYPTION_KEY` — deux autres valeurs
       distinctes générées de la même façon.
    - `STOREFRONT_DOMAIN` / `BACKEND_DOMAIN` — les noms d'hôte publics sans
       `https://`; Caddy les utilise directement.
    - `STORE_CORS` / `ADMIN_CORS` / `AUTH_CORS` — tes vraies origines HTTPS.
   - `NEXT_PUBLIC_MEDUSA_BACKEND_URL` / `NEXT_PUBLIC_BASE_URL` — tes vraies
     URLs publiques.
    - `NEXT_PUBLIC_DEFAULT_REGION` — le code pays utilisé en dernier recours
       (`fr` par défaut).
    - Les variables `S3_*` d'un bucket S3/R2 persistant (voir « Médias »).
   - Toutes les variables `LEGAL_*`, dont `LEGAL_LAST_UPDATED`, avec les informations réelles de
       l'entreprise, de l'hébergeur et du médiateur choisi. Le storefront de
       production ne se construit pas si l'une d'elles manque.
    - Au moins Stripe ou Jèko doit être configuré avant le premier démarrage
       de production. Le paiement manuel n'y est jamais proposé.
    - `RESEND_API_KEY` et `RESEND_FROM_EMAIL` sont obligatoires en production;
       l'adresse d'envoi doit appartenir à un domaine vérifié dans Resend.
    - `REFERRAL_REWARD_EUR` / `REFERRAL_REWARD_XOF` — les montants métier
       validés, en unités monétaires majeures.
    - `REVALIDATE_SECRET` — une valeur partagée générée avec
       `openssl rand -hex 32`, afin que les publications Admin soient visibles
       immédiatement.
   - `NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY` — laisser vide pour l'instant
       (étape 5). Caddy peut exposer l'admin avant le storefront.

3. **Vérifier la configuration** avant le démarrage :
   ```bash
   docker compose config --quiet
   ```

4. **Démarrer** :
   ```bash
   docker compose up -d --build postgres redis meilisearch geoipupdate backend caddy
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
   Connecte-toi ensuite sur `https://<BACKEND_DOMAIN>/app`, va dans
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
   fais-le juste après l'étape 5, avant de créer d'autres comptes admin).
   Remplace d'abord les URL Unsplash de `src/scripts/product-images.ts` par
   les vrais packshots Nura; le seed bloque ces placeholders en production :
   ```bash
   docker compose exec backend npx medusa exec ./src/scripts/seed-nura.ts
   docker compose exec backend npx medusa exec ./src/scripts/add-nura-collection.ts
   docker compose exec backend npx medusa exec ./src/scripts/seed-rbac-roles.ts
   ```

Le site est alors accessible sur tes deux domaines, avec HTTPS automatique
(Caddy gère les certificats Let's Encrypt tout seul).

## Paiement réel

Deux régions, deux moyens de paiement. Le provider manuel reste disponible en
développement. En production, le backend refuse de démarrer tant qu'aucun
provider réel n'est configuré afin d'éviter toute commande sans paiement réel.

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
   `https://<BACKEND_DOMAIN>/hooks/payment/stripe_stripe`, copie le
   secret de signature dans `STRIPE_WEBHOOK_SECRET`, et abonne-le aux
   événements `payment_intent.amount_capturable_updated`,
   `payment_intent.succeeded`, `payment_intent.payment_failed` et
   `payment_intent.partially_funded`.
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
4. Fais confirmer par Jèko l'URL d'API et la convention de montant, puis
   renseigne `JEKO_API_URL` et `JEKO_AMOUNT_MULTIPLIER`. Le provider actuel
   refuse toute devise autre que XOF.
5. Configure l'URL de webhook `https://<BACKEND_DOMAIN>/hooks/payment/jeko_jeko`
   dans le même écran, copie le secret webhook affiché dans `.env`
   (`JEKO_WEBHOOK_SECRET`).
6. Redéploie : `docker compose up -d --build backend`.
7. Dans l'admin, **Settings > Regions > Côte d'Ivoire**, active le mode de
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
- les notifications d'annulation, d'expédition, de livraison et de remboursement,
- le lien de réinitialisation de mot de passe,
- le lien de vérification d'email,
- la notification de nouvel inscrit à la newsletter (à toi).

1. Crée un compte sur [resend.com](https://resend.com) et vérifies-y ton
   domaine d'envoi (ex. `nura-paris.com`).
2. Récupère une clé API (`resend.com/api-keys`), mets-la dans `.env`
   (`RESEND_API_KEY`) avec une adresse `RESEND_FROM_EMAIL` sur ce domaine
   vérifié (ex. `contact@nura-paris.com`).
3. Redéploie : `docker compose up -d --build backend`.

Le mode sans Resend, où les messages sont uniquement journalisés, est réservé
au développement local. Le backend de production refuse de démarrer sans ces
deux variables.

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
   mets `NEXT_PUBLIC_MEILISEARCH_HOST` sur
   `https://<BACKEND_DOMAIN>/meilisearch` (Caddy expose déjà ce chemin avec
   une limite de débit), puis :
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
3. Au premier démarrage, le healthcheck attend automatiquement la fin du
   téléchargement avant de démarrer Caddy :
   ```bash
   docker compose up -d geoipupdate
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

Les sauvegardes sont chiffrées en AES-256 et conservées 30 jours par défaut.
Exporte la clé indiquée dans `.env` sans la passer en argument de commande :
```bash
export BACKUP_ENCRYPTION_KEY='valeur-de-.env'
./scripts/backup-postgres.sh
```

Programme cette commande chaque nuit et copie aussi le dossier `backups/` vers
un stockage hors serveur. Pour vérifier une restauration sur une base de test :

```bash
export BACKUP_ENCRYPTION_KEY='valeur-de-.env'
RESTORE_CONFIRM=medusa ./scripts/restore-postgres.sh backups/medusa-TIMESTAMP.dump.enc
```

Teste une restauration au moins une fois par trimestre.

## Médias persistants

Le backend exige en production un bucket compatible S3. Configure
`S3_FILE_URL`, `S3_ACCESS_KEY_ID`, `S3_SECRET_ACCESS_KEY`, `S3_REGION`,
`S3_BUCKET` et, pour un service compatible tel que R2, `S3_ENDPOINT`.

## Supervision

Les conteneurs exposent des healthchecks et limitent leurs journaux à cinq
fichiers de 10 Mo. `OTEL_EXPORTER_OTLP_ENDPOINT` reste vide tant que la pile
OpenTelemetry n'est pas mise à niveau (avis GHSA-qqmp-wf37-98f9 sur
`@opentelemetry/instrumentation-pg`). Si tu l'actives malgré tout, vers un
collecteur que tu exploites, les traces HTTP, workflows, requêtes, base et cache
sont envoyées après masquage des identifiants de requête, des adresses IP, des
paramètres d'URL, des valeurs et paramètres SQL, des messages d'exception et de
statut, du nom du rôle de base et des détails du processus hôte (utilisateur
système, ligne de commande), sur les spans, leurs événements, leurs liens et leur
ressource (`apps/backend/src/lib/otel-redaction.ts`). Les segments du chemin
d'URL sont conservés : ne place jamais de donnée personnelle dans un chemin de
route. Ajoute aussi une sonde externe sur `/health` et sur la page d'accueil.
