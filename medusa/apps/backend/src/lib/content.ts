/** Turns a title into a URL-safe handle: "Rituel d'été" -> "rituel-d-ete". */
export const slugify = (value: string) =>
  value
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 120)

export const HOME_BLOCK_KEYS = [
  // Home page sections
  "hero",
  "campaign",
  "essentials",
  "editorial",
  "ritual",
  "categories",
  "gallery",
  // Site-wide content, used across several pages
  "site_settings",
  "announcement",
  "faq",
  // Static pages (title + body), rendered through the same lightweight
  // markup as Journal articles. Legal pages (CGV, Confidentialité, Mentions
  // légales) are deliberately excluded — see docs/CONTENT.md.
  "page_a_propos",
  "page_contact",
  "page_livraison_retours",
  "page_politique_cookies",
] as const

export type HomeBlockKey = (typeof HOME_BLOCK_KEYS)[number]

export const isHomeBlockKey = (value: unknown): value is HomeBlockKey =>
  typeof value === "string" &&
  (HOME_BLOCK_KEYS as readonly string[]).includes(value)

/**
 * A scheduled block is live between its two dates; either bound may be left
 * empty for "since forever" / "until further notice".
 */
export const isBlockLive = (
  block: { active: boolean; starts_at?: Date | null; ends_at?: Date | null },
  now = new Date()
) => {
  if (!block.active) {
    return false
  }

  if (block.starts_at && new Date(block.starts_at) > now) {
    return false
  }

  if (block.ends_at && new Date(block.ends_at) < now) {
    return false
  }

  return true
}
