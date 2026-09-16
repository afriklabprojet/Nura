import { clx } from "@modules/common/components/ui"
import Image from "next/image"
import React from "react"

type ThumbnailProps = {
  thumbnail?: string | null
  images?: { url?: string }[] | null
  size?: "small" | "medium" | "large" | "full" | "square"
  isFeatured?: boolean
  className?: string
  /** Second image revealed when the surrounding `group` is hovered. */
  hoverImage?: string | null
  /** Product (or line item) title, used as the image's alt text. */
  title?: string | null
  "data-testid"?: string
}

const Thumbnail: React.FC<ThumbnailProps> = ({
  thumbnail,
  images,
  size = "small",
  isFeatured,
  className,
  hoverImage,
  title,
  "data-testid": dataTestid,
}) => {
  const initialImage = thumbnail || images?.[0]?.url

  return (
    <div
      className={clx(
        "relative w-full overflow-hidden bg-nude/20",
        className,
        {
          "aspect-[4/5]": isFeatured,
          "aspect-[9/16]": !isFeatured && size !== "square",
          "aspect-[1/1]": size === "square",
          "w-[180px]": size === "small",
          "w-[290px]": size === "medium",
          "w-[440px]": size === "large",
          "w-full": size === "full",
        }
      )}
      data-testid={dataTestid}
    >
      <ImageOrPlaceholder image={initialImage} title={title} size={size} />
      {hoverImage && hoverImage !== initialImage && (
        <Image
          src={hoverImage}
          alt=""
          aria-hidden="true"
          className="absolute inset-0 object-cover object-center opacity-0 transition-opacity duration-500 group-hover:opacity-100"
          draggable={false}
          quality={50}
          sizes="(max-width: 512px) 50vw, (max-width: 900px) 33vw, 25vw"
          fill
        />
      )}
    </div>
  )
}

const ImageOrPlaceholder = ({
  image,
  title,
  size,
}: Pick<ThumbnailProps, "size" | "title"> & { image?: string }) => {
  return image ? (
    <Image
      src={image}
      alt={title || "Photo du produit"}
      className="absolute inset-0 object-cover object-center transition-transform duration-700 ease-out group-hover:scale-[1.03]"
      draggable={false}
      quality={60}
      sizes="(max-width: 512px) 50vw, (max-width: 900px) 33vw, 25vw"
      fill
    />
  ) : (
    <div className="w-full h-full absolute inset-0 flex items-center justify-center bg-gradient-to-br from-[#F3E8DA] via-[#EFE0CE] to-[#E7D3C0]">
      <span
        className={clx(
          "font-serif text-brown/35 select-none leading-none",
          size === "small" ? "text-3xl" : "text-6xl"
        )}
      >
        N
      </span>
    </div>
  )
}

export default Thumbnail
