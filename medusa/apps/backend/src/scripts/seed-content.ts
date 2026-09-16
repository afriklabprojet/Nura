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
