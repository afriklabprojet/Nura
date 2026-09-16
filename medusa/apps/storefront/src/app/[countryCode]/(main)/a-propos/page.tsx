import { Metadata } from "next"
import Image from "next/image"
import LocalizedClientLink from "@modules/common/components/localized-client-link"

export const metadata: Metadata = {
  title: "À propos",
  description:
    "Découvrez la maison Nura : notre histoire, notre philosophie et nos engagements.",
}

const engagements = [
  "Des matières premières sélectionnées avec exigence, sans compromis sur la qualité.",
  "Des formules pensées pour la peau, développées dans le respect de la réglementation cosmétique européenne.",
  "Une direction artistique sobre et durable : peu d'éditions, des objets faits pour durer.",
]

export default function AProposPage() {
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
            Votre aura commence ici.
          </h1>
          <p className="max-w-lg text-sm leading-relaxed text-bg-alt/85">
            Nura imagine des parfums et des soins pensés pour accompagner
            chaque aura, chaque humeur et chaque moment.
          </p>
        </div>
      </section>

      <section className="content-container section-y grid grid-cols-1 items-center gap-12 small:grid-cols-2 small:gap-20">
        <div className="relative aspect-[4/5] w-full overflow-hidden">
          <Image
            src="/images/about-story.webp"
            alt="Notre histoire"
            fill
            sizes="(max-width: 900px) 100vw, 50vw"
            className="object-cover object-center"
          />
        </div>
        <div className="flex flex-col gap-5">
          <span className="eyebrow">Notre histoire</span>
          <h2 className="font-serif text-3xl leading-tight text-brown small:text-4xl">
            Entre Paris et Abidjan
          </h2>
          <p className="leading-relaxed text-ui-fg-subtle">
            Nura est née d&apos;une conviction simple : le parfum et le soin ne
            sont pas de simples produits, ils accompagnent une aura. Entre
            Paris et Abidjan, la maison puise dans des matières nobles et des
            gestes rituels pour composer des formules sensorielles, pensées
            pour révéler ce qui rend chacune unique.
          </p>
        </div>
      </section>

      <section className="border-y border-nude bg-bg-alt">
        <div className="content-container section-y mx-auto flex max-w-2xl flex-col items-center gap-5 text-center">
          <span className="eyebrow">Notre philosophie</span>
          <h2 className="font-serif text-3xl leading-tight text-brown small:text-4xl">
            Le soin comme rituel
          </h2>
          <p className="leading-relaxed text-ui-fg-subtle">
            Chaque création Nura est une invitation au rituel : ralentir,
            prendre soin de soi, et laisser sa présence rayonner. Nous croyons
            à l&apos;essentiel — des compositions justes, des textures
            délicates, des écrins épurés — pour que le soin reste un moment à
            soi, chaque jour.
          </p>
        </div>
      </section>

      <section className="content-container section-y">
        <div className="mb-10 flex flex-col items-center gap-3 text-center">
          <span className="eyebrow">Nos engagements</span>
          <h2 className="font-serif text-3xl text-brown small:text-4xl">
            Ce à quoi nous tenons
          </h2>
        </div>
        <ul className="grid grid-cols-1 gap-8 small:grid-cols-3">
          {engagements.map((engagement, index) => (
            <li key={engagement} className="flex flex-col gap-4">
              <span className="font-serif text-2xl text-gold">
                0{index + 1}
              </span>
              <span className="h-px w-8 bg-nude" />
              <p className="text-sm leading-relaxed text-ui-fg-subtle">
                {engagement}
              </p>
            </li>
          ))}
        </ul>

        <div className="pt-14 text-center">
          <LocalizedClientLink
            href="/store"
            className="inline-flex h-12 items-center justify-center bg-brown px-8 text-[11px] uppercase tracking-[0.2em] text-bg-alt transition-colors hover:bg-ink"
          >
            Découvrir la collection
          </LocalizedClientLink>
        </div>
      </section>
    </>
  )
}
