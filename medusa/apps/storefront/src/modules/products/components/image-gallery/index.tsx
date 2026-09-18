"use client"

import {
  ChevronLeft,
  ChevronRight,
  MagnifyingGlass,
  XMark,
} from "@medusajs/icons"
import { HttpTypes } from "@medusajs/types"
import { Dialog } from "@headlessui/react"
import { clx } from "@modules/common/components/ui"
import Image from "next/image"
import { useCallback, useEffect, useRef, useState } from "react"

type ImageGalleryProps = {
  images: HttpTypes.StoreProductImage[]
  productTitle: string
}

const ImageGallery = ({ images, productTitle }: ImageGalleryProps) => {
  const [openIndex, setOpenIndex] = useState<number | null>(null)
  const [slide, setSlide] = useState(0)
  const trackRef = useRef<HTMLDivElement>(null)

  const close = useCallback(() => setOpenIndex(null), [])
  const showPrev = useCallback(
    () =>
      setOpenIndex((i) =>
        i === null ? null : (i - 1 + images.length) % images.length
      ),
    [images.length]
  )
  const showNext = useCallback(
    () => setOpenIndex((i) => (i === null ? null : (i + 1) % images.length)),
    [images.length]
  )

  useEffect(() => {
    if (openIndex === null) {
      return
    }

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") close()
      if (e.key === "ArrowLeft") showPrev()
      if (e.key === "ArrowRight") showNext()
    }

    document.addEventListener("keydown", onKeyDown)
    document.body.style.overflow = "hidden"
    return () => {
      document.removeEventListener("keydown", onKeyDown)
      document.body.style.overflow = ""
    }
  }, [openIndex, close, showPrev, showNext])

  const getAlt = (index: number) =>
    index === 0 ? productTitle : `${productTitle} — photo ${index + 1}`

  const onTrackScroll = () => {
    const track = trackRef.current
    if (!track) return
    setSlide(Math.round(track.scrollLeft / track.clientWidth))
  }

  const scrollToSlide = (index: number) => {
    const track = trackRef.current
    if (!track) return
    track.scrollTo({ left: index * track.clientWidth, behavior: "smooth" })
  }

  if (images.length === 0) {
    return (
      <div className="relative aspect-[4/5] w-full overflow-hidden bg-gradient-to-br from-[#F3E8DA] via-[#EFE0CE] to-[#E7D3C0]">
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="select-none font-serif text-7xl leading-none text-brown/35">
            N
          </span>
        </div>
      </div>
    )
  }

  return (
    <div className="relative">
      {/* Mobile: swipeable carousel */}
      <div className="small:hidden">
        <div
          ref={trackRef}
          onScroll={onTrackScroll}
          className="no-scrollbar flex w-full snap-x snap-mandatory overflow-x-auto"
          role="region"
          aria-label={`Galerie photo de ${productTitle}`}
        >
          {images.map((image, index) => (
            <button
              key={image.id}
              type="button"
              onClick={() => setOpenIndex(index)}
              aria-label={`Agrandir ${getAlt(index)}`}
              className="relative aspect-[4/5] max-h-[70dvh] w-full flex-none snap-center bg-nude/20"
            >
              {!!image.url && (
                <Image
                  src={image.url}
                  alt={getAlt(index)}
                  preload={index === 0}
                  fill
                  sizes="100vw"
                  className="object-contain object-center"
                />
              )}
              <span className="absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-full bg-bg-alt/90 text-brown shadow-sm" aria-hidden="true">
                <MagnifyingGlass className="h-4 w-4" />
              </span>
            </button>
          ))}
        </div>
        {images.length > 1 && (
          <div className="mt-2 flex h-10 items-center justify-between px-1">
            <span className="text-xs tabular-nums text-ui-fg-muted" aria-live="polite">
              {slide + 1} / {images.length}
            </span>
            <div className="flex items-center" aria-label="Choisir une photo">
              {images.map((image, index) => (
                <button
                  key={image.id}
                  type="button"
                  onClick={() => scrollToSlide(index)}
                  aria-label={`Afficher la photo ${index + 1}`}
                  aria-current={index === slide ? "true" : undefined}
                  className="flex h-10 w-8 items-center justify-center"
                >
                  <span
                    className={clx(
                      "h-1 w-6 transition-colors",
                      index === slide ? "bg-brown" : "bg-nude"
                    )}
                  />
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Desktop: editorial stack */}
      <div className="hidden small:flex small:flex-col small:gap-y-3">
        {images.map((image, index) => (
          <button
            key={image.id}
            id={image.id}
            type="button"
            onClick={() => setOpenIndex(index)}
            aria-label={`Agrandir ${getAlt(index)}`}
            className="relative aspect-[4/5] w-full cursor-zoom-in overflow-hidden bg-nude/20"
          >
            {!!image.url && (
              <Image
                src={image.url}
                preload={index === 0}
                className="object-cover object-center transition-transform duration-700 hover:scale-[1.03]"
                alt={getAlt(index)}
                fill
                sizes="(max-width: 1280px) 60vw, 720px"
              />
            )}
          </button>
        ))}
      </div>

      <Dialog
        open={openIndex !== null}
        onClose={close}
        className="fixed inset-0 z-[1000] bg-ink/95"
      >
        <div
          className="absolute inset-0"
          onClick={close}
          aria-hidden="true"
        />
        {openIndex !== null && images[openIndex]?.url && (
          <Dialog.Panel className="pointer-events-none relative flex h-full w-full items-center justify-center">
            <Dialog.Title className="sr-only">
              {getAlt(openIndex)}
            </Dialog.Title>
            <button
              type="button"
              onClick={close}
              aria-label="Fermer"
              className="pointer-events-auto absolute right-4 top-4 z-10 flex h-12 w-12 items-center justify-center text-bg-alt hover:text-gold small:right-6 small:top-6"
            >
              <XMark className="h-8 w-8" />
            </button>

            {images.length > 1 && (
              <button
                type="button"
                onClick={showPrev}
                aria-label="Image précédente"
                className="pointer-events-auto absolute left-2 z-10 flex h-12 w-12 items-center justify-center text-bg-alt hover:text-gold small:left-8"
              >
                <ChevronLeft className="h-8 w-8" />
              </button>
            )}

            <div className="pointer-events-auto relative h-[80dvh] w-[82vw] max-w-3xl">
              <Image
                src={images[openIndex].url!}
                alt={getAlt(openIndex)}
                fill
                sizes="90vw"
                style={{ objectFit: "contain" }}
              />
            </div>

            {images.length > 1 && (
              <button
                type="button"
                onClick={showNext}
                aria-label="Image suivante"
                className="pointer-events-auto absolute right-2 z-10 flex h-12 w-12 items-center justify-center text-bg-alt hover:text-gold small:right-8"
              >
                <ChevronRight className="h-8 w-8" />
              </button>
            )}

            {images.length > 1 && (
              <div className="absolute bottom-6 txt-small text-bg-alt">
                {openIndex + 1} / {images.length}
              </div>
            )}
          </Dialog.Panel>
        )}
      </Dialog>
    </div>
  )
}

export default ImageGallery
