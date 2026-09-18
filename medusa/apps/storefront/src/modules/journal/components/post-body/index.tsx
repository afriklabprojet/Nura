import LocalizedClientLink from "@modules/common/components/localized-client-link"
import { Fragment } from "react"

/**
 * Renders the light markup the admin editor allows: blank lines separate
 * paragraphs, a line starting with ## becomes a sub-heading, a line starting
 * with - becomes a list item, and [text](url) becomes a link — internal
 * paths (starting with /) stay within the current locale, everything else
 * (mailto:, https://) opens as a plain link. Nothing else is interpreted, so
 * nothing an editor types can inject markup into the page.
 */
const LINK_RE = /\[([^\]]+)\]\(([^)]+)\)/g

const renderInline = (text: string) => {
  const parts: React.ReactNode[] = []
  let lastIndex = 0
  let match: RegExpExecArray | null
  let key = 0

  LINK_RE.lastIndex = 0
  while ((match = LINK_RE.exec(text))) {
    if (match.index > lastIndex) {
      parts.push(
        <Fragment key={key++}>{text.slice(lastIndex, match.index)}</Fragment>
      )
    }

    const [, label, href] = match
    const isInternal = href.startsWith("/")

    parts.push(
      isInternal ? (
        <LocalizedClientLink
          key={key++}
          href={href}
          className="text-gold underline underline-offset-4 hover:text-brown"
        >
          {label}
        </LocalizedClientLink>
      ) : (
        <a
          key={key++}
          href={href}
          target={href.startsWith("http") ? "_blank" : undefined}
          rel={href.startsWith("http") ? "noreferrer" : undefined}
          className="text-gold underline underline-offset-4 hover:text-brown"
        >
          {label}
        </a>
      )
    )

    lastIndex = match.index + match[0].length
  }

  if (lastIndex < text.length) {
    parts.push(<Fragment key={key++}>{text.slice(lastIndex)}</Fragment>)
  }

  return parts
}

const PostBody = ({ content }: { content: string }) => {
  const blocks = content
    .replace(/\r\n/g, "\n")
    .split(/\n{2,}/)
    .map((block) => block.trim())
    .filter(Boolean)

  return (
    <div className="flex flex-col gap-6">
      {blocks.map((block, index) => {
        if (block.startsWith("## ")) {
          return (
            <h2
              key={index}
              className="font-serif text-2xl text-brown small:text-3xl"
            >
              {renderInline(block.slice(3).trim())}
            </h2>
          )
        }

        const lines = block.split("\n").map((line) => line.trim())

        if (lines.every((line) => line.startsWith("- "))) {
          return (
            <ul key={index} className="flex list-disc flex-col gap-2 pl-5">
              {lines.map((line, lineIndex) => (
                <li
                  key={lineIndex}
                  className="leading-relaxed text-ui-fg-subtle"
                >
                  {renderInline(line.slice(2).trim())}
                </li>
              ))}
            </ul>
          )
        }

        return (
          <p key={index} className="leading-relaxed text-ui-fg-subtle">
            {renderInline(block)}
          </p>
        )
      })}
    </div>
  )
}

export default PostBody
