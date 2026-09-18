import { createHmac, timingSafeEqual } from "node:crypto"
import { MedusaError } from "@medusajs/framework/utils"

const ORDER_ACCESS_TTL_MS = 30 * 24 * 60 * 60 * 1000

export const createOrderAccessToken = (
  orderId: string,
  now = Date.now(),
  ttlMs = ORDER_ACCESS_TTL_MS
) => {
  const secret = process.env.ORDER_ACCESS_SECRET

  if (!secret) {
    throw new MedusaError(
      MedusaError.Types.INVALID_DATA,
      "ORDER_ACCESS_SECRET is required to sign order access links"
    )
  }

  const expiresAt = now + ttlMs
  const signature = createHmac("sha256", secret)
    .update(`${orderId}.${expiresAt}`)
    .digest("hex")

  return `${expiresAt}.${signature}`
}

export const verifyOrderAccessToken = (
  orderId: string,
  token?: string,
  now = Date.now()
) => {
  const secret = process.env.ORDER_ACCESS_SECRET
  const [expiresAt, signature, extraPart] = token?.split(".") ?? []
  const expiration = Number(expiresAt)

  if (
    !secret ||
    !expiresAt ||
    !signature ||
    extraPart ||
    !Number.isSafeInteger(expiration) ||
    expiration <= now ||
    !/^[a-f0-9]{64}$/i.test(signature)
  ) {
    return false
  }

  const expected = createHmac("sha256", secret)
    .update(`${orderId}.${expiresAt}`)
    .digest("hex")

  return timingSafeEqual(Buffer.from(signature, "hex"), Buffer.from(expected, "hex"))
}