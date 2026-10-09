export type SafeHref =
  | { kind: "internal"; href: string }
  | { kind: "external"; href: string }
  | { kind: "mailto"; href: string }
  | { kind: "tel"; href: string }

// Whitespace, ASCII/C1 control characters, invisible/bidi formatting
// characters and backslashes. Browsers strip or reinterpret several of these
// inside URLs ("java\tscript:", "/\evil.com"), so none may appear at all.
// Expressed as code-point ranges rather than a regex literal so the invisible
// characters stay readable and cannot be mangled by an editor.
const FORBIDDEN_RANGES: [number, number][] = [
  [0x0000, 0x0020], // C0 controls and space
  [0x005c, 0x005c], // backslash
  [0x007f, 0x00a0], // DEL, C1 controls, no-break space
  [0x1680, 0x1680], // ogham space
  [0x180e, 0x180e], // mongolian vowel separator
  [0x2000, 0x200f], // spaces, zero-width characters, LRM/RLM
  [0x2028, 0x202f], // line/paragraph separators, bidi embeddings, narrow nbsp
  [0x205f, 0x2064], // medium math space, invisible operators
  [0x3000, 0x3000], // ideographic space
  [0xfeff, 0xfeff], // zero-width no-break space / BOM
]

const hasForbiddenChar = (value: string) => {
  for (const char of value) {
    const code = char.codePointAt(0)!

    if (FORBIDDEN_RANGES.some(([from, to]) => code >= from && code <= to)) {
      return true
    }
  }

  return false
}

const EMAIL = /^[^\s@,;:<>()[\]\\"]+@[A-Za-z0-9](?:[A-Za-z0-9.-]*[A-Za-z0-9])?\.[A-Za-z]{2,}$/
const PHONE = /^\+?[0-9][0-9().-]{2,28}$/
const MAILTO_PARAMS = new Set(["subject", "body"])

const safeDecode = (value: string) => {
  try {
    return decodeURIComponent(value)
  } catch {
    return null
  }
}

const internal = (raw: string): SafeHref | null => {
  // "//host" is protocol-relative, "/\host" is read as "//host" by browsers.
  if (!raw.startsWith("/") || raw.startsWith("//")) {
    return null
  }

  const decoded = safeDecode(raw)

  if (
    decoded === null ||
    decoded.startsWith("//") ||
    hasForbiddenChar(decoded)
  ) {
    return null
  }

  return { kind: "internal", href: raw }
}

const external = (raw: string): SafeHref | null => {
  if (!/^https:\/\//i.test(raw)) {
    return null
  }

  let url: URL

  try {
    url = new URL(raw)
  } catch {
    return null
  }

  // Credentials in the URL ("https://nura.com@evil.com") are a phishing trick.
  if (url.protocol !== "https:" || !url.hostname || url.username || url.password) {
    return null
  }

  return { kind: "external", href: url.href }
}

const mailto = (raw: string): SafeHref | null => {
  const rest = raw.slice("mailto:".length)
  const queryStart = rest.indexOf("?")
  const addressPart = queryStart === -1 ? rest : rest.slice(0, queryStart)
  const query = queryStart === -1 ? undefined : rest.slice(queryStart + 1)
  const address = safeDecode(addressPart)

  // One recipient only: no list ("a@x.co,b@y.co") and no cc/bcc/to headers.
  if (!address || !EMAIL.test(address)) {
    return null
  }

  if (query !== undefined) {
    for (const key of new URLSearchParams(query).keys()) {
      if (!MAILTO_PARAMS.has(key.toLowerCase())) {
        return null
      }
    }
  }

  return { kind: "mailto", href: `mailto:${addressPart}${query !== undefined ? `?${query}` : ""}` }
}

const tel = (raw: string): SafeHref | null => {
  const number = raw.slice("tel:".length)

  return PHONE.test(number) ? { kind: "tel", href: `tel:${number}` } : null
}

/**
 * Validates a link typed into the admin before it reaches an `href`. Only
 * these are accepted, everything else (javascript:, data:, http:, //host,
 * credentials in the URL, anything unparseable) returns null:
 *   - internal paths starting with a single "/"
 *   - https:// URLs
 *   - mailto: with one address (and optional subject/body)
 *   - tel: with a plain phone number
 */
export const toSafeHref = (input: string): SafeHref | null => {
  const raw = input.trim()

  if (!raw || hasForbiddenChar(raw)) {
    return null
  }

  if (raw.startsWith("/")) {
    return internal(raw)
  }

  if (/^mailto:/i.test(raw)) {
    return mailto(raw)
  }

  if (/^tel:/i.test(raw)) {
    return tel(raw)
  }

  return external(raw)
}

/**
 * For links that must be absolute web addresses, such as the social profiles
 * set in the admin. Returns the normalised https:// URL, or "" when the value
 * is empty or anything else (internal path, mailto:, tel:, javascript:, ...),
 * so callers can simply skip rendering the link.
 */
export const toSafeExternalUrl = (input: string | null | undefined): string => {
  const link = input ? toSafeHref(input) : null

  return link?.kind === "external" ? link.href : ""
}
