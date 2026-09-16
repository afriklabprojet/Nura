"use client"

import { addToWishlist, removeFromWishlist } from "@lib/data/wishlist"
import { Heart } from "@medusajs/icons"
import { clx } from "@modules/common/components/ui"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import { useState, useTransition } from "react"

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
  const [isPending, startTransition] = useTransition()

  if (!isLoggedIn) {
    return (
      <LocalizedClientLink
        href="/account"
        className="flex items-center justify-center h-10 w-10 rounded-sm border border-ui-border-base hover:border-brown shrink-0"
        title="Connectez-vous pour ajouter aux favoris"
        data-testid="wishlist-login-link"
      >
        <Heart />
      </LocalizedClientLink>
    )
  }

  const toggle = () => {
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
      }
    })
  }

  return (
    <button
      type="button"
      onClick={toggle}
      disabled={isPending}
      className={clx(
        "flex items-center justify-center h-10 w-10 rounded-sm border border-ui-border-base hover:border-brown shrink-0 transition-colors disabled:opacity-50",
        saved && "border-gold text-gold"
      )}
      title={saved ? "Retirer des favoris" : "Ajouter aux favoris"}
      data-testid="wishlist-button"
    >
      <Heart fill={saved ? "currentColor" : "none"} />
    </button>
  )
}

export default WishlistButton
