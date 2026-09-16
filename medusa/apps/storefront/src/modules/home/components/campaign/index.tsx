import { CampaignBlock } from "@lib/data/home-content"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import Image from "next/image"

const DEFAULTS = {
  eyebrow: "Nouvelle collection",
  title: "Une nouvelle aura",
  text: "Découvrez notre nouvelle collection.",
  cta_label: "Découvrir",
  cta_href: "/collections",
  image: "/images/campaign.webp",
  image_mobile: "/images/campaign-mobile.webp",
}

/**
 * Editorial slot for whatever the house is pushing right now. Everything
 * here — copy, artwork, link, scheduling — is set in the admin under
 * "Page d'accueil"; the block is absent from the API when switched off or
 * outside its dates, and the section then disappears.
 */
const Campaign = ({
  block,
  hidden,
}: {
  block?: CampaignBlock
  hidden?: boolean
}) => {
  if (hidden) {
    return null
  }

  const content = { ...DEFAULTS, ...(block || {}) }
  const image = content.image || DEFAULTS.image
  const imageMobile = content.image_mobile || image

  return (
    <section className="relative h-[75vh] min-h-[460px] w-full overflow-hidden">
      <Image
        src={image}
        alt={content.title}
        fill
        sizes="100vw"
        className="hidden object-cover object-center small:block"
      />
      <Image
        src={imageMobile}
        alt={content.title}
        fill
        sizes="100vw"
        className="object-cover object-center small:hidden"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-ink/80 via-ink/40 to-ink/20 small:bg-gradient-to-r small:from-ink/80 small:via-ink/40 small:to-transparent" />

      <div className="content-container relative z-10 flex h-full items-end pb-14 small:items-center small:pb-0">
        <div className="flex max-w-lg flex-col items-start gap-6">
          {content.eyebrow && (
            <span className="text-[11px] uppercase tracking-[0.35em] text-bg-alt/80">
              {content.eyebrow}
            </span>
          )}
          <h2 className="font-serif text-4xl leading-tight text-bg-alt small:text-6xl">
            {content.title}
          </h2>
          {content.text && (
            <p className="max-w-md text-sm font-light leading-relaxed text-bg-alt/85">
              {content.text}
            </p>
          )}
          {content.cta_label && (
            <LocalizedClientLink
              href={content.cta_href || "/collections"}
              className="inline-flex h-12 items-center justify-center border border-bg-alt/70 px-10 text-[11px] uppercase tracking-[0.2em] text-bg-alt transition-colors hover:bg-bg-alt hover:text-brown"
            >
              {content.cta_label}
            </LocalizedClientLink>
          )}
        </div>
      </div>
    </section>
  )
}

export default Campaign
