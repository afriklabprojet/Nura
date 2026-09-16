import { SOCIAL_LINKS } from "@lib/constants"
import Reveal from "@modules/common/components/reveal"
import Image from "next/image"

const tiles = [
  { src: "/images/ugc-4.webp", label: "Campagne", span: "small:col-span-2 small:row-span-2" },
  { src: "/images/ugc-1.webp", label: "Rituel du matin", span: "" },
  { src: "/images/ugc-3.webp", label: "Aura Dorée", span: "" },
  { src: "/images/ugc-2.webp", label: "Gestes de soin", span: "" },
  { src: "/images/ugc-5.webp", label: "Textures", span: "" },
]

const Gallery = () => {
  return (
    <section className="border-t border-nude bg-bg-alt">
      <div className="content-container section-y">
        <Reveal className="mb-10 flex flex-col gap-4 small:mb-14 small:flex-row small:items-end small:justify-between">
          <div className="flex flex-col gap-3">
            <span className="eyebrow">Communauté</span>
            <h2 className="font-serif text-4xl text-brown small:text-5xl">
              L&apos;univers Nura
            </h2>
            <p className="max-w-md text-sm leading-relaxed text-ui-fg-subtle">
              Campagnes, routines et gestes du quotidien — l&apos;aura Nura vue
              par la maison et par vous.
            </p>
          </div>
          <a
            href={SOCIAL_LINKS.instagram}
            target="_blank"
            rel="noreferrer"
            className="inline-flex h-12 items-center justify-center self-start border border-brown/30 px-8 text-[11px] uppercase tracking-[0.2em] text-brown transition-colors hover:border-brown"
          >
            Suivre Nura
          </a>
        </Reveal>

        <Reveal>
          <ul className="grid grid-cols-2 gap-3 small:grid-cols-4 small:grid-rows-2">
            {tiles.map((tile) => (
              <li key={tile.src} className={tile.span}>
                <a
                  href={SOCIAL_LINKS.instagram}
                  target="_blank"
                  rel="noreferrer"
                  className="group relative block h-full w-full overflow-hidden"
                >
                  <div className="relative aspect-square h-full w-full">
                    <Image
                      src={tile.src}
                      alt=""
                      fill
                      sizes="(max-width: 900px) 50vw, 25vw"
                      className="object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                  </div>
                  <span className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-ink/70 to-transparent px-4 py-3 text-[10px] uppercase tracking-[0.2em] text-bg-alt opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                    {tile.label}
                  </span>
                </a>
              </li>
            ))}
          </ul>
        </Reveal>

        <div className="mt-6 flex justify-center gap-6 text-[11px] uppercase tracking-[0.2em] text-brown/70">
          <a
            href={SOCIAL_LINKS.instagram}
            target="_blank"
            rel="noreferrer"
            className="link-underline hover:text-brown"
          >
            Instagram
          </a>
          <a
            href={SOCIAL_LINKS.tiktok}
            target="_blank"
            rel="noreferrer"
            className="link-underline hover:text-brown"
          >
            TikTok
          </a>
        </div>
      </div>
    </section>
  )
}

export default Gallery
