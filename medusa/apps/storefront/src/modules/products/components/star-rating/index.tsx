"use client"

import { clx } from "@modules/common/components/ui"

type StarRatingProps = {
  value: number
  size?: "small" | "medium" | "large"
  interactive?: boolean
  onChange?: (value: number) => void
}

const sizeClasses = {
  small: "text-sm",
  medium: "text-lg",
  large: "text-2xl",
}

const StarRating = ({
  value,
  size = "medium",
  interactive = false,
  onChange,
}: StarRatingProps) => {
  return (
    <div
      className={clx("flex gap-x-0.5 text-brown", sizeClasses[size])}
      role={interactive ? "radiogroup" : "img"}
      aria-label={interactive ? undefined : `Note : ${value} sur 5 étoiles`}
    >
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          disabled={!interactive}
          onClick={() => onChange?.(star)}
          className={clx(interactive ? "cursor-pointer" : "cursor-default")}
          aria-label={interactive ? `${star} étoile${star > 1 ? "s" : ""}` : undefined}
          tabIndex={interactive ? 0 : -1}
        >
          {star <= value ? "★" : "☆"}
        </button>
      ))}
    </div>
  )
}

export default StarRating
