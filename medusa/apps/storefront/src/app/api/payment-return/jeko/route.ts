import { sdk } from "@lib/config"
import { placeOrder } from "@lib/data/cart"
import { getAuthHeaders, setCartId } from "@lib/data/cookies"
import { HttpTypes } from "@medusajs/types"
import { unstable_rethrow } from "next/navigation"
import { NextRequest, NextResponse } from "next/server"

export async function GET(req: NextRequest) {
  const { origin, searchParams } = req.nextUrl

  const cartId = searchParams.get("cart_id")
  const sessionId = searchParams.get("session_id")
  const countryCode = searchParams.get("country_code")
  const outcome = searchParams.get("outcome")

  // Without a country code the middleware resolves the customer's region and
  // prefixes it; either way every redirect below stays on this origin.
  const prefix =
    countryCode && /^[a-z]{2}$/i.test(countryCode)
      ? `/${countryCode.toLowerCase()}`
      : ""
  const rejected = () =>
    NextResponse.redirect(`${origin}${prefix}/cart?error=payment_failed`)

  if (!cartId || !sessionId) {
    return rejected()
  }

  const cart = await sdk.client
    .fetch<HttpTypes.StoreCartResponse>(`/store/carts/${cartId}`, {
      method: "GET",
      query: { fields: "payment_collection.payment_sessions.data" },
      headers: { ...(await getAuthHeaders()) },
      cache: "no-store",
    })
    .then(({ cart }) => cart)
    .catch(() => null)

  const paymentSession = cart?.payment_collection?.payment_sessions?.find(
    (session) =>
      session.id === sessionId &&
      session.provider_id.startsWith("pp_jeko_") &&
      session.data?.reference === sessionId &&
      !!session.data?.paymentRequestId
  )

  if (!paymentSession) {
    return rejected()
  }

  await setCartId(cartId)

  // Jèko only sends the customer back to `successUrl` once the redirect
  // page itself confirms the wallet charge — `errorUrl` covers the customer
  // cancelling or the charge being declined. Either way, final confirmation
  // still comes from the webhook (or a status check during order
  // completion below), this outcome is just which URL Jèko sent them to.
  if (outcome !== "success") {
    return NextResponse.redirect(
      `${origin}${prefix}/checkout?step=payment&error=payment_failed`
    )
  }

  try {
    await placeOrder(cartId)
  } catch (error) {
    unstable_rethrow(error)

    return NextResponse.redirect(`${origin}${prefix}/cart?error=order_failed`)
  }

  // Only reached when the cart did not convert into an order.
  return NextResponse.redirect(`${origin}${prefix}/cart?error=order_failed`)
}
