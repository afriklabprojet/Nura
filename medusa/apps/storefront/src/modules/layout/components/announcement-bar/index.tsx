"use client"

import { useEffect, useState } from "react"

const messages = [
  "Livraison en France et en Côte d'Ivoire",
  "Paiement sécurisé",
  "Retours sous 14 jours",
  "Votre aura commence ici",
]

const AnnouncementBar = () => {
  const [index, setIndex] = useState(0)

  useEffect(() => {
    const id = setInterval(
      () => setIndex((i) => (i + 1) % messages.length),
      4500
    )
    return () => clearInterval(id)
  }, [])

  return (
    <div className="relative z-20 w-full bg-brown text-bg-alt">
      <div className="content-container flex h-9 items-center justify-center overflow-hidden">
        <p
          key={index}
          className="animate-fade-in-top text-center text-[10px] uppercase tracking-[0.3em] small:text-[11px]"
          aria-live="polite"
        >
          {messages[index]}
        </p>
      </div>
    </div>
  )
}

export default AnnouncementBar
