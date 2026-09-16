import LocalizedClientLink from "@modules/common/components/localized-client-link"
import Image from "next/image"

const RitualBand = () => {
  return (
    <section className="relative h-[70vh] min-h-[440px] w-full overflow-hidden">
      <Image
        src="/images/ritual.jpg"
        alt="Flacon Nura dans la lumière"
        fill
        sizes="100vw"
        className="object-cover object-center"
      />
      <div className="absolute inset-0 bg-ink/40" />
      <div className="content-container relative z-10 flex h-full items-center justify-center">
        <div className="flex max-w-lg flex-col items-center gap-6 text-center">
          <span className="text-[11px] uppercase tracking-[0.35em] text-bg-alt/80">
            Le rituel
          </span>
          <h2 className="font-serif text-4xl leading-tight text-bg-alt small:text-6xl">
            Un geste, une présence
          </h2>
          <p className="max-w-md text-sm font-light leading-relaxed text-bg-alt/85">
            Parfum, huile, baume : trois temps pour ralentir et laisser votre
            aura s&apos;installer.
          </p>
          <LocalizedClientLink
            href="/categories/coffrets"
            className="inline-flex h-12 items-center justify-center border border-bg-alt/70 px-8 text-[11px] uppercase tracking-[0.2em] text-bg-alt transition-colors hover:bg-bg-alt hover:text-brown"
          >
            Découvrir les coffrets
          </LocalizedClientLink>
        </div>
      </div>
    </section>
  )
}

export default RitualBand
