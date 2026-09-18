import ItemsTemplate from "./items"
import Summary from "./summary"
import EmptyCartMessage from "../components/empty-cart-message"
import MobileCheckoutBar from "../components/mobile-checkout-bar"
import SignInPrompt from "../components/sign-in-prompt"
import ShippingPriceNudge from "@modules/shipping/components/free-shipping-price-nudge"
import { HttpTypes, StoreCartShippingOption } from "@medusajs/types"
import { CartMessagesBlock, CheckoutMessagesBlock } from "@lib/data/home-content"
import { getCheckoutStep } from "@lib/util/checkout-step"
import PaymentError from "@modules/common/components/payment-error"

const CartTemplate = ({
  cart,
  customer,
  shippingOptions,
  error,
  cartMessages,
  checkoutMessages,
}: {
  cart: HttpTypes.StoreCart | null
  customer: HttpTypes.StoreCustomer | null
  shippingOptions: StoreCartShippingOption[]
  error?: string
  cartMessages?: CartMessagesBlock
  checkoutMessages?: CheckoutMessagesBlock
}) => {
  if (!cart?.items?.length) {
    return (
      <div className="content-container py-10 small:py-16" data-testid="cart-container">
        <EmptyCartMessage block={cartMessages} />
      </div>
    )
  }

  return (
    <div
      className="content-container py-10 pb-28 small:py-16 small:pb-16"
      data-testid="cart-container"
    >
      <PaymentError
        code={error}
        paymentFailedText={checkoutMessages?.payment_failed_text}
        orderFailedText={checkoutMessages?.order_failed_text}
      />
      <div className="mb-8 flex flex-col gap-3 small:mb-10">
        <span className="eyebrow">Votre sélection</span>
        <h1 className="font-serif text-4xl text-brown small:text-5xl">
          Panier
        </h1>
      </div>

      <div className="grid grid-cols-1 gap-x-10 gap-y-10 min-[1024px]:grid-cols-[1fr_360px] medium:gap-x-20">
        <div className="flex flex-col gap-y-6">
          <ShippingPriceNudge
            variant="inline"
            cart={cart}
            shippingOptions={shippingOptions}
          />
          {!customer && <SignInPrompt block={cartMessages} />}
          <ItemsTemplate cart={cart} />
        </div>

        <div className="relative" id="cart-summary">
          {cart.region && (
            <div className="sticky top-24 border border-nude bg-bg-alt p-6">
              <Summary cart={cart} fixCartText={cartMessages?.fix_cart_text} />
            </div>
          )}
        </div>
      </div>

      <MobileCheckoutBar
        cart={cart}
        checkoutHref={`/checkout?step=${getCheckoutStep(cart)}`}
      />
    </div>
  )
}

export default CartTemplate
