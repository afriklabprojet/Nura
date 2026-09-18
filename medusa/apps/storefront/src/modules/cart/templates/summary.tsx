"use client"

import { Button, Heading } from "@modules/common/components/ui"

import CartTotals from "@modules/common/components/cart-totals"
import Divider from "@modules/common/components/divider"
import DiscountCode from "@modules/checkout/components/discount-code"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import { HttpTypes } from "@medusajs/types"
import { getCheckoutStep } from "@lib/util/checkout-step"
import { hasUnavailableCartItems } from "@lib/util/cart-availability"

type SummaryProps = {
  cart: HttpTypes.StoreCart
  fixCartText?: string
}

const Summary = ({ cart, fixCartText }: SummaryProps) => {
  const step = getCheckoutStep(cart)
  const hasUnavailableItems = hasUnavailableCartItems(cart)

  return (
    <div className="flex flex-col gap-y-4">
      <Heading level="h2" className="text-[2rem] leading-[2.75rem]">
        Récapitulatif
      </Heading>
      <DiscountCode cart={cart} />
      <Divider />
      <CartTotals totals={cart} />
      {hasUnavailableItems ? (
        <div>
          <Button className="h-12 w-full" disabled data-testid="checkout-button">
            Panier à corriger
          </Button>
          <p className="mt-3 text-sm leading-relaxed text-rose-700" role="alert">
            {fixCartText ||
              "Retirez les articles indisponibles avant de passer commande."}
          </p>
        </div>
      ) : (
        <LocalizedClientLink
          href={"/checkout?step=" + step}
          data-testid="checkout-button"
        >
          <Button className="h-12 w-full">Passer commande</Button>
        </LocalizedClientLink>
      )}
    </div>
  )
}

export default Summary
