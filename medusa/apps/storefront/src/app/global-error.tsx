"use client"

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
          <button
            onClick={() => reset()}
            className="underline text-brown hover:text-gold"
          >
            Réessayer
          </button>
        </div>
      </body>
    </html>
  )
}
