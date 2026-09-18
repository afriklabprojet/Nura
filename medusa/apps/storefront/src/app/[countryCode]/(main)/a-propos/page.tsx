import { Metadata } from "next"
import Image from "next/image"

import { getHomeContent } from "@lib/data/home-content"
import PostBody from "@modules/journal/components/post-body"

export const metadata: Metadata = {
  title: "À propos",
  description:
    "Découvrez la maison Nura : notre histoire, notre philosophie et nos engagements.",
}

const DEFAULT_TITLE = "Votre aura commence ici."
const DEFAULT_CONTENT = `Nura imagine des parfums et des soins pensés pour accompagner chaque aura, chaque humeur et chaque moment.

## Notre histoire

Nura est née d'une conviction simple : le parfum et le soin ne sont pas de simples produits, ils accompagnent une aura. Entre Paris et Abidjan, la maison puise dans des matières nobles et des gestes rituels pour composer des formules sensorielles, pensées pour révéler ce qui rend chacune unique.

## Notre philosophie

Chaque création Nura est une invitation au rituel : ralentir, prendre soin de soi, et laisser sa présence rayonner. Nous croyons à l'essentiel — des compositions justes, des textures délicates, des écrins épurés — pour que le soin reste un moment à soi, chaque jour.

## Nos engagements

- Des matières premières sélectionnées avec exigence, sans compromis sur la qualité.
- Des formules pensées pour la peau, développées dans le respect de la réglementation cosmétique européenne.
- Une direction artistique sobre et durable : peu d'éditions, des objets faits pour durer.`

export default async function AProposPage() {
  const { blocks } = await getHomeContent()
  const page = blocks.page_a_propos

  return (
    <>
      <section className="relative h-[52vh] min-h-[380px] w-full overflow-hidden">
        <Image
          src="/images/about-values.webp"
          alt="La maison Nura"
          fill
          priority
          sizes="100vw"
          className="object-cover object-center"
        />
        <div className="absolute inset-0 bg-ink/45" />
        <div className="content-container relative z-10 flex h-full flex-col items-center justify-center gap-4 text-center">
          <span className="text-[11px] uppercase tracking-[0.35em] text-bg-alt/80">
            La maison
          </span>
          <h1 className="font-serif text-4xl text-bg-alt small:text-6xl">
            {page?.title || DEFAULT_TITLE}
          </h1>
        </div>
      </section>

      <section className="content-container section-y grid grid-cols-1 gap-12 small:grid-cols-2 small:gap-20">
        <div className="relative aspect-[4/5] w-full overflow-hidden small:order-2">
          <Image
            src="/images/about-story.webp"
            alt="Notre histoire"
            fill
            sizes="(max-width: 900px) 100vw, 50vw"
            className="object-cover object-center"
          />
        </div>
        <div className="small:order-1">
          <PostBody content={page?.content || DEFAULT_CONTENT} />
        </div>
      </section>
    </>
  )
}
