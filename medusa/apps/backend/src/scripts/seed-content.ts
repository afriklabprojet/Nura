import { MedusaContainer } from "@medusajs/framework"
import { ContainerRegistrationKeys } from "@medusajs/framework/utils"

import { CONTENT_MODULE } from "../modules/content"
import type ContentModuleService from "../modules/content/service"

/**
 * Starter editorial content: the home page blocks pre-filled with the theme's
 * own defaults, and a few Journal articles so the section is not empty. All of
 * it is meant to be rewritten from the admin — running this again leaves any
 * existing block or article untouched.
 */

const HOME_BLOCKS = [
  {
    key: "hero",
    data: {
      eyebrow: "Nura",
      title: "Votre aura commence ici.",
      text: "Parfumerie et bodycare premium, pensés pour accompagner chaque aura, chaque humeur et chaque moment.",
      cta_label: "Découvrir la collection",
      cta_href: "/store",
      secondary_label: "Explorer les parfums",
      secondary_href: "/categories/parfums",
      image: "/images/hero.webp",
      image_mobile: "/images/hero-mobile.webp",
    },
  },
  {
    key: "campaign",
    data: {
      eyebrow: "Nouvelle collection",
      title: "Une nouvelle aura",
      text: "Découvrez notre nouvelle collection.",
      cta_label: "Découvrir",
      cta_href: "/collections",
      image: "/images/campaign.webp",
      image_mobile: "/images/campaign-mobile.webp",
    },
  },
  {
    key: "essentials",
    data: {
      title: "Les essentiels Nura",
      subtitle: "Découvrez les signatures parfumées de la maison.",
      handles: "",
    },
  },
  {
    key: "editorial",
    data: {
      eyebrow: "L'univers Nura",
      title: "Votre aura commence ici.",
      text: "Nura imagine des parfums et des soins pensés pour accompagner chaque aura, chaque humeur et chaque moment. Une parfumerie orientale revisitée avec la douceur du soin contemporain.",
      cta_label: "Découvrir Nura",
      cta_href: "/a-propos",
      image: "/images/editorial.webp",
      pillars: [
        {
          title: "Matières nobles",
          text: "Des ingrédients sélectionnés avec exigence, sans compromis sur la qualité.",
        },
        {
          title: "Formules sensorielles",
          text: "Des textures délicates pensées pour le geste autant que pour la peau.",
        },
        {
          title: "Entre Paris et Abidjan",
          text: "Une maison nourrie de deux cultures, une même idée de l'élégance.",
        },
      ],
    },
  },
  {
    key: "ritual",
    data: {
      eyebrow: "Le rituel Nura",
      title: "Parfumez. Hydratez. Sublimez.",
      steps: [
        {
          title: "Parfumer",
          text: "Découvrez votre signature olfactive.",
          image: "/images/ritual-1.webp",
          href: "/categories/parfums",
        },
        {
          title: "Hydrater",
          text: "Prenez soin de votre peau avec nos essentiels bodycare.",
          image: "/images/ritual-2.webp",
          href: "/categories/bodycare",
        },
        {
          title: "Sublimer",
          text: "Associez les produits pour créer votre propre rituel.",
          image: "/images/ritual-3.webp",
          href: "/categories/coffrets",
        },
      ],
    },
  },
  {
    key: "categories",
    data: {
      doors: [
        {
          handle: "parfums",
          title: "Parfums",
          description: "Trouvez le parfum qui vous ressemble.",
        },
        {
          handle: "bodycare",
          title: "Bodycare",
          description: "Des essentiels pour prendre soin de votre peau.",
        },
      ],
    },
  },
  {
    key: "gallery",
    data: {
      eyebrow: "Communauté",
      title: "L'univers Nura",
      subtitle:
        "Campagnes, routines et gestes du quotidien — l'aura Nura vue par la maison et par vous.",
    },
  },
  {
    key: "site_settings",
    data: {
      email: "contact@nura-paris.com",
      hours: "Du lundi au vendredi, 9h — 18h",
      phones: [
        { label: "France", tel: "+33745064887", display: "+33 7 45 06 48 87" },
        {
          label: "Abidjan",
          tel: "+2250505798882",
          display: "+225 05 05 79 88 82",
        },
      ],
      social: {
        instagram: "https://instagram.com/nura",
        tiktok: "https://tiktok.com/@nura",
      },
    },
  },
  {
    key: "announcement",
    data: {
      messages: [
        "Livraison en France et en Côte d'Ivoire",
        "Paiement sécurisé",
        "Retours sous 14 jours",
        "Votre aura commence ici",
      ],
    },
  },
  {
    key: "faq",
    data: {
      items: [
        {
          question: "Quels sont les délais et zones de livraison ?",
          answer:
            "Nous livrons en France métropolitaine et en Côte d'Ivoire. Le délai indicatif est de 3 à 7 jours ouvrés. Les frais de livraison sont précisés avant la validation de votre commande.",
        },
        {
          question: "Comment suivre ma commande ?",
          answer:
            "Un email de confirmation vous est envoyé dès la validation de votre commande. Vous pouvez ensuite suivre son statut depuis votre compte, rubrique « Commandes ».",
        },
        {
          question: "Quels moyens de paiement acceptez-vous ?",
          answer:
            "En Europe, vous pouvez payer par carte bancaire (Stripe). En Côte d'Ivoire, le paiement mobile money (Wave, Orange Money, MTN, Moov, Djamo) est disponible via notre partenaire Jèko.",
        },
        {
          question: "Puis-je retourner un produit ?",
          answer:
            "Vous disposez d'un délai de 14 jours après réception pour exercer votre droit de rétractation. Les produits doivent être retournés neufs, non ouverts et dans leur emballage d'origine. Pour des raisons d'hygiène, les produits descellés (parfums, cosmétiques) ne peuvent pas être retournés.",
        },
        {
          question: "Les produits sont-ils testés sur les animaux ?",
          answer:
            "Non. Conformément à la réglementation européenne, aucun produit cosmétique Nura n'est testé sur les animaux, et nous ne le demandons pas à nos fournisseurs.",
        },
        {
          question: "Comment vous contacter ?",
          answer:
            "Vous pouvez nous écrire via le formulaire de contact, par email à contact@nura-paris.com, ou joindre notre service client France (+33 7 45 06 48 87) et Abidjan (+225 05 05 79 88 82), du lundi au vendredi.",
        },
      ],
    },
  },
  {
    key: "page_a_propos",
    data: {
      title: "Votre aura commence ici.",
      content: `Nura imagine des parfums et des soins pensés pour accompagner chaque aura, chaque humeur et chaque moment.

## Notre histoire

Nura est née d'une conviction simple : le parfum et le soin ne sont pas de simples produits, ils accompagnent une aura. Entre Paris et Abidjan, la maison puise dans des matières nobles et des gestes rituels pour composer des formules sensorielles, pensées pour révéler ce qui rend chacune unique.

## Notre philosophie

Chaque création Nura est une invitation au rituel : ralentir, prendre soin de soi, et laisser sa présence rayonner. Nous croyons à l'essentiel — des compositions justes, des textures délicates, des écrins épurés — pour que le soin reste un moment à soi, chaque jour.

## Nos engagements

- Des matières premières sélectionnées avec exigence, sans compromis sur la qualité.
- Des formules pensées pour la peau, développées dans le respect de la réglementation cosmétique européenne.
- Une direction artistique sobre et durable : peu d'éditions, des objets faits pour durer.`,
    },
  },
  {
    key: "page_contact",
    data: {
      title: "Contact",
      content: `Une question sur un produit, une commande ou une collaboration ? Écrivez-nous, nous vous répondons sous 24 à 48 h.

Livraison, retours, paiement : la plupart des réponses se trouvent déjà dans notre [FAQ](/faq).`,
    },
  },
  {
    key: "page_livraison_retours",
    data: {
      title: "Livraison & retours",
      content: `Tout ce qu'il faut savoir avant et après votre commande.

## Zones et délais

Nous livrons en France métropolitaine et en Côte d'Ivoire. Le délai indicatif est de 3 à 7 jours ouvrés à compter de la validation de votre commande.

## Frais de livraison

Les frais de livraison dépendent de votre destination. Ils sont calculés et affichés avant la validation du paiement, à l'étape Livraison du tunnel de commande.

## Suivi de commande

Un email de confirmation vous est envoyé dès la validation de votre commande. Vous pouvez ensuite en suivre le statut depuis votre compte, rubrique [Commandes](/account/orders).

## Droit de rétractation

Vous disposez de 14 jours après réception pour exercer votre droit de rétractation. Les produits doivent être retournés neufs, non ouverts et dans leur emballage d'origine.

Pour des raisons d'hygiène, les produits descellés — parfums et cosmétiques ouverts — ne peuvent pas être repris. Le remboursement intervient dans les 14 jours suivant la réception du retour, sur le moyen de paiement utilisé lors de la commande.

Les conditions complètes figurent dans nos [conditions générales de vente](/cgv).`,
    },
  },
  {
    key: "page_politique_cookies",
    data: {
      title: "Politique de cookies",
      content: `## Qu'est-ce qu'un cookie ?

Un cookie est un petit fichier texte déposé sur votre appareil lors de la visite d'un site internet. Il permet au site de reconnaître votre appareil et de mémoriser certaines informations sur vos préférences ou actions passées.

## Les cookies utilisés sur ce site

Cookies strictement nécessaires — indispensables au fonctionnement du site (panier, session de connexion, région choisie). Ils ne peuvent pas être désactivés et ne nécessitent pas votre consentement conformément à la réglementation.

Cookies de mesure d'audience et de publicité — utilisés uniquement si vous les acceptez, pour mesurer la fréquentation du site (Google Analytics) et l'efficacité de nos campagnes publicitaires (Meta, TikTok). Ces outils ne sont chargés qu'après votre consentement explicite via le bandeau de cookies.

## Gérer vos préférences

Lors de votre première visite, un bandeau vous permet d'accepter ou de refuser les cookies non essentiels. Vous pouvez modifier votre choix à tout moment en effaçant les cookies de votre navigateur, ce qui réaffichera le bandeau lors de votre prochaine visite.`,
    },
  },
]

