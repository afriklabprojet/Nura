import {
  getStorefrontUrl,
  renderButton,
  renderEmailLayout,
} from "../email-templates"

describe("email-templates", () => {
  describe("renderEmailLayout", () => {
    it("wraps the body HTML in the branded Nura layout", () => {
      const html = renderEmailLayout("<p>Bonjour</p>")

      expect(html).toContain("Nura")
      expect(html).toContain("<p>Bonjour</p>")
      expect(html).toContain("Votre aura commence ici.")
    })
  })

  describe("renderButton", () => {
    it("renders a link with the given href and label", () => {
      const html = renderButton(
        "https://nura-paris.com/reset",
        "Réinitialiser"
      )

      expect(html).toContain('href="https://nura-paris.com/reset"')
      expect(html).toContain("Réinitialiser")
    })
  })

  describe("getStorefrontUrl", () => {
    it("falls back to localhost:8000 when STOREFRONT_URL is unset", () => {
      expect(getStorefrontUrl()).toBe("http://localhost:8000")
    })
  })
})
