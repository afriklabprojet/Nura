import { CheckoutMessagesBlock } from "@lib/data/home-content"
import { listCartShippingMethods } from "@lib/data/fulfillment"
import { listCartPaymentMethods } from "@lib/data/payment"
import { HttpTypes } from "@medusajs/types"
import Addresses from "@modules/checkout/components/addresses"
import GiftOption from "@modules/checkout/components/gift-option"
import Payment from "@modules/checkout/components/payment"
import Review from "@modules/checkout/components/review"
import Shipping from "@modules/checkout/components/shipping"
import LocalizedClientLink from "@modules/common/components/localized-client-link"

export default async function CheckoutForm({
  cart,
  customer,
  messages,
}: {
  cart: HttpTypes.StoreCart | null
  customer: HttpTypes.StoreCustomer | null
  messages?: CheckoutMessagesBlock
}) {
  if (!cart) {
    return null
  }

  const shippingMethods = await listCartShippingMethods(cart.id)
  const paymentMethods = await listCartPaymentMethods(cart.region?.id ?? "")

  if (!shippingMethods || !paymentMethods) {
    return (
      <div className="border border-nude bg-bg-alt p-6" role="alert">
        <h2 className="font-serif text-2xl text-brown">
          {messages?.unavailable_title ||
            "Le checkout est momentanément indisponible"}
        </h2>
        <p className="mt-2 text-sm text-ui-fg-subtle">
          {messages?.unavailable_text ||
            "Nous n'avons pas pu charger les options de livraison ou de paiement. Réessayez dans quelques instants ou contactez notre équipe."}
        </p>
        <LocalizedClientLink
          href="/contact"
          className="mt-4 inline-flex min-h-11 items-center text-sm underline underline-offset-4"
        >
          Contacter le service client
        </LocalizedClientLink>
      </div>
    )
  }

  return (
    <div className="w-full grid grid-cols-1 gap-y-8">
      <Addresses cart={cart} customer={customer} />

      <Shipping cart={cart} availableShippingMethods={shippingMethods} messages={messages} />

      <GiftOption cart={cart} text={messages?.gift_option_text} />

      <Payment cart={cart} availablePaymentMethods={paymentMethods} messages={messages} />

      <Review
        cart={cart}
        consentText={messages?.consent_text}
        jekoErrorText={messages?.jeko_error}
      />
    </div>
  )
}