const POSTS = [
  {
    title: "Comment choisir son parfum",
    handle: "comment-choisir-son-parfum",
    cover_image: "/images/ritual-1.webp",
    excerpt:
      "Trois repères simples pour trouver la fragrance qui vous ressemble, sans se perdre parmi les essais.",
    author: "La maison Nura",
    content: `Choisir un parfum ne se joue pas au premier vaporisateur. Une fragrance évolue sur la peau pendant plusieurs heures, et c'est cette évolution qui décide si elle vous correspond.

## Partir des familles olfactives

Les parfums se rangent en grandes familles : florale, boisée, ambrée, hespéridée, chyprée. Repérez celle vers laquelle vous revenez naturellement, puis explorez-la en profondeur plutôt que d'essayer un peu de tout.

## Tester sur la peau, jamais sur le papier

Le papier ne retient que les notes de tête, celles qui s'évaporent en quelques minutes. Sur la peau, les notes de cœur apparaissent après une demi-heure, le fond après deux heures. Vaporisez, partez, revenez.

## Trois essais maximum par visite

Au-delà, l'odorat sature et tout se ressemble. Mieux vaut revenir un autre jour que de décider le nez fatigué.

- Vaporisez à vingt centimètres de la peau
- Ne frottez pas les poignets l'un contre l'autre
- Laissez passer une journée avant de trancher`,
  },
  {
    title: "Le rituel : parfumer, hydrater, sublimer",
    handle: "le-rituel-parfumer-hydrater-sublimer",
    cover_image: "/images/texture.webp",
    excerpt:
      "Pourquoi l'ordre des gestes change la tenue d'un parfum, et comment composer le vôtre.",
    author: "La maison Nura",
    content: `Un parfum tient mieux sur une peau préparée. C'est tout le principe du rituel Nura : trois temps, dans cet ordre.

## Hydrater d'abord

Une peau sèche laisse le parfum s'évaporer plus vite. Appliquez une huile ou un baume sur peau encore tiède, au sortir de la douche, et laissez pénétrer quelques minutes.

## Parfumer ensuite

Visez les points de pulsation : poignets, creux du cou, derrière les oreilles, pli du coude. Ce sont les zones les plus chaudes, celles qui diffusent le sillage tout au long de la journée.

## Superposer, enfin

Associer une huile et un parfum de la même famille olfactive prolonge la tenue et donne du relief. C'est ce que l'on appelle la superposition, et c'est la façon la plus simple de composer une signature qui n'appartient qu'à vous.`,
  },
  {
    title: "Prendre soin de sa peau au quotidien",
    handle: "prendre-soin-de-sa-peau-au-quotidien",
    cover_image: "/images/ritual-2.webp",
    excerpt:
      "Les gestes bodycare qui comptent vraiment, et le bon moment pour les faire.",
    author: "La maison Nura",
    content: `Le soin du corps demande moins de produits qu'on ne le croit, mais plus de régularité.

## Le bon moment

La peau absorbe mieux juste après la douche, quand elle est encore humide et que les pores sont ouverts. Deux minutes à ce moment-là valent mieux que dix plus tard dans la journée.

## Huile ou baume ?

L'huile nourrit et pénètre vite : idéale le matin, sous les vêtements. Le baume forme un film plus riche : parfait le soir, ou sur les zones qui tiraillent — coudes, genoux, talons.

## La régularité avant la quantité

Une noisette chaque jour fait plus qu'une application généreuse une fois par semaine. Gardez votre soin visible, à portée de main : c'est la meilleure façon de ne pas l'oublier.`,
  },
]

