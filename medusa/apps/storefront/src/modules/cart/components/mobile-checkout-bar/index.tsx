"use client"

import { convertToLocale } from "@lib/util/money"
import { HttpTypes } from "@medusajs/types"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import { clx } from "@modules/common/components/ui"
import { useEffect, useState } from "react"

/**
 * Keeps the checkout button within thumb's reach on a phone once the
 * summary has scrolled past. The body class lets the floating WhatsApp
 * button move up so the two never overlap.
 */
const MobileCheckoutBar = ({
  cart,
  checkoutHref,
}: {
  cart: HttpTypes.StoreCart
  checkoutHref: string
}) => {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const summary = document.getElementById("cart-summary")

    if (!summary) {
      setVisible(true)
      return
    }

    const observer = new IntersectionObserver(
      ([entry]) => setVisible(!entry.isIntersecting),
      { rootMargin: "-80px 0px 0px 0px" }
    )

    observer.observe(summary)
    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    document.body.classList.add("has-cart-bar")
    return () => document.body.classList.remove("has-cart-bar")
  }, [])

  const count = cart.items?.reduce((total, item) => total + item.quantity, 0) ?? 0

  return (
    <div
      className={clx(
        "fixed inset-x-0 bottom-0 z-50 border-t border-nude bg-bg-alt/95 backdrop-blur transition-transform duration-300 small:hidden",
        visible ? "translate-y-0" : "translate-y-full"
      )}
      style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
    >
      <div className="flex items-center justify-between gap-4 px-5 py-3">
        <div className="flex flex-col">
          <span className="text-[10px] uppercase tracking-[0.2em] text-ui-fg-muted">
            {count} article{count > 1 ? "s" : ""}
          </span>
          <span className="text-lg text-brown">
            {convertToLocale({
              amount: cart.total ?? 0,
              currency_code: cart.currency_code,
            })}
          </span>
        </div>
        <LocalizedClientLink
          href={checkoutHref}
          className="inline-flex h-12 flex-1 items-center justify-center bg-brown px-6 text-[11px] uppercase tracking-[0.2em] text-bg-alt"
          data-testid="mobile-checkout-button"
        >
          Passer commande
        </LocalizedClientLink>
      </div>
    </div>
  )
}

export default MobileCheckoutBar
