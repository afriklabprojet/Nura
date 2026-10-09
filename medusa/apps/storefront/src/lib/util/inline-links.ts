import { SafeHref, toSafeHref } from "./safe-href"

export type InlineSegment =
  | { type: "text"; text: string }
  | { type: "link"; label: string; link: SafeHref }

// Index of the ")" closing the "(" that opens at `urlStart - 1`. Parentheses
// inside the URL are allowed as long as they are balanced, so
// "(https://en.wikipedia.org/wiki/Foo_(bar))" ends at the last ")". When they
// are not balanced, fall back to the first ")".
const findUrlEnd = (text: string, urlStart: number) => {
  let depth = 1

  for (let index = urlStart; index < text.length; index++) {
    if (text[index] === "(") {
      depth++
    } else if (text[index] === ")" && --depth === 0) {
      return index
    }
  }

  return text.indexOf(")", urlStart)
}

/**
 * Splits admin-typed text into plain text and [label](url) links. A link
 * whose URL fails validation is kept as its plain label, so the sentence
 * still reads correctly and nothing unsafe reaches an `href`.
 */
export const parseInlineLinks = (text: string): InlineSegment[] => {
  const segments: InlineSegment[] = []

  const pushText = (value: string) => {
    if (!value) {
      return
    }

    const last = segments[segments.length - 1]

    if (last?.type === "text") {
      last.text += value
    } else {
      segments.push({ type: "text", text: value })
    }
  }

  let cursor = 0
  let searchFrom = 0

  while (searchFrom < text.length) {
    const open = text.indexOf("[", searchFrom)
    const close = open === -1 ? -1 : text.indexOf("]", open + 1)

    if (open === -1 || close === -1) {
      break
    }

    const urlStart = close + 2
    const urlEnd =
      close > open + 1 && text[close + 1] === "(" ? findUrlEnd(text, urlStart) : -1

    if (urlEnd <= urlStart) {
      searchFrom = open + 1
      continue
    }

    const label = text.slice(open + 1, close)
    const link = toSafeHref(text.slice(urlStart, urlEnd))

    pushText(text.slice(cursor, open))

    if (link) {
      segments.push({ type: "link", label, link })
    } else {
      pushText(label)
    }

    cursor = searchFrom = urlEnd + 1
  }

  pushText(text.slice(cursor))

  return segments
}
