# Contenu éditable depuis l'admin

Tout le texte, les images et les coordonnées du site public sont pilotés
depuis l'admin Medusa (`/app`), sans toucher au code. Ce document liste ce qui
est éditable, où le modifier, et les quelques exceptions volontaires.

## Où éditer

| Admin | Contenu |
| --- | --- |
| **Page d'accueil** | Hero, Campagne, Essentiels, Éditorial, Rituel, Catégories mises en avant, Galerie |
| **Pages** | À propos, Contact (texte d'intro), Livraison & retours, Politique de cookies |
| **FAQ** | Les questions/réponses de `/faq` |
| **Réglages du site** | Email, horaires, numéros de téléphone, liens Instagram/TikTok, bandeau d'annonces |
| **Journal** | Les articles du blog |

Chaque section a un interrupteur « Visible » et des dates optionnelles de
début/fin, pour programmer une mise en avant (ex. une campagne limitée dans le
temps) sans revenir la désactiver manuellement.

Les modifications sont visibles sur le site en quelques secondes : la
sauvegarde déclenche une revalidation instantanée du cache (voir
`content-revalidate.ts`), il n'y a rien à redéployer.

## Mise en forme du texte

Les champs « Contenu » (pages statiques, articles du Journal) acceptent une
syntaxe simple, volontairement sans HTML pour rester sûre :

- une ligne vide sépare les paragraphes
- une ligne commençant par `## ` devient un sous-titre
- une ligne commençant par `- ` devient un élément de liste
- `[texte](/lien)` crée un lien — interne (`/contact`) ou externe (`https://…`)

## Ce qui reste dans le code, volontairement

- **CGV, Politique de confidentialité, Mentions légales** (`/cgv`,
  `/confidentialite`, `/mentions-legales`) : ce sont des documents juridiques
  qui citent des articles de loi et des informations d'identité de
  l'entreprise (`lib/legal.ts`). Les rendre éditables en texte libre créerait
  un risque de non-conformité si un champ est laissé vide ou mal rempli en
  production. Ils restent codés en dur, à faire modifier par un développeur
  si le texte légal doit changer.
- **Les 5 images de la Galerie** : seuls le sur-titre, le titre et le
  sous-titre de cette section sont éditables. Les visuels et leurs légendes
  restent fixes dans `modules/home/components/gallery`.
- **La structure de navigation et le tunnel de commande** : les liens du menu,
  les catégories, et les étapes du checkout ne sont pas pilotés par l'admin —
  seul leur contenu ponctuel (coordonnées, bandeau d'annonces) l'est.
- **La dernière réponse de la FAQ** (« Comment vous contacter ? ») mentionne
  l'email et les numéros de téléphone en texte. Si ces coordonnées changent
  dans **Réglages du site**, pensez à mettre à jour cette réponse à la main
  dans **FAQ** — les deux ne sont pas liés automatiquement.
