"use client"

import { Button } from "@modules/common/components/ui"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import { readConsent, writeConsent } from "@lib/util/cookie-consent"
import { useEffect, useState } from "react"

export default function CookieConsent() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    setVisible(readConsent() === null)
  }, [])

  const choose = (analytics: boolean) => {
    writeConsent({ analytics })
    setVisible(false)
  }

  if (!visible) {
    return null
  }

  return (
    <div className="fixed bottom-0 inset-x-0 z-50 bg-brown text-bg-alt">
      <div className="content-container py-4 flex flex-col small:flex-row items-center gap-4">
        <p className="txt-small flex-1 text-center small:text-left">
          Ce site utilise des cookies strictement nécessaires à son
          fonctionnement (panier, session, région), ainsi que, si vous
          l&apos;acceptez, des cookies de mesure d&apos;audience et de
          publicité. En savoir plus et gérer votre choix dans notre{" "}
          <LocalizedClientLink
            href="/politique-cookies"
            className="underline hover:text-gold"
          >
            politique de cookies
          </LocalizedClientLink>
          .
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
