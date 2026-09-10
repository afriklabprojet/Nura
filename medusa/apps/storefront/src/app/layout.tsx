import { getBaseURL } from "@lib/util/env"
import { Metadata } from "next"
import "styles/globals.css"

export const metadata: Metadata = {
  metadataBase: new URL(getBaseURL()),
  title: { default: "Nura", template: "%s | Nura" },
}

export default function RootLayout(props: { children: React.ReactNode }) {
  return (
    <html lang="fr" data-mode="light">
      <body className="bg-bg text-ink font-sans">
        <main className="relative">{props.children}</main>
      </body>
    </html>
  )
}
