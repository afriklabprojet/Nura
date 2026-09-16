import LocalizedClientLink from "@modules/common/components/localized-client-link"
import Image from "next/image"

const Hero = () => {
  return (
    <section className="relative h-[88vh] min-h-[560px] max-h-[900px] w-full overflow-hidden bg-nude">
      {/* Both crops keep a clean field of backdrop for the wording, so no
          scrim is needed over the photograph. */}
      <Image
        src="/images/hero.webp"
        alt="Campagne Nura"
        fill
        priority
        sizes="100vw"
        className="hidden small:block object-cover object-center animate-slow-zoom"
      />
      <Image
        src="/images/hero-mobile.webp"
        alt="Campagne Nura"
        fill
        priority
        sizes="100vw"
        className="small:hidden object-cover object-top"
      />

      <div className="content-container relative z-10 flex h-full flex-col justify-end pb-14 small:justify-center small:pb-0">
        <div className="flex max-w-xl animate-fade-up flex-col items-start gap-5 small:gap-7">
          <h1 className="flex flex-col gap-5 small:gap-7">
            <span className="font-serif text-2xl uppercase tracking-[0.45em] text-brown small:text-3xl">
              Nura
            </span>
            <span className="font-serif text-[2.75rem] leading-[1.05] text-brown small:text-7xl">
              Votre aura
              <br />
              commence ici.
            </span>
          </h1>
          <p className="max-w-sm text-sm font-light leading-relaxed text-brown/75">
            Parfumerie et bodycare premium, pensés pour accompagner chaque
            aura, chaque humeur et chaque moment.
          </p>
          <div className="flex flex-col gap-3 pt-1 xsmall:flex-row xsmall:items-center">
            <LocalizedClientLink
              href="/store"
              className="inline-flex h-12 items-center justify-center bg-brown px-10 text-[11px] uppercase tracking-[0.2em] text-bg-alt transition-colors hover:bg-ink"
            >
              Découvrir la collection
            </LocalizedClientLink>
            <LocalizedClientLink
              href="/categories/parfums"
              className="inline-flex h-12 items-center justify-center border border-brown/30 px-10 text-[11px] uppercase tracking-[0.2em] text-brown transition-colors hover:border-brown"
            >
              Explorer les parfums
            </LocalizedClientLink>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Hero
