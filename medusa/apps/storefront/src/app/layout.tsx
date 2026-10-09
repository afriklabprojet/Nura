import { getHomeContent } from "@lib/data/home-content"
import { getSiteSettings } from "@lib/data/site-settings"
import { getBaseURL } from "@lib/util/env"
import AnalyticsScripts from "@modules/layout/components/analytics-scripts"
import CookieConsent from "@modules/layout/components/cookie-consent"
import WhatsappButton from "@modules/layout/components/whatsapp-button"
import { Metadata } from "next"
import "@fontsource/cormorant-garamond/400-italic.css"
import "@fontsource/cormorant-garamond/400.css"
import "@fontsource/cormorant-garamond/500-italic.css"
import "@fontsource/cormorant-garamond/500.css"
import "@fontsource/cormorant-garamond/600-italic.css"
import "@fontsource/cormorant-garamond/600.css"
import "@fontsource/jost/300.css"
import "@fontsource/jost/400.css"
import "@fontsource/jost/500.css"
import "@fontsource/jost/600.css"
import "styles/globals.css"

export const metadata: Metadata = {
  metadataBase: new URL(getBaseURL()),
  title: { default: "Nura", template: "%s | Nura" },
  manifest: "/manifest.webmanifest",
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
      { url: "/icon-192.png", sizes: "192x192", type: "image/png" },
      { url: "/icon-512.png", sizes: "512x512", type: "image/png" },
    ],
    apple: [
      {
        url: "/apple-touch-icon.png",
        sizes: "180x180",
        type: "image/png",
      },
    ],
  },
  openGraph: {
    type: "website",
    siteName: "Nura",
    locale: "fr_FR",
    images: [{ url: "/images/og.jpg", width: 1200, height: 630 }],
  },
}

export default async function RootLayout(props: { children: React.ReactNode }) {
  const [siteSettings, { blocks, hidden }] = await Promise.all([
    getSiteSettings(),
    getHomeContent(),
  ])

  return (
    <html
      lang="fr"
      data-mode="light"
    >
      <body className="bg-bg text-ink font-sans">
        <a
          href="#main-content"
          className="fixed left-4 top-4 z-[100] -translate-y-24 bg-brown px-4 py-3 text-sm text-bg-alt focus:translate-y-0"
        >
          Aller au contenu principal
        </a>
        <div className="relative">{props.children}</div>
        {!hidden.includes("cookie_banner") && (
          <CookieConsent text={blocks.cookie_banner?.text} />
        )}
        <AnalyticsScripts />
        {!hidden.includes("whatsapp") && (
          <WhatsappButton
            phones={siteSettings.phones}
            message={blocks.whatsapp?.message}
          />
        )}
      </body>
    </html>
  )
}
