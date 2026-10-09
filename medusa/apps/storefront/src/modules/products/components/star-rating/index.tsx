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
  const handleKeyDown = (event: React.KeyboardEvent, star: number) => {
    if (!interactive || !onChange) {
      return
    }

    if (event.key === "ArrowRight" || event.key === "ArrowUp") {
      event.preventDefault()
      onChange(star === 5 ? 1 : star + 1)
    } else if (event.key === "ArrowLeft" || event.key === "ArrowDown") {
      event.preventDefault()
      onChange(star === 1 ? 5 : star - 1)
    }
  }

  return (
    <div
      className={clx("flex gap-x-0.5 text-brown", sizeClasses[size])}
      role={interactive ? "radiogroup" : "img"}
      aria-label={interactive ? "Votre note" : `Note : ${value} sur 5 étoiles`}
    >
      {[1, 2, 3, 4, 5].map((star) =>
        interactive ? (
          <button
            key={star}
            type="button"
            role="radio"
            aria-checked={star === value}
            onClick={() => onChange?.(star)}
            onKeyDown={(event) => handleKeyDown(event, star)}
            className="flex h-11 w-11 cursor-pointer items-center justify-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold"
            aria-label={`${star} étoile${star > 1 ? "s" : ""}`}
            tabIndex={star === value || (value === 0 && star === 1) ? 0 : -1}
          >
            {star <= value ? "★" : "☆"}
          </button>
        ) : (
          <span key={star} aria-hidden="true">
            {star <= value ? "★" : "☆"}
          </span>
        )
      )}
    </div>
  )
}

export default StarRating
