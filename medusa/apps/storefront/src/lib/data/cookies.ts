import "server-only"
import { createHmac } from "crypto"
import { cookies as nextCookies } from "next/headers"
import { MARKET_PREF_COOKIE, REFERRAL_CODE_COOKIE } from "@lib/constants"
import { verifySignedOrderAccessToken } from "@lib/util/order-access-token"

export const getAuthHeaders = async (): Promise<
  { authorization: string } | Record<string, never>
> => {
  try {
    const cookies = await nextCookies()
    const token = cookies.get("_medusa_jwt")?.value

    if (!token) {
      return {}
    }

    return { authorization: `Bearer ${token}` }
  } catch {
    return {}
  }
}

export const getCacheTag = async (tag: string): Promise<string> => {
  try {
    const cookies = await nextCookies()
    const cacheId = cookies.get("_medusa_cache_id")?.value

    if (!cacheId) {
      return ""
    }

    return `${tag}-${cacheId}`
  } catch {
    return ""
  }
}

export const getCacheOptions = async (
  tag: string
): Promise<{ tags: string[] } | Record<string, never>> => {
  if (typeof window !== "undefined") {
    return {}
  }

  const cacheTag = await getCacheTag(tag)

  if (!cacheTag) {
    return {}
  }

  return { tags: [`${cacheTag}`] }
}

// `sameSite: "lax"` rather than `"strict"`: the customer returns from a
// redirect-based payment method (iDEAL, Bancontact, ...) via a cross-site
// top-level navigation. A "strict" cookie is withheld on that navigation, so
// the storefront would see a logged-out, cartless visitor and render a 404 for
// the checkout page instead of resuming the order. "lax" is sent on top-level
// GET navigations while still blocking cross-site subrequests.
export const setAuthToken = async (token: string) => {
  const cookies = await nextCookies()
  cookies.set("_medusa_jwt", token, {
    maxAge: 60 * 60 * 24 * 7,
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
  })
}

export const removeAuthToken = async () => {
  const cookies = await nextCookies()
  cookies.set("_medusa_jwt", "", {
    maxAge: -1,
  })
}

export type PendingCustomer = {
  email: string
  first_name?: string
  last_name?: string
  phone?: string
}

// During the email verification flow the customer record isn't created until
// the customer verifies their email and logs in. We temporarily persist the
// extra signup fields in a cookie so they survive the customer leaving to open
// their inbox, and read them back when creating the customer at login.
export const setPendingCustomer = async (customer: PendingCustomer) => {
  const cookies = await nextCookies()
  cookies.set("_medusa_pending_customer", JSON.stringify(customer), {
    maxAge: 60 * 60 * 24,
    httpOnly: true,
    sameSite: "strict",
    secure: process.env.NODE_ENV === "production",
  })
}

export const getPendingCustomer = async (): Promise<PendingCustomer | null> => {
  const cookies = await nextCookies()
  const value = cookies.get("_medusa_pending_customer")?.value

  if (!value) {
    return null
  }

  try {
    return JSON.parse(value) as PendingCustomer
  } catch {
    return null
  }
}

export const removePendingCustomer = async () => {
  const cookies = await nextCookies()
  cookies.set("_medusa_pending_customer", "", {
    maxAge: -1,
  })
}

// Set when the customer explicitly picks a country (CountrySelect →
// updateRegion). The storefront middleware checks this before any
// GeoIP/locale-based detection, so an explicit choice always wins and
// survives a future visit with no country in the URL yet.
export const setMarketPreference = async (countryCode: string) => {
  const cookies = await nextCookies()
  cookies.set(MARKET_PREF_COOKIE, countryCode, {
    maxAge: 60 * 60 * 24 * 365,
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
  })
}

// Set by the middleware when a visitor arrives via `?ref=CODE`. Read once,
// at signup, to attribute the new account to whoever referred them.
export const getReferralCode = async () => {
  const cookies = await nextCookies()
  return cookies.get(REFERRAL_CODE_COOKIE)?.value
}

export const getCartId = async () => {
  const cookies = await nextCookies()
  return cookies.get("_medusa_cart_id")?.value
}

// See the note on `setAuthToken`: `sameSite: "lax"` so the cart cookie survives
// the cross-site return navigation from a redirect-based payment method.
export const setCartId = async (cartId: string) => {
  const cookies = await nextCookies()
  cookies.set("_medusa_cart_id", cartId, {
    maxAge: 60 * 60 * 24 * 7,
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
  })
}

export const removeCartId = async () => {
  const cookies = await nextCookies()
  cookies.set("_medusa_cart_id", "", {
    maxAge: -1,
  })
}

const getOrderAccessSecret = () => {
  const secret = process.env.ORDER_ACCESS_SECRET

  if (!secret) {
    throw new Error("ORDER_ACCESS_SECRET is required to access guest orders")
  }

  return secret
}

export const setOrderAccessToken = async (orderId: string) => {
  const expiresAt = Date.now() + 60 * 60 * 1000
  const signature = createHmac("sha256", getOrderAccessSecret())
    .update(`${orderId}.${expiresAt}`)
    .digest("hex")
  const cookies = await nextCookies()

  cookies.set(`_nura_order_${orderId}`, `${expiresAt}.${signature}`, {
    maxAge: 60 * 60,
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
  })
}

export const getOrderAccessToken = async (orderId: string) => {
  const cookies = await nextCookies()
  return cookies.get(`_nura_order_${orderId}`)?.value
}

export const verifyOrderAccessToken = (
  orderId: string,
  token: string,
  now = Date.now()
) => verifySignedOrderAccessToken(orderId, token, getOrderAccessSecret(), now)
