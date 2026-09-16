import { placeOrder } from "@lib/data/cart"
import { setCartId } from "@lib/data/cookies"
import { unstable_rethrow } from "next/navigation"
import { NextRequest, NextResponse } from "next/server"

export async function GET(req: NextRequest) {
  const { origin, searchParams } = req.nextUrl

  const cartId = searchParams.get("cart_id")
  const countryCode = searchParams.get("country_code")
  const outcome = searchParams.get("outcome")

  // Without a country code the middleware resolves the customer's region and
  // prefixes it; either way every redirect below stays on this origin.
  const prefix = countryCode ? `/${countryCode}` : ""

  if (!cartId) {
    return NextResponse.redirect(`${origin}${prefix}/cart?error=payment_failed`)
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
