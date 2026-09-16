import { SOCIAL_LINKS } from "@lib/constants"
import Image from "next/image"

const images = [1, 2, 3, 4, 5, 6]

const Gallery = () => {
  return (
    <section className="border-t border-nude bg-bg-alt">
      <div className="content-container section-y">
        <div className="mb-10 flex flex-col items-center gap-3 text-center small:mb-14">
          <span className="eyebrow">Communauté</span>
          <h2 className="font-serif text-4xl text-brown small:text-5xl">
            Dans l&apos;aura Nura
          </h2>
          <a
            href={SOCIAL_LINKS.instagram}
            target="_blank"
            rel="noreferrer"
            className="link-underline text-[11px] uppercase tracking-[0.2em] text-gold hover:text-brown"
          >
            Nous suivre sur Instagram
          </a>
        </div>

        <ul className="grid grid-cols-2 gap-2 small:grid-cols-6 small:gap-3">
          {images.map((n) => (
            <li key={n} className="relative aspect-square overflow-hidden">
              <a
                href={SOCIAL_LINKS.instagram}
                target="_blank"
                rel="noreferrer"
                className="group block h-full w-full"
              >
                <Image
                  src={`/images/ugc-${n}.jpg`}
                  alt=""
                  fill
                  sizes="(max-width: 900px) 50vw, 16vw"
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                />
              </a>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}

export default Gallery
