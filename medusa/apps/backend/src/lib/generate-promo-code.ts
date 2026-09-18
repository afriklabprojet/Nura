import crypto from "node:crypto"
import { MedusaError } from "@medusajs/framework/utils"

// Human-friendly, hard-to-guess code: NURA-XXXX-XXXX (uppercase alphanumeric,
// excludes 0/O/1/I to avoid transcription mistakes when read aloud or typed
// from a printed card).
const ALPHABET = "23456789ABCDEFGHJKLMNPQRSTUVWXYZ"

export function generatePromoCode() {
  const group = () =>
    Array.from({ length: 4 }, () => ALPHABET[crypto.randomInt(ALPHABET.length)]).join("")
  return `NURA-${group()}-${group()}`
}

export function generateIdempotentPromoCode(namespace: string, key: string) {
  const secret = process.env.ORDER_ACCESS_SECRET

  if (!secret) {
    throw new MedusaError(
      MedusaError.Types.INVALID_DATA,
      "ORDER_ACCESS_SECRET is required to issue promotions"
    )
  }

  const digest = crypto
    .createHmac("sha256", secret)
    .update(`${namespace}:${key}`)
    .digest()

  const group = (offset: number) =>
    Array.from(
      { length: 4 },
      (_, index) => ALPHABET[digest[offset + index] % ALPHABET.length]
    ).join("")

  return `NURA-${group(0)}-${group(4)}`
}
