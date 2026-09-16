import { getBaseURL } from "@lib/util/env"
import AnalyticsScripts from "@modules/layout/components/analytics-scripts"
import CookieConsent from "@modules/layout/components/cookie-consent"
import WhatsappButton from "@modules/layout/components/whatsapp-button"
import { Metadata } from "next"
import { Cormorant_Garamond, Jost } from "next/font/google"
import "styles/globals.css"

const jost = Jost({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  variable: "--font-jost",
  display: "swap",
})

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  style: ["normal", "italic"],
  variable: "--font-cormorant",
  display: "swap",
})

export const metadata: Metadata = {
  metadataBase: new URL(getBaseURL()),
  title: { default: "Nura", template: "%s | Nura" },
  openGraph: {
    type: "website",
    siteName: "Nura",
    locale: "fr_FR",
    images: [{ url: "/images/og.jpg", width: 1200, height: 630 }],
  },
}

export default function RootLayout(props: { children: React.ReactNode }) {
  return (
    <html
      lang="fr"
      data-mode="light"
      className={`${jost.variable} ${cormorant.variable}`}
    >
      <body className="bg-bg text-ink font-sans">
        <main className="relative">{props.children}</main>
        <CookieConsent />
        <AnalyticsScripts />
        <WhatsappButton />
      </body>
    </html>
  )
}
