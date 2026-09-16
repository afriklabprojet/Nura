"use client"

import { ChevronLeft, ChevronRight, XMark } from "@medusajs/icons"
import { HttpTypes } from "@medusajs/types"
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
        >
          {images.map((image, index) => (
            <div
              key={image.id}
              className="relative aspect-[4/5] w-full flex-none snap-center bg-nude/20"
            >
              {!!image.url && (
                <Image
                  src={image.url}
                  alt={getAlt(index)}
                  priority={index === 0}
                  fill
                  sizes="100vw"
                  className="object-cover object-center"
                />
              )}
            </div>
          ))}
        </div>
        {images.length > 1 && (
          <div className="mt-4 flex justify-center gap-2">
            {images.map((image, index) => (
              <span
                key={image.id}
                className={clx(
                  "h-1 w-6 transition-colors",
                  index === slide ? "bg-brown" : "bg-nude"
                )}
              />
            ))}
          </div>
        )}
      </div>

      {/* Desktop: editorial stack */}
      <div className="hidden small:flex small:flex-col small:gap-y-3">
        {images.map((image, index) => (
          <div
            key={image.id}
            id={image.id}
            onClick={() => setOpenIndex(index)}
            className="relative aspect-[4/5] w-full cursor-zoom-in overflow-hidden bg-nude/20"
          >
            {!!image.url && (
              <Image
                src={image.url}
                priority={index <= 1}
                className="object-cover object-center transition-transform duration-700 hover:scale-[1.03]"
                alt={getAlt(index)}
                fill
                sizes="(max-width: 1280px) 60vw, 720px"
              />
            )}
          </div>
        ))}
      </div>

      {openIndex !== null && images[openIndex]?.url && (
        <div
          className="fixed inset-0 z-[1000] flex items-center justify-center bg-ink/95"
          role="dialog"
          aria-modal="true"
          onClick={close}
        >
          <button
            type="button"
            onClick={close}
            aria-label="Fermer"
            className="absolute right-6 top-6 text-bg-alt hover:text-gold"
          >
            <XMark className="h-8 w-8" />
          </button>

          {images.length > 1 && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation()
                showPrev()
              }}
              aria-label="Image précédente"
              className="absolute left-4 text-bg-alt hover:text-gold small:left-8"
            >
              <ChevronLeft className="h-8 w-8" />
            </button>
          )}

          <div
            className="relative h-[80vh] w-[90vw] max-w-3xl"
            onClick={(e) => e.stopPropagation()}
          >
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
              onClick={(e) => {
                e.stopPropagation()
                showNext()
              }}
              aria-label="Image suivante"
              className="absolute right-4 text-bg-alt hover:text-gold small:right-8"
            >
              <ChevronRight className="h-8 w-8" />
            </button>
          )}

          {images.length > 1 && (
            <div className="absolute bottom-6 txt-small text-bg-alt">
              {openIndex + 1} / {images.length}
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default ImageGallery
