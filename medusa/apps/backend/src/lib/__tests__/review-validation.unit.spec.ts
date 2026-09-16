import { isValidRating } from "../review-validation"

describe("isValidRating", () => {
  it.each([1, 2, 3, 4, 5])("accepts integer rating %i", (rating) => {
    expect(isValidRating(rating)).toBe(true)
  })

  it.each([0, 6, -1, 1.5, NaN])("rejects invalid rating %p", (rating) => {
    expect(isValidRating(rating)).toBe(false)
  })
})
