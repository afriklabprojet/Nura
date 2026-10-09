import { describe, expect, it } from "vitest"
import { toSafeExternalUrl, toSafeHref } from "../safe-href"

describe("toSafeHref — accepted links", () => {
  it.each([
    ["/contact", "internal", "/contact"],
    ["/account/orders", "internal", "/account/orders"],
    ["/store?sortBy=price#top", "internal", "/store?sortBy=price#top"],
    ["https://instagram.com/nura", "external", "https://instagram.com/nura"],
    ["HTTPS://Example.com/a", "external", "https://example.com/a"],
    ["  /faq  ", "internal", "/faq"],
    ["mailto:contact@nura-paris.com", "mailto", "mailto:contact@nura-paris.com"],
    [
      "mailto:contact@nura-paris.com?subject=Bonjour%20Nura",
      "mailto",
      "mailto:contact@nura-paris.com?subject=Bonjour%20Nura",
    ],
    ["MAILTO:contact@nura-paris.com", "mailto", "mailto:contact@nura-paris.com"],
    ["tel:+33745064887", "tel", "tel:+33745064887"],
    ["tel:+225-05-05-79-88-82", "tel", "tel:+225-05-05-79-88-82"],
    ["TEL:0745064887", "tel", "tel:0745064887"],
  ])("accepts %s", (input, kind, href) => {
    expect(toSafeHref(input)).toEqual({ kind, href })
  })
})

describe("toSafeHref — rejected links", () => {
  it.each([
    // script and data schemes, any casing or obfuscation
    "javascript:alert(1)",
    "JaVaScRiPt:alert(1)",
    " javascript:alert(1)",
    "java\tscript:alert(1)",
    "java\nscript:alert(1)",
    "java\u200bscript:alert(1)",
    "\u0001javascript:alert(1)",
    "&#106;avascript:alert(1)",
    "%6Aavascript:alert(1)",
    "vbscript:msgbox(1)",
    "data:text/html,<script>alert(1)</script>",
    "file:///etc/passwd",
    "blob:https://nura.com/abc",
    "ftp://example.com/file",
    // plain http is not allowed
    "http://example.com",
    // protocol-relative and slash/backslash tricks
    "//evil.com",
    "///evil.com",
    "/\\evil.com",
    "\\\\evil.com",
    "/%2F%2Fevil.com",
    "/%2f/evil.com",
    "/%5Cevil.com",
    "/%0d%0aSet-Cookie:x=1",
    "/%zz",
    // malformed or deceptive https URLs
    "https:evil.com",
    "https:/evil.com",
    "https://",
    "https://user:pass@evil.com",
    "https://nura-paris.com@evil.com",
    "https://exa mple.com",
    "https://evil.com\\@nura.com",
    // relative forms that are not rooted paths
    "contact",
    "./contact",
    "?a=1",
    "#section",
    "",
    "   ",
    // mailto abuse
    "mailto:",
    "mailto:not-an-email",
    "mailto:a@b.co,c@d.co",
    "mailto:a@b.co?bcc=x@y.co",
    "mailto:a@b.co?cc=x@y.co&subject=hi",
    "mailto:a@b.co?subject=hi&to=x@y.co",
    "mailto:javascript:alert(1)",
    // tel abuse
    "tel:",
    "tel:javascript:alert(1)",
    "tel:+33 7 45 06 48 87",
    "tel:abc",
    "tel:+33745064887;ext=1",
  ])("rejects %j", (input) => {
    expect(toSafeHref(input)).toBeNull()
  })
})

describe("toSafeExternalUrl — social profile URLs", () => {
  it.each([
    ["https://instagram.com/nura", "https://instagram.com/nura"],
    ["https://www.instagram.com/nura.paris/", "https://www.instagram.com/nura.paris/"],
    ["https://www.tiktok.com/@nura", "https://www.tiktok.com/@nura"],
    ["  https://tiktok.com/@nura  ", "https://tiktok.com/@nura"],
    ["HTTPS://Instagram.com/nura", "https://instagram.com/nura"],
  ])("accepts %s", (input, expected) => {
    expect(toSafeExternalUrl(input)).toBe(expected)
  })

  it.each([
    "javascript:alert(1)",
    "JaVaScRiPt:alert(1)",
    "data:text/html,x",
    "http://instagram.com/nura",
    "//evil.com",
    "/nura",
    "mailto:contact@nura-paris.com",
    "tel:+33745064887",
    "https://user:pass@instagram.com/nura",
    "https://instagram.com/\\evil",
    "https://insta gram.com",
    "instagram.com/nura",
    "@nura",
    "",
    "   ",
  ])("returns an empty string for %j", (input) => {
    expect(toSafeExternalUrl(input)).toBe("")
  })

  it("returns an empty string when nothing is configured", () => {
    expect(toSafeExternalUrl(undefined)).toBe("")
    expect(toSafeExternalUrl(null)).toBe("")
  })
})
