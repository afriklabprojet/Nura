import { generatePromoCode } from "../generate-promo-code"

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
