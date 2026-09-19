"use client"

import { getHomeContent, NotFoundMessagesBlock } from "@lib/data/home-content"
import Link from "next/link"
import { useEffect, useState } from "react"

export default function MainError({ reset }: { reset: () => void }) {
  const [messages, setMessages] = useState<NotFoundMessagesBlock>()

  useEffect(() => {
    getHomeContent().then(({ blocks }) => setMessages(blocks.not_found_messages))
  }, [])

  return (
    <div className="content-container flex min-h-[60dvh] flex-col items-center justify-center gap-5 py-16 text-center">
      <span className="eyebrow">{messages?.error_eyebrow || "Un contretemps"}</span>
      <h1 className="font-serif text-4xl text-brown">
        {messages?.error_title || "Cette page n'a pas pu être chargée"}
      </h1>
      <p className="max-w-md text-sm leading-relaxed text-ui-fg-subtle">
        {messages?.error_text ||
          "Réessayez dans quelques instants ou poursuivez votre découverte de la maison Nura."}
      </p>
      <div className="flex flex-wrap justify-center gap-4">
        <button
          type="button"
          onClick={reset}
          className="inline-flex h-12 items-center bg-brown px-6 text-[11px] uppercase tracking-[0.15em] text-bg-alt"
        >
          Réessayer
        </button>
        <Link
          href="/"
          className="inline-flex h-12 items-center border border-brown px-6 text-[11px] uppercase tracking-[0.15em] text-brown"
        >
          Retour à l’accueil
        </Link>
      </div>
    </div>
  )
}