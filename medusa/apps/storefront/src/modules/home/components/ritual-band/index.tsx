import { RitualBlock } from "@lib/data/home-content"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import Reveal from "@modules/common/components/reveal"
import Image from "next/image"

const DEFAULT_STEPS = [
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
]

const RitualBand = ({ block }: { block?: RitualBlock }) => {
  const eyebrow = block?.eyebrow || "Le rituel Nura"
  const title = block?.title || "Parfumez. Hydratez. Sublimez."
  const steps = block?.steps?.length ? block.steps : DEFAULT_STEPS

  return (
    <section className="border-t border-nude bg-bg-alt">
      <div className="content-container section-y">
        <Reveal className="mb-12 flex flex-col items-center gap-4 text-center small:mb-16">
          <span className="eyebrow">{eyebrow}</span>
          <h2 className="font-serif text-4xl leading-tight text-brown small:text-5xl">
            {title}
          </h2>
        </Reveal>

        <ol className="grid grid-cols-1 gap-12 small:grid-cols-3 small:gap-8">
          {steps.map((step, index) => (
            <li key={step.title}>
              <Reveal delay={index * 90} className="flex flex-col gap-5">
                <div className="relative aspect-[4/5] w-full overflow-hidden bg-nude/30">
                  {step.image && (
                    <Image
                      src={step.image}
                      alt={step.title}
                      fill
                      sizes="(max-width: 900px) 100vw, 33vw"
                      className="object-cover object-center"
                    />
                  )}
                  <span className="absolute left-4 top-4 font-serif text-2xl text-bg-alt">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                </div>
                <div className="flex flex-col gap-3">
                  <h3 className="text-[11px] uppercase tracking-[0.25em] text-brown">
                    {step.title}
                  </h3>
                  <p className="font-serif text-xl leading-snug text-brown/80">
                    {step.text}
                  </p>
                  {step.href && (
                    <LocalizedClientLink
                      href={step.href}
                      className="link-underline self-start text-[11px] uppercase tracking-[0.2em] text-gold hover:text-brown"
                    >
                      Découvrir
                    </LocalizedClientLink>
                  )}
                </div>
              </Reveal>
            </li>
          ))}
        </ol>
      </div>
    </section>
  )
}

export default RitualBand
