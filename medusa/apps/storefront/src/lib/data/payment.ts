"use server"

import { sdk } from "@lib/config"
import { getAuthHeaders, getCacheOptions } from "./cookies"
import { HttpTypes } from "@medusajs/types"
import { isManual, isStripeLike } from "@lib/constants"

const hasStripeBrowserKey = Boolean(
  process.env.NEXT_PUBLIC_STRIPE_KEY ||
    process.env.NEXT_PUBLIC_MEDUSA_PAYMENTS_PUBLISHABLE_KEY
)

export const listCartPaymentMethods = async (regionId: string) => {
  const headers = {
    ...(await getAuthHeaders()),
  }

  const next = {
    ...(await getCacheOptions("payment_providers")),
  }

  return sdk.client
    .fetch<HttpTypes.StorePaymentProviderListResponse>(
      `/store/payment-providers`,
      {
        method: "GET",
        query: { region_id: regionId },
        headers,
        next,
        cache: "force-cache",
      }
    )
    .then(({ payment_providers }) =>
      payment_providers
        .filter(
          (provider) =>
            (process.env.NODE_ENV !== "production" || !isManual(provider.id)) &&
            (!isStripeLike(provider.id) || hasStripeBrowserKey)
        )
        .sort((a, b) => {
          return a.id > b.id ? 1 : -1
        })
    )
    .catch(() => {
      return null
    })
}
