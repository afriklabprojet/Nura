import { describe, expect, it } from "vitest"
import { parseInlineLinks } from "../inline-links"

const link = (label: string, kind: string, href: string) => ({
  type: "link",
  label,
  link: { kind, href },
})

describe("parseInlineLinks", () => {
  it("keeps plain text untouched", () => {
    expect(parseInlineLinks("Bonjour Nura")).toEqual([
      { type: "text", text: "Bonjour Nura" },
    ])
    expect(parseInlineLinks("")).toEqual([])
  })

  it("turns allowed links into link segments around the surrounding text", () => {
    expect(
      parseInlineLinks(
        "Voir la [FAQ](/faq), écrire à [Nura](mailto:contact@nura-paris.com), appeler le [bureau](tel:+33745064887) ou [nous suivre](https://instagram.com/nura)."
      )
    ).toEqual([
      { type: "text", text: "Voir la " },
      link("FAQ", "internal", "/faq"),
      { type: "text", text: ", écrire à " },
      link("Nura", "mailto", "mailto:contact@nura-paris.com"),
      { type: "text", text: ", appeler le " },
      link("bureau", "tel", "tel:+33745064887"),
      { type: "text", text: " ou " },
      link("nous suivre", "external", "https://instagram.com/nura"),
      { type: "text", text: "." },
    ])
  })

  it("handles consecutive links", () => {
    expect(parseInlineLinks("[a](/a)[b](/b) [c](/c)")).toEqual([
      link("a", "internal", "/a"),
      link("b", "internal", "/b"),
      { type: "text", text: " " },
      link("c", "internal", "/c"),
    ])
  })
})

describe("parseInlineLinks — unsafe URLs", () => {
  it("downgrades links with an unsafe URL to their plain label", () => {
    expect(
      parseInlineLinks(
        "[a](javascript:alert(1)) [b](data:text/html,x) [c](//evil.com) [d](http://example.com) [e](https://u:p@evil.com)"
      )
    ).toEqual([{ type: "text", text: "a b c d e" }])
  })

  it("leaves no residual text after an unsafe URL containing parentheses", () => {
    expect(parseInlineLinks("[a](javascript:alert(1))")).toEqual([
      { type: "text", text: "a" },
    ])
    expect(parseInlineLinks("[a](javascript:alert((1)))")).toEqual([
      { type: "text", text: "a" },
    ])
    expect(parseInlineLinks("avant [a](javascript:alert(1)) après")).toEqual([
      { type: "text", text: "avant a après" },
    ])
  })

  it("never produces a link segment for an unsafe URL", () => {
    const segments = parseInlineLinks(
      "[x](javascript:alert(1)) [y](JaVaScRiPt:alert(1)) [z](vbscript:x) [w](java\tscript:alert(1))"
    )

    expect(segments.some((segment) => segment.type === "link")).toBe(false)
  })
})

describe("parseInlineLinks — parentheses", () => {
  it("accepts balanced parentheses inside an https URL", () => {
    expect(
      parseInlineLinks(
        "Lire [Foo](https://en.wikipedia.org/wiki/Foo_(bar)) pour la suite."
      )
    ).toEqual([
      { type: "text", text: "Lire " },
      link("Foo", "external", "https://en.wikipedia.org/wiki/Foo_(bar)"),
      { type: "text", text: " pour la suite." },
    ])
  })

  it("keeps parentheses that follow a link as plain text", () => {
    expect(parseInlineLinks("[FAQ](/faq) (voir aussi le blog)")).toEqual([
      link("FAQ", "internal", "/faq"),
      { type: "text", text: " (voir aussi le blog)" },
    ])
    expect(parseInlineLinks("(voir [FAQ](/faq))")).toEqual([
      { type: "text", text: "(voir " },
      link("FAQ", "internal", "/faq"),
      { type: "text", text: ")" },
    ])
  })

  it("falls back to the first closing parenthesis when they are unbalanced", () => {
    expect(parseInlineLinks("[FAQ](/faq (voir) et [Blog](/journal)")).toEqual([
      { type: "text", text: "FAQ et " },
      link("Blog", "internal", "/journal"),
    ])
  })
})

describe("parseInlineLinks — malformed input stays literal", () => {
  it.each([
    "[a](/faq",
    "[a]()",
    "[](/faq)",
    "[a] (/faq)",
    "[a]",
    "a ] b [ c",
    "[x] et (y)",
  ])("does not treat %j as a link", (input) => {
    expect(parseInlineLinks(input)).toEqual([{ type: "text", text: input }])
  })

  it("is safe to call repeatedly (no shared state)", () => {
    const text = "[FAQ](/faq)"

    expect(parseInlineLinks(text)).toEqual(parseInlineLinks(text))
  })
})
