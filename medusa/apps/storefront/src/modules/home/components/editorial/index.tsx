import { EditorialBlock } from "@lib/data/home-content"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import Image from "next/image"

const DEFAULTS: Required<EditorialBlock> = {
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
}

const Editorial = ({ block }: { block?: EditorialBlock }) => {
  const content = { ...DEFAULTS, ...(block || {}) }
  const pillars = block?.pillars?.length ? block.pillars : DEFAULTS.pillars

  return (
    <section className="border-t border-nude bg-bg">
      <div className="content-container section-y grid grid-cols-1 items-center gap-12 small:grid-cols-2 small:gap-20">
        <div className="relative order-2 aspect-[4/5] w-full overflow-hidden small:order-1">
          <Image
            src={content.image}
            alt="La maison Nura"
            fill
            sizes="(max-width: 900px) 100vw, 50vw"
            className="object-cover object-center"
          />
        </div>

        <div className="order-1 flex flex-col gap-7 small:order-2">
          <span className="eyebrow">{content.eyebrow}</span>
          <h2 className="font-serif text-4xl leading-tight text-brown small:text-5xl">
            {content.title}
          </h2>
          <p className="max-w-md leading-relaxed text-ui-fg-subtle">
            {content.text}
          </p>

          <ul className="flex flex-col divide-y divide-nude border-y border-nude">
            {pillars.map((pillar) => (
              <li key={pillar.title} className="flex flex-col gap-1 py-5">
                <span className="text-[11px] uppercase tracking-[0.2em] text-brown">
                  {pillar.title}
                </span>
                <span className="text-sm leading-relaxed text-ui-fg-subtle">
                  {pillar.text}
                </span>
              </li>
            ))}
          </ul>

          <LocalizedClientLink
            href={content.cta_href}
            className="inline-flex h-12 items-center justify-center self-start border border-brown/30 px-8 text-[11px] uppercase tracking-[0.2em] text-brown transition-colors hover:border-brown"
          >
            {content.cta_label}
          </LocalizedClientLink>
        </div>
      </div>
    </section>
  )
}

export default Editorial
