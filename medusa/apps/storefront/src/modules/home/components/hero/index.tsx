import LocalizedClientLink from "@modules/common/components/localized-client-link"
import Image from "next/image"

const Hero = () => {
  return (
    <section className="w-full border-b border-nude bg-bg">
      <div className="grid grid-cols-1 small:grid-cols-[1.05fr_1fr] small:h-[78vh] small:min-h-[600px] small:max-h-[820px]">
        <div className="order-2 flex flex-col justify-center gap-5 px-5 py-12 small:order-1 small:gap-7 small:px-16 medium:px-24">
          <span className="eyebrow animate-fade-up">
            Parfumerie &amp; bodycare premium
          </span>
          <h1 className="animate-fade-up font-serif text-[2.75rem] leading-[1.05] text-brown small:text-6xl medium:text-7xl">
            Votre aura
            <br />
            commence ici.
          </h1>
          <p className="max-w-md animate-fade-up text-sm font-light leading-relaxed text-ui-fg-subtle small:text-base">
            Des parfums et des soins pensés pour accompagner chaque aura,
            chaque humeur et chaque moment.
          </p>
          <div className="flex animate-fade-up flex-col gap-3 pt-2 xsmall:flex-row xsmall:items-center">
            <LocalizedClientLink
              href="/store"
              className="inline-flex h-12 items-center justify-center bg-brown px-8 text-[11px] uppercase tracking-[0.2em] text-bg-alt transition-colors hover:bg-ink"
            >
              Découvrir la collection
            </LocalizedClientLink>
            <LocalizedClientLink
              href="/categories/parfums"
              className="inline-flex h-12 items-center justify-center border border-brown/30 px-8 text-[11px] uppercase tracking-[0.2em] text-brown transition-colors hover:border-brown"
            >
              Nos parfums
            </LocalizedClientLink>
          </div>
        </div>

        <div className="relative order-1 aspect-[4/5] w-full overflow-hidden small:order-2 small:aspect-auto small:h-full">
          <Image
            src="/images/hero-split.jpg"
            alt="Portrait Nura"
            fill
            priority
            sizes="(max-width: 900px) 100vw, 50vw"
            className="animate-slow-zoom object-cover object-center"
          />
        </div>
      </div>
    </section>
  )
}

export default Hero
