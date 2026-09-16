"use server"

import { sdk } from "@lib/config"
import { getAuthHeaders } from "./cookies"

export async function getMyReferralCode(): Promise<string | null> {
  const authHeaders = await getAuthHeaders()
  if (!authHeaders) {
    return null
  }

  return sdk.client
    .fetch<{ code: string }>("/store/customers/me/referral-code", {
      method: "GET",
      headers: authHeaders,
      cache: "no-store",
    })
    .then(({ code }) => code)
    .catch(() => null)
}