export default async function seedContent({
  container,
}: {
  container: MedusaContainer
}) {
  const logger = container.resolve(ContainerRegistrationKeys.LOGGER)
  const service: ContentModuleService = container.resolve(CONTENT_MODULE)

  for (const block of HOME_BLOCKS) {
    const [existing] = await service.listHomeBlocks({ key: block.key })

    if (existing) {
      logger.info(`Home block "${block.key}" already configured, left as is.`)
      continue
    }

    await service.createHomeBlocks({ ...block, active: true, rank: 0 })
    logger.info(`Created home block "${block.key}".`)
  }

  for (const post of POSTS) {
    const [existing] = await service.listPosts({ handle: post.handle })

    if (existing) {
      // Only fill in a cover that was never set, so an edited article keeps
      // whatever the admin chose.
      if (!existing.cover_image && post.cover_image) {
        await service.updatePosts({
          id: existing.id,
          cover_image: post.cover_image,
        })
        logger.info(`Added a cover image to "${post.handle}".`)
      } else {
        logger.info(`Post "${post.handle}" already exists, left as is.`)
      }
      continue
    }

    await service.createPosts({
      ...post,
      status: "published",
      published_at: new Date(),
    })
    logger.info(`Created post "${post.handle}".`)
  }

  logger.info("Editorial content seeded.")
}
