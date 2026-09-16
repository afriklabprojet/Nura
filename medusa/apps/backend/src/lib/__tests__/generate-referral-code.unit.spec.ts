import { generateReferralCode } from "../generate-referral-code"

describe("generateReferralCode", () => {
  it("matches the NURA-XXXXXX format with the reduced alphabet", () => {
    const code = generateReferralCode()
    expect(code).toMatch(/^NURA-[2-9A-HJ-NP-Z]{6}$/)
  })

  it("excludes ambiguous characters (0, O, 1, I)", () => {
    for (let i = 0; i < 50; i++) {
      expect(generateReferralCode()).not.toMatch(/[01OI]/)
    }
  })

  it("generates different codes on each call", () => {
    const codes = new Set(Array.from({ length: 20 }, () => generateReferralCode()))
    expect(codes.size).toBe(20)
  })
})
