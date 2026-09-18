import { listCartOptions, retrieveCart } from "@lib/data/cart"
import { retrieveCustomer } from "@lib/data/customer"
import { getHomeContent } from "@lib/data/home-content"
import { StoreCartShippingOption } from "@medusajs/types"
import CartTemplate from "@modules/cart/templates"
import { Metadata } from "next"
import { notFound } from "next/navigation"

export const metadata: Metadata = {
  title: "Panier",
  description: "Consultez votre panier.",
  robots: { index: false, follow: false },
}

export default async function Cart(props: {
  searchParams: Promise<{ error?: string }>
}) {
  const { error } = await props.searchParams
  const cart = await retrieveCart().catch((error) => {
    console.error(error)
    return notFound()
  })

  const customer = await retrieveCustomer()
  const { blocks } = await getHomeContent()

  let shippingOptions: StoreCartShippingOption[] = []

  if (cart) {
    const { shipping_options } = await listCartOptions()
    shippingOptions = shipping_options
  }

  return (
    <CartTemplate
      cart={cart}
      customer={customer}
      shippingOptions={shippingOptions}
      error={error}
      cartMessages={blocks.cart_messages}
      checkoutMessages={blocks.checkout_messages}
    />
  )
}
