import LocalizedClientLink from "@modules/common/components/localized-client-link"
import Image from "next/image"

/**
 * Editorial slot for whatever the house is pushing right now — a launch, a
 * limited edition, a seasonal campaign. Until it is editable from the admin,
 * change the copy, artwork and destination here.
 */
const CAMPAIGN = {
  active: true,
  eyebrow: "Nouvelle collection",
  title: "Une nouvelle aura",
  text: "Découvrez notre nouvelle collection.",
  cta: "Découvrir",
  href: "/collections",
  image: "/images/campaign.webp",
  imageMobile: "/images/campaign-mobile.webp",
  alt: "Nouvelle collection Nura",
}

const Campaign = () => {
  if (!CAMPAIGN.active) {
    return null
  }

  return (
    <section className="relative h-[75vh] min-h-[460px] w-full overflow-hidden">
      <Image
        src={CAMPAIGN.image}
        alt={CAMPAIGN.alt}
        fill
        sizes="100vw"
        className="hidden object-cover object-center small:block"
      />
      <Image
        src={CAMPAIGN.imageMobile}
        alt={CAMPAIGN.alt}
        fill
        sizes="100vw"
        className="object-cover object-center small:hidden"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-ink/80 via-ink/40 to-ink/20 small:bg-gradient-to-r small:from-ink/80 small:via-ink/40 small:to-transparent" />

      <div className="content-container relative z-10 flex h-full items-end pb-14 small:items-center small:pb-0">
        <div className="flex max-w-lg flex-col items-start gap-6">
          <span className="text-[11px] uppercase tracking-[0.35em] text-bg-alt/80">
            {CAMPAIGN.eyebrow}
          </span>
          <h2 className="font-serif text-4xl leading-tight text-bg-alt small:text-6xl">
            {CAMPAIGN.title}
          </h2>
          <p className="max-w-md text-sm font-light leading-relaxed text-bg-alt/85">
            {CAMPAIGN.text}
          </p>
          <LocalizedClientLink
            href={CAMPAIGN.href}
            className="inline-flex h-12 items-center justify-center border border-bg-alt/70 px-10 text-[11px] uppercase tracking-[0.2em] text-bg-alt transition-colors hover:bg-bg-alt hover:text-brown"
          >
            {CAMPAIGN.cta}
          </LocalizedClientLink>
        </div>
      </div>
    </section>
  )
}

export default Campaign
