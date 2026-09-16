import { escapeHtml } from "../escape-html"

describe("escapeHtml", () => {
  it("escapes the five reserved HTML characters", () => {
    expect(escapeHtml(`<script>alert("x")</script> & 'y'`)).toBe(
      "&lt;script&gt;alert(&quot;x&quot;)&lt;/script&gt; &amp; &#39;y&#39;"
    )
  })

  it("leaves plain text untouched", () => {
    expect(escapeHtml("Bonjour Nura")).toBe("Bonjour Nura")
  })
})
