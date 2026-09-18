import InlineText from "@modules/common/components/inline-text"

/**
 * Renders the light markup the admin editor allows: blank lines separate
 * paragraphs, a line starting with ## becomes a sub-heading, a line starting
 * with - becomes a list item, and [text](url) becomes a link (see
 * InlineText). Nothing else is interpreted, so nothing an editor types can
 * inject markup into the page.
 */
const renderInline = (text: string) => <InlineText text={text} />

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
