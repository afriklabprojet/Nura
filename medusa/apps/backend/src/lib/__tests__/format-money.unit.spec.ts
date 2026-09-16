import { formatMoney } from "../format-money"

// Intl.NumberFormat inserts non-breaking/narrow-no-break spaces (not U+0020)
// around the amount; normalize before comparing so assertions stay readable.
const normalizeSpaces = (value: string) => value.replace(/\s/g, " ")

describe("formatMoney", () => {
  it("formats EUR amounts with the French locale symbol placement", () => {
    expect(normalizeSpaces(formatMoney(58, "eur"))).toBe("58,00 €")
  })

  it("formats XOF amounts without decimals", () => {
    expect(normalizeSpaces(formatMoney(6500, "xof"))).toContain("6 500")
  })

  it("handles zero", () => {
    expect(normalizeSpaces(formatMoney(0, "eur"))).toBe("0,00 €")
  })
})
