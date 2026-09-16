import LocalizedClientLink from "@modules/common/components/localized-client-link"
import Image from "next/image"

const steps = [
  {
    step: "01",
    title: "Parfumez",
    text: "Quelques gouttes sur les points de pulsation, là où la peau est la plus chaude.",
    image: "/images/ritual-1.jpg",
    href: "/categories/parfums",
    cta: "Nos parfums",
  },
  {
    step: "02",
    title: "Hydratez",
    text: "Une huile ou un baume sur peau encore tiède, pour retenir le sillage.",
    image: "/images/ritual-2.jpg",
    href: "/categories/bodycare",
    cta: "Nos soins",
  },
  {
    step: "03",
    title: "Sublimez",
    text: "Le geste final : laisser la lumière faire le reste, toute la journée.",
    image: "/images/ritual-3.jpg",
    href: "/categories/coffrets",
    cta: "Nos coffrets",
  },
]

const RitualBand = () => {
  return (
    <section className="border-t border-nude bg-bg-alt">
      <div className="content-container section-y">
        <div className="mb-12 flex flex-col items-center gap-4 text-center small:mb-16">
          <span className="eyebrow">Le rituel Nura</span>
          <h2 className="font-serif text-4xl leading-tight text-brown small:text-5xl">
            Parfumez. Hydratez. Sublimez.
          </h2>
          <p className="max-w-md text-sm leading-relaxed text-ui-fg-subtle">
            Trois temps pour ralentir et laisser votre aura s&apos;installer.
          </p>
        </div>

        <ol className="grid grid-cols-1 gap-10 small:grid-cols-3 small:gap-8">
          {steps.map((step) => (
            <li key={step.step} className="flex flex-col gap-5">
              <div className="relative aspect-[4/5] w-full overflow-hidden bg-nude/30">
                <Image
                  src={step.image}
                  alt={step.title}
                  fill
                  sizes="(max-width: 900px) 100vw, 33vw"
                  className="object-cover object-center"
                />
                <span className="absolute left-4 top-4 font-serif text-2xl text-bg-alt">
                  {step.step}
                </span>
              </div>
              <div className="flex flex-col gap-3">
                <h3 className="font-serif text-2xl text-brown">
                  {step.title}
                </h3>
                <p className="text-sm leading-relaxed text-ui-fg-subtle">
                  {step.text}
                </p>
                <LocalizedClientLink
                  href={step.href}
                  className="link-underline self-start text-[11px] uppercase tracking-[0.2em] text-gold hover:text-brown"
                >
                  {step.cta}
                </LocalizedClientLink>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  )
}

export default RitualBand
