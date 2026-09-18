"use client"

import { Button } from "@modules/common/components/ui"
import InlineText from "@modules/common/components/inline-text"
import { readConsent, writeConsent } from "@lib/util/cookie-consent"
import { useEffect, useState } from "react"

const DEFAULT_TEXT =
  "Ce site utilise des cookies strictement nécessaires à son fonctionnement (panier, session, région), ainsi que, si vous l'acceptez, des cookies de mesure d'audience et de publicité. En savoir plus et gérer votre choix dans notre [politique de cookies](/politique-cookies)."

export default function CookieConsent({ text }: { text?: string }) {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    setVisible(readConsent() === null)
    const reopen = () => setVisible(true)
    window.addEventListener("nura:open-cookie-preferences", reopen)
    return () => window.removeEventListener("nura:open-cookie-preferences", reopen)
  }, [])

  const choose = (analytics: boolean) => {
    writeConsent({ analytics })
    setVisible(false)
  }

  if (!visible) {
    return null
  }

  return (
    <div className="fixed bottom-0 inset-x-0 z-[70] bg-brown text-bg-alt" role="region" aria-label="Préférences de cookies">
      <div className="content-container flex flex-col items-center gap-4 py-4 small:flex-row" style={{ paddingBottom: "max(1rem, env(safe-area-inset-bottom))" }}>
        <p className="txt-small flex-1 text-center small:text-left">
          <InlineText
            text={text || DEFAULT_TEXT}
            className="underline hover:text-gold"
          />
        </p>
        <div className="flex gap-2 shrink-0">
          <Button
            variant="secondary"
            size="small"
            className="border-bg-alt text-bg-alt hover:bg-ink"
            onClick={() => choose(false)}
          >
            Refuser
          </Button>
          <Button size="small" onClick={() => choose(true)}>
            Tout accepter
          </Button>
        </div>
      </div>
    </div>
  )
}
