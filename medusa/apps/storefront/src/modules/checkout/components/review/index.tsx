"use client"

import { Heading, Text, clx } from "@modules/common/components/ui"

import PaymentButton from "../payment-button"
import { useSearchParams } from "next/navigation"
import { HttpTypes } from "@medusajs/types"
import InlineText from "@modules/common/components/inline-text"

const DEFAULT_CONSENT_TEXT =
  "En cliquant sur le bouton de paiement, vous confirmez avoir lu et accepté nos [conditions générales de vente](/cgv), notre [politique de retours](/livraison-retours) et notre [politique de confidentialité](/confidentialite). Votre commande implique une obligation de paiement."

const Review = ({
  cart,
  consentText,
  jekoErrorText,
}: {
  cart: HttpTypes.StoreCart
  consentText?: string
  jekoErrorText?: string
}) => {
  const searchParams = useSearchParams()

  const isOpen = searchParams.get("step") === "review"

  const paidByGiftcard = !!(
    (cart as unknown as Record<string, unknown>)?.gift_cards && ((cart as unknown as Record<string, unknown>)?.gift_cards as unknown[])?.length > 0 && cart?.total === 0
  )

  const previousStepsCompleted =
    cart.shipping_address &&
    (cart.shipping_methods?.length ?? 0) > 0 &&
    (cart.payment_collection || paidByGiftcard)

  return (
    <div className="bg-bg-alt">
      <div className="flex flex-row items-center justify-between mb-6">
        <Heading
          level="h2"
          className={clx(
            "flex flex-row font-serif text-2xl small:text-3xl gap-x-2 items-baseline",
            {
              "opacity-50 pointer-events-none select-none": !isOpen,
            }
          )}
        >
          Récapitulatif
        </Heading>
      </div>
      {isOpen && previousStepsCompleted && (
        <>
          <div className="flex items-start gap-x-1 w-full mb-6">
            <div className="w-full">
              <Text className="mb-1 txt-medium-plus text-ui-fg-base">
                <InlineText
                  text={consentText || DEFAULT_CONSENT_TEXT}
                  className="underline underline-offset-4"
                />
              </Text>
            </div>
          </div>
          <PaymentButton
            cart={cart}
            data-testid="submit-order-button"
            jekoErrorText={jekoErrorText}
          />
        </>
      )}
    </div>
  )
}

export default Review
