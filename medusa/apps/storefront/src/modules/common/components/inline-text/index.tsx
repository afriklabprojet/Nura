import LocalizedClientLink from "@modules/common/components/localized-client-link"
import { Fragment } from "react"

/**
 * Renders a single line of admin-editable text with [text](url) turned into
 * links — internal paths (starting with /) stay within the current locale,
 * everything else (mailto:, https://) opens as a plain link. Nothing else is
 * interpreted, so nothing an editor types can inject markup into the page.
 * Shared by PostBody (multi-paragraph content) and the one-line consent/
 * legal texts (cookie banner, newsletter, checkout, registration).
 */
const LINK_RE = /\[([^\]]+)\]\(([^)]+)\)/g

const InlineText = ({
  text,
  className = "text-gold underline underline-offset-4 hover:text-brown",
}: {
  text: string
  className?: string
}) => {
  const parts: React.ReactNode[] = []
  let lastIndex = 0
  let match: RegExpExecArray | null
  let key = 0
  const linkPattern = new RegExp(LINK_RE)

  while ((match = linkPattern.exec(text))) {
    if (match.index > lastIndex) {
      parts.push(
        <Fragment key={key++}>{text.slice(lastIndex, match.index)}</Fragment>
      )
    }

    const [, label, href] = match
    const isInternal = href.startsWith("/")

    parts.push(
      isInternal ? (
        <LocalizedClientLink key={key++} href={href} className={className}>
          {label}
        </LocalizedClientLink>
      ) : (
        <a
          key={key++}
          href={href}
          target={href.startsWith("http") ? "_blank" : undefined}
          rel={href.startsWith("http") ? "noreferrer" : undefined}
          className={className}
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

  return <>{parts}</>
}

export default InlineText
