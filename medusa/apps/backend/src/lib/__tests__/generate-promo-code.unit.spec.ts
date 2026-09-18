import {
  generateIdempotentPromoCode,
  generatePromoCode,
} from "../generate-promo-code"

describe("generatePromoCode", () => {
  it("matches the NURA-XXXX-XXXX format with the reduced alphabet", () => {
    const code = generatePromoCode()
    expect(code).toMatch(/^NURA-[2-9A-HJ-NP-Z]{4}-[2-9A-HJ-NP-Z]{4}$/)
  })

  it("excludes ambiguous characters (0, O, 1, I)", () => {
    for (let i = 0; i < 50; i++) {
      const code = generatePromoCode()
      expect(code).not.toMatch(/[01OI]/)
    }
  })

  it("generates different codes on each call", () => {
    const codes = new Set(Array.from({ length: 20 }, () => generatePromoCode()))
    expect(codes.size).toBe(20)
  })
})

describe("generateIdempotentPromoCode", () => {
  const originalSecret = process.env.ORDER_ACCESS_SECRET

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

  it("returns the same code when an event is replayed", () => {
    const firstCode = generateIdempotentPromoCode("gift-card", "order_item_1:0")
    const replayedCode = generateIdempotentPromoCode("gift-card", "order_item_1:0")

    expect(replayedCode).toBe(firstCode)
    expect(firstCode).toMatch(/^NURA-[2-9A-HJ-NP-Z]{4}-[2-9A-HJ-NP-Z]{4}$/)
  })

  it("separates codes by namespace and key", () => {
    expect(generateIdempotentPromoCode("gift-card", "order_item_1:0")).not.toBe(
      generateIdempotentPromoCode("referral", "order_item_1:0")
    )
    expect(generateIdempotentPromoCode("gift-card", "order_item_1:0")).not.toBe(
      generateIdempotentPromoCode("gift-card", "order_item_1:1")
    )
  })

  it("rejects promotion issuance without a signing secret", () => {
    delete process.env.ORDER_ACCESS_SECRET

    expect(() => generateIdempotentPromoCode("gift-card", "order_item_1:0")).toThrow(
      "ORDER_ACCESS_SECRET is required"
    )
  })
})
