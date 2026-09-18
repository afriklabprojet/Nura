import { retrieveCart } from "@lib/data/cart"
import { retrieveCustomer } from "@lib/data/customer"
import { getHomeContent } from "@lib/data/home-content"
import CheckoutSteps from "@modules/checkout/components/checkout-steps"
import PaymentWrapper from "@modules/checkout/components/payment-wrapper"
import CheckoutForm from "@modules/checkout/templates/checkout-form"
import CheckoutSummary from "@modules/checkout/templates/checkout-summary"
import { Heading } from "@modules/common/components/ui"
import { Metadata } from "next"
import { notFound } from "next/navigation"
import { Suspense } from "react"
import PaymentError from "@modules/common/components/payment-error"

export const metadata: Metadata = {
  title: "Commande",
}

export default async function Checkout(props: {
  searchParams: Promise<{ error?: string }>
}) {
  const { error } = await props.searchParams
  const cart = await retrieveCart()

  if (!cart) {
    return notFound()
  }

  const customer = await retrieveCustomer()
  const { blocks } = await getHomeContent()

  return (
    <div className="content-container grid grid-cols-1 gap-x-10 gap-y-10 py-10 small:grid-cols-[1fr_400px] medium:gap-x-20 small:py-14">
      <div>
        <Heading level="h1" className="mb-8 text-3xl xsmall:text-4xl">
          Finaliser ma commande
        </Heading>
        <PaymentError
          code={error}
          paymentFailedText={blocks.checkout_messages?.payment_failed_text}
          orderFailedText={blocks.checkout_messages?.order_failed_text}
        />
        <Suspense fallback={null}>
          <CheckoutSteps />
        </Suspense>
        <PaymentWrapper cart={cart}>
          <CheckoutForm
            cart={cart}
            customer={customer}
            messages={blocks.checkout_messages}
          />
        </PaymentWrapper>
      </div>
      <CheckoutSummary cart={cart} messages={blocks.checkout_messages} />
    </div>
  )
}
