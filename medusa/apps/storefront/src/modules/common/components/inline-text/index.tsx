import { parseInlineLinks } from "@lib/util/inline-links"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import { Fragment } from "react"

/**
 * Renders a single line of admin-editable text with [text](url) turned into
 * links. Only internal paths (kept within the current locale), https://,
 * mailto: and tel: links are accepted (see toSafeHref); a link with any other
 * URL is shown as plain text. Nothing else is interpreted, so nothing an
 * editor types can inject markup or a script URL into the page.
 * Shared by PostBody (multi-paragraph content) and the one-line consent/
 * legal texts (cookie banner, newsletter, checkout, registration).
 */
const InlineText = ({
  text,
  className = "text-gold underline underline-offset-4 hover:text-brown",
}: {
  text: string
  className?: string
}) => {
  return (
    <>
      {parseInlineLinks(text).map((segment, index) => {
        if (segment.type === "text") {
          return <Fragment key={index}>{segment.text}</Fragment>
        }

        const { link, label } = segment

        if (link.kind === "internal") {
          return (
            <LocalizedClientLink key={index} href={link.href} className={className}>
              {label}
            </LocalizedClientLink>
          )
        }

        return (
          <a
            key={index}
            href={link.href}
            target={link.kind === "external" ? "_blank" : undefined}
            rel={link.kind === "external" ? "noopener noreferrer" : undefined}
            className={className}
          >
            {label}
          </a>
        )
      })}
    </>
  )
}

export default InlineText
