import { createHmac } from "crypto"
import { describe, expect, it } from "vitest"
import { verifySignedOrderAccessToken } from "../order-access-token"

describe("verifySignedOrderAccessToken", () => {
  const secret = "storefront-test-secret"
  const now = 1_700_000_000_000

  const createToken = (orderId: string, expiresAt: number) => {
    const signature = createHmac("sha256", secret)
      .update(`${orderId}.${expiresAt}`)
      .digest("hex")

    return `${expiresAt}.${signature}`
  }

  it("accepts a valid token for its order", () => {
    const token = createToken("order_1", now + 1000)

    expect(verifySignedOrderAccessToken("order_1", token, secret, now)).toBe(true)
  })

  it("rejects a token signed for another order", () => {
    const token = createToken("order_1", now + 1000)

    expect(verifySignedOrderAccessToken("order_2", token, secret, now)).toBe(false)
  })

  it.each([
    ["expired", () => createToken("order_1", now)],
    ["malformed", () => `${now + 1000}.invalid`],
    ["extra fields", () => `${createToken("order_1", now + 1000)}.extra`],
  ])("rejects %s tokens", (_label, token) => {
    expect(verifySignedOrderAccessToken("order_1", token(), secret, now)).toBe(false)
  })
})
