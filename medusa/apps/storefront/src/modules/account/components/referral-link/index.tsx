"use client"

import { Button, Input } from "@modules/common/components/ui"
import { useState } from "react"

const ReferralLink = ({ link }: { link: string }) => {
  const [copied, setCopied] = useState(false)

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(link)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      // Clipboard API unavailable — the link is still selectable/copyable
      // manually from the input, so this just skips the one-click copy.
    }
  }

  return (
    <div className="flex flex-col small:flex-row gap-2 max-w-lg">
      <Input readOnly value={link} onFocus={(e) => e.target.select()} />
      <Button variant="secondary" onClick={copy} className="shrink-0">
        {copied ? "Copié !" : "Copier le lien"}
      </Button>
    </div>
  )
}

export default ReferralLink
