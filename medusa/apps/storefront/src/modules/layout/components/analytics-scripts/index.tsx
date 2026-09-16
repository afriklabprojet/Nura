"use client"

import Script from "next/script"
import { usePathname, useSearchParams } from "next/navigation"
import { Suspense, useEffect, useRef, useState } from "react"

import {
  CONSENT_CHANGE_EVENT,
  readConsent,
} from "@lib/util/cookie-consent"

declare global {
  interface Window {
    dataLayer?: unknown[]
    gtag?: (...args: unknown[]) => void
    fbq?: (...args: unknown[]) => void
    ttq?: { page?: () => void; track?: (...args: unknown[]) => void }
  }
}

const GA_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID
const META_PIXEL_ID = process.env.NEXT_PUBLIC_META_PIXEL_ID
const TIKTOK_PIXEL_ID = process.env.NEXT_PUBLIC_TIKTOK_PIXEL_ID

// Fires a page_view / PageView on client-side route changes. The initial
// load is already tracked by each pixel's own init snippet below — this
// only covers subsequent navigations, which the Next.js App Router doesn't
// trigger a full page load for.
const RouteChangeTracker = () => {
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const isFirstRender = useRef(true)

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false
      return
    }

    const url = searchParams.toString()
      ? `${pathname}?${searchParams.toString()}`
      : pathname

    window.gtag?.("event", "page_view", { page_path: url })
    window.fbq?.("track", "PageView")
    window.ttq?.page?.()
  }, [pathname, searchParams])

  return null
}

const AnalyticsScripts = () => {
  const [analyticsConsent, setAnalyticsConsent] = useState(false)

  useEffect(() => {
    setAnalyticsConsent(readConsent()?.analytics ?? false)

    const handleChange = (event: Event) => {
      const detail = (event as CustomEvent<{ analytics: boolean }>).detail
      setAnalyticsConsent(!!detail?.analytics)
    }

    window.addEventListener(CONSENT_CHANGE_EVENT, handleChange)
    return () => window.removeEventListener(CONSENT_CHANGE_EVENT, handleChange)
  }, [])

  if (!analyticsConsent || (!GA_ID && !META_PIXEL_ID && !TIKTOK_PIXEL_ID)) {
    return null
  }

  return (
    <>
      {GA_ID && (
        <>
          <Script
            src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`}
            strategy="afterInteractive"
          />
          <Script id="ga4-init" strategy="afterInteractive">
            {`
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', '${GA_ID}');
              window.gtag = gtag;
            `}
          </Script>
        </>
      )}

      {META_PIXEL_ID && (
        <Script id="meta-pixel-init" strategy="afterInteractive">
          {`
            !function(f,b,e,v,n,t,s)
            {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
            n.callMethod.apply(n,arguments):n.queue.push(arguments)};
            if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
            n.queue=[];t=b.createElement(e);t.async=!0;
            t.src=v;s=b.getElementsByTagName(e)[0];
            s.parentNode.insertBefore(t,s)}(window, document,'script',
            'https://connect.facebook.net/en_US/fbevents.js');
            fbq('init', '${META_PIXEL_ID}');
            fbq('track', 'PageView');
          `}
        </Script>
      )}

      {TIKTOK_PIXEL_ID && (
        <Script id="tiktok-pixel-init" strategy="afterInteractive">
          {`
            !function (w, d, t) {
              w.TiktokAnalyticsObject=t;var ttq=w[t]=w[t]||[];ttq.methods=["page","track","identify","instances","debug","on","off","once","ready","alias","group","enableCookie","disableCookie","holdConsent","revokeConsent","grantConsent"],ttq.setAndDefer=function(t,e){t[e]=function(){t.push([e].concat(Array.prototype.slice.call(arguments,0)))}};for(var i=0;i<ttq.methods.length;i++)ttq.setAndDefer(ttq,ttq.methods[i]);ttq.instance=function(t){for(var e=ttq._i[t]||[],n=0;n<e.length;n++)ttq.setAndDefer(e,e[n]);return e},ttq.load=function(e,n){var i="https://analytics.tiktok.com/i18n/pixel/events.js",o=n&&n.partner;ttq._i=ttq._i||{},ttq._i[e]=[],ttq._i[e]._u=i,ttq._t=ttq._t||{},ttq._t[e]=+new Date,ttq._o=ttq._o||{},ttq._o[e]=n||{};var a=document.createElement("script");a.type="text/javascript",a.async=!0,a.src=i+"?sdkid="+e+"&lib="+t;var s=document.getElementsByTagName("script")[0];s.parentNode.insertBefore(a,s)};
              ttq.load('${TIKTOK_PIXEL_ID}');
              ttq.page();
            }(window, document, 'ttq');
          `}
        </Script>
      )}

      <Suspense fallback={null}>
        <RouteChangeTracker />
      </Suspense>
    </>
  )
}

export default AnalyticsScripts
