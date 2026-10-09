"use client"

import { addToWishlist, removeFromWishlist } from "@lib/data/wishlist"
import { Heart } from "@medusajs/icons"
import { clx } from "@modules/common/components/ui"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import { useState, useTransition } from "react"
import { usePathname } from "next/navigation"

type WishlistButtonProps = {
  productId: string
  isLoggedIn: boolean
  isInWishlist: boolean
}

const WishlistButton = ({
  productId,
  isLoggedIn,
  isInWishlist,
}: WishlistButtonProps) => {
  const [saved, setSaved] = useState(isInWishlist)
  const [error, setError] = useState<string | null>(null)
  const [isPending, startTransition] = useTransition()
  const pathname = usePathname()

  if (!isLoggedIn) {
    return (
      <LocalizedClientLink
        href={`/account?redirect=${encodeURIComponent(pathname)}`}
        className="flex h-11 w-11 shrink-0 items-center justify-center rounded-sm border border-ui-border-base hover:border-brown"
        title="Connectez-vous pour ajouter aux favoris"
        aria-label="Se connecter pour ajouter aux favoris"
        data-testid="wishlist-login-link"
      >
        <Heart />
      </LocalizedClientLink>
    )
  }

  const toggle = () => {
    setError(null)
    const next = !saved
    setSaved(next)
    startTransition(async () => {
      try {
        if (next) {
          await addToWishlist(productId)
        } else {
          await removeFromWishlist(productId)
        }
      } catch {
        // Revert the optimistic update if the request failed.
        setSaved(!next)
        setError("Mise à jour des favoris impossible. Réessayez.")
      }
    })
  }

  return (
    <div className="relative shrink-0">
    <button
      type="button"
      onClick={toggle}
      disabled={isPending}
      className={clx(
        "flex h-11 w-11 items-center justify-center rounded-sm border border-ui-border-base transition-colors hover:border-brown disabled:opacity-50",
        saved && "border-gold text-gold"
      )}
      title={saved ? "Retirer des favoris" : "Ajouter aux favoris"}
      aria-label={saved ? "Retirer des favoris" : "Ajouter aux favoris"}
      data-testid="wishlist-button"
    >
      <Heart fill={saved ? "currentColor" : "none"} />
    </button>
      {error && <span className="absolute right-0 top-full z-10 mt-2 w-56 bg-bg-alt p-2 text-xs text-rose-700" role="alert">{error}</span>}
    </div>
  )
}

export default WishlistButton
