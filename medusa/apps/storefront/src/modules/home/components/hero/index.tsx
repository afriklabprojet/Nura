import { HeroBlock } from "@lib/data/home-content"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import Image from "next/image"

const DEFAULTS = {
  eyebrow: "Nura",
  title: "Votre aura commence ici.",
  text: "Parfumerie et bodycare premium, pensés pour accompagner chaque aura, chaque humeur et chaque moment.",
  cta_label: "Découvrir la collection",
  cta_href: "/store",
  secondary_label: "Explorer les parfums",
  secondary_href: "/categories/parfums",
  image: "/images/hero.webp",
  image_mobile: "/images/hero-mobile.webp",
}

const Hero = ({ block }: { block?: HeroBlock }) => {
  const content = { ...DEFAULTS, ...(block || {}) }
  const image = content.image || DEFAULTS.image
  const imageMobile = content.image_mobile || DEFAULTS.image_mobile
  const video = block?.video?.trim()

  return (
    <section className="relative h-[calc(100dvh-7rem)] min-h-[440px] max-h-[680px] w-full overflow-hidden bg-nude small:h-[88dvh] small:min-h-[560px] small:max-h-[900px]">
      {/* Both crops keep a clean field of backdrop for the wording, so no
          scrim is needed over the photograph. */}
      {video ? (
        <video
          className="absolute inset-0 h-full w-full object-cover"
          autoPlay
          muted
          loop
          playsInline
          poster={image}
        >
          <source src={video} type="video/mp4" />
        </video>
      ) : (
        <>
          <Image
            src={image}
            alt="Campagne Nura"
            fill
            priority
            sizes="100vw"
            className="hidden small:block object-cover object-center animate-slow-zoom"
          />
          <Image
            src={imageMobile}
            alt="Campagne Nura"
            fill
            priority
            sizes="100vw"
            className="small:hidden object-cover object-top"
          />
        </>
      )}

      <div className="content-container relative z-10 flex h-full flex-col justify-end pb-8 xsmall:pb-12 small:justify-center small:pb-0">
        <div className="flex max-w-xl animate-fade-up flex-col items-start gap-5 small:gap-7">
          <h1 className="flex flex-col gap-5 small:gap-7">
            <span className="font-serif text-2xl uppercase tracking-[0.45em] text-brown small:text-3xl">
              {content.eyebrow}
            </span>
            <span className="font-serif text-[2.5rem] leading-[1.05] text-brown xsmall:text-[2.75rem] small:text-7xl">
              {content.title}
            </span>
          </h1>
          {content.text && (
            <p className="max-w-sm text-sm font-light leading-relaxed text-brown/75">
              {content.text}
            </p>
          )}
          <div className="flex flex-col gap-3 pt-1 xsmall:flex-row xsmall:items-center">
            {content.cta_label && (
              <LocalizedClientLink
                href={content.cta_href || "/store"}
                className="inline-flex h-12 items-center justify-center bg-brown px-10 text-[11px] uppercase tracking-[0.2em] text-bg-alt transition-colors hover:bg-ink"
              >
                {content.cta_label}
              </LocalizedClientLink>
            )}
            {content.secondary_label && (
              <LocalizedClientLink
                href={content.secondary_href || "/store"}
                className="inline-flex h-12 items-center justify-center border border-brown/30 px-10 text-[11px] uppercase tracking-[0.2em] text-brown transition-colors hover:border-brown"
              >
                {content.secondary_label}
              </LocalizedClientLink>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}

export default Hero
