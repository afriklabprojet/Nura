"use client"

import Link from "next/link"

export default function GlobalError({
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <html lang="fr">
      <body className="bg-bg text-ink font-sans">
        <div className="flex flex-col gap-4 items-center justify-center min-h-screen text-center px-6">
          <h1 className="text-2xl-semi">Une erreur est survenue</h1>
          <p className="text-small-regular">
            Quelque chose s&apos;est mal passé. Veuillez réessayer.
          </p>
          <div className="flex flex-wrap justify-center gap-5">
            <button
              onClick={() => reset()}
              className="min-h-11 underline text-brown hover:text-gold"
            >
              Réessayer
            </button>
            <Link href="/" className="inline-flex min-h-11 items-center underline">
              Retour à l’accueil
            </Link>
          </div>
        </div>
      </body>
    </html>
  )
}
