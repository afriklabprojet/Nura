import { createHmac } from "node:crypto"
import {
  createOrderAccessToken,
  verifyOrderAccessToken,
} from "../order-access-token"

describe("verifyOrderAccessToken", () => {
  const originalSecret = process.env.ORDER_ACCESS_SECRET
  const now = 1_700_000_000_000

  beforeEach(() => {
    process.env.ORDER_ACCESS_SECRET = "unit-test-secret"
  })

  afterAll(() => {
    if (originalSecret) {
      process.env.ORDER_ACCESS_SECRET = originalSecret
    } else {
      delete process.env.ORDER_ACCESS_SECRET
    }
  })

  const createToken = (orderId: string, expiresAt: number) => {
    const signature = createHmac("sha256", process.env.ORDER_ACCESS_SECRET!)
      .update(`${orderId}.${expiresAt}`)
      .digest("hex")

    return `${expiresAt}.${signature}`
  }

  it("accepts a valid unexpired token for its order", () => {
    expect(verifyOrderAccessToken("order_1", createToken("order_1", now + 1), now)).toBe(
      true
    )
  })

  it("creates a token accepted for the requested order", () => {
    const token = createOrderAccessToken("order_1", now, 1000)

    expect(verifyOrderAccessToken("order_1", token, now)).toBe(true)
    expect(verifyOrderAccessToken("order_2", token, now)).toBe(false)
  })

  it("rejects a token signed for another order", () => {
    expect(verifyOrderAccessToken("order_2", createToken("order_1", now + 1), now)).toBe(
      false
    )
  })

  it.each([
    ["expired", () => createToken("order_1", now)],
    ["altered", () => `${createToken("order_1", now + 1).slice(0, -1)}0`],
    ["malformed", () => `${now + 1}.not-a-signature`],
  ])("rejects a %s token", (_label, token) => {
    expect(verifyOrderAccessToken("order_1", token(), now)).toBe(false)
  })

  it("rejects tokens when the signing secret is absent", () => {
    const token = createToken("order_1", now + 1)
    delete process.env.ORDER_ACCESS_SECRET

    expect(verifyOrderAccessToken("order_1", token, now)).toBe(false)
  })
})