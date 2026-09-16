import { retrieveCart } from "@lib/data/cart"
import { retrieveCustomer } from "@lib/data/customer"
import CheckoutSteps from "@modules/checkout/components/checkout-steps"
import PaymentWrapper from "@modules/checkout/components/payment-wrapper"
import CheckoutForm from "@modules/checkout/templates/checkout-form"
import CheckoutSummary from "@modules/checkout/templates/checkout-summary"
import { Metadata } from "next"
import { notFound } from "next/navigation"
import { Suspense } from "react"

export const metadata: Metadata = {
  title: "Commande",
}

export default async function Checkout() {
  const cart = await retrieveCart()

  if (!cart) {
    return notFound()
  }

  const customer = await retrieveCustomer()

  return (
    <div className="content-container grid grid-cols-1 gap-x-10 gap-y-10 py-10 small:grid-cols-[1fr_400px] medium:gap-x-20 small:py-14">
      <div>
        <Suspense fallback={null}>
          <CheckoutSteps />
        </Suspense>
        <PaymentWrapper cart={cart}>
          <CheckoutForm cart={cart} customer={customer} />
        </PaymentWrapper>
      </div>
      <CheckoutSummary cart={cart} />
    </div>
  )
}
