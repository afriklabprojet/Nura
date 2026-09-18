import { createHmac, timingSafeEqual } from "crypto"

export const verifySignedOrderAccessToken = (
  orderId: string,
  token: string,
  secret: string,
  now = Date.now()
) => {
  const [expiresAt, signature, extraPart] = token.split(".")
  const expiration = Number(expiresAt)

  if (
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

  return timingSafeEqual(
    Uint8Array.from(Buffer.from(signature, "hex")),
    Uint8Array.from(Buffer.from(expected, "hex"))
  )
}
