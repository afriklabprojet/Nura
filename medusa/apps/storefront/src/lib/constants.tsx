import { CreditCard } from "@medusajs/icons"
import Bancontact from "@modules/common/icons/bancontact"
import Ideal from "@modules/common/icons/ideal"
import PayPal from "@modules/common/icons/paypal"
import React from "react"

/* Map of payment provider_id to their title and icon. Add in any payment providers you want to use. */
export const paymentInfoMap: Record<
  string,
  { title: string; icon: React.JSX.Element }
> = {
  pp_stripe_stripe: {
    title: "Carte bancaire",
    icon: <CreditCard />,
  },
  "pp_medusa-payments_default": {
    title: "Carte bancaire",
    icon: <CreditCard />,
  },
  "pp_stripe-ideal_stripe": {
    title: "iDeal",
    icon: <Ideal />,
  },
  "pp_stripe-bancontact_stripe": {
    title: "Bancontact",
    icon: <Bancontact />,
  },
  pp_paypal_paypal: {
    title: "PayPal",
    icon: <PayPal />,
  },
  pp_system_default: {
    title: "Paiement manuel",
    icon: <CreditCard />,
  },
  pp_jeko_jeko: {
    title: "Mobile Money (Jèko)",
    icon: <CreditCard />,
  },
  // Add more payment providers here
}

// This only checks if it is native stripe or medusa payments for card payments, it ignores the other stripe-based providers
export const isStripeLike = (providerId?: string) => {
  return (
    providerId?.startsWith("pp_stripe_") || providerId?.startsWith("pp_medusa-")
  )
}

export const isPaypal = (providerId?: string) => {
  return providerId?.startsWith("pp_paypal")
}
export const isManual = (providerId?: string) => {
  return providerId?.startsWith("pp_system_default")
}

// Persists a customer's explicit country choice (see CountrySelect / the
// storefront middleware's `resolveCountry`) so it survives a fresh visit
// with no country in the URL, and so it isn't silently overridden by
// GeoIP/locale detection on the next visit.
export const MARKET_PREF_COOKIE = "_nura_market_pref"
export const REFERRAL_CODE_COOKIE = "_nura_referral_code"

export const isJeko = (providerId?: string) => {
  return providerId?.startsWith("pp_jeko_")
}

export const jekoWallets: { value: string; label: string }[] = [
  { value: "wave", label: "Wave" },
  { value: "orange", label: "Orange Money" },
  { value: "mtn", label: "MTN Mobile Money" },
  { value: "moov", label: "Moov Money" },
  { value: "djamo", label: "Djamo" },
]

// Add currencies that don't need to be divided by 100
export const noDivisionCurrencies = [
  "krw",
  "jpy",
  "vnd",
  "clp",
  "pyg",
  "xaf",
  "xof",
  "bif",
  "djf",
  "gnf",
  "kmf",
  "mga",
  "rwf",
  "xpf",
  "htg",
  "vuv",
  "xag",
  "xdr",
  "xau",
]

// --- Customer service contacts (single source of truth) ---
export const CONTACT_EMAIL = "contact@nura-paris.com"

export type ServiceClientContact = {
  label: string
  tel: string
  display: string
}

export const SERVICE_CLIENT_CONTACTS: ServiceClientContact[] = [
  { label: "France", tel: "+33745064887", display: "+33 7 45 06 48 87" },
  { label: "Abidjan", tel: "+2250505798882", display: "+225 05 05 79 88 82" },
]

export const SOCIAL_LINKS = {
  instagram: "https://instagram.com/nura",
  tiktok: "https://tiktok.com/@nura",
}

// Editorial artwork used when a category has no product image of its own.
const CATEGORY_IMAGES: Record<string, string> = {
  parfums: "/images/category-parfums.webp",
  bodycare: "/images/category-bodycare.webp",
  coffrets: "/images/category-coffrets.webp",
}

/** The curated artwork for a category, or undefined if it has none. */
export const findCategoryImage = (handle?: string | null) =>
  (handle && CATEGORY_IMAGES[handle]) || undefined

export const getCategoryImage = (handle?: string | null) =>
  findCategoryImage(handle) || "/images/editorial.webp"

const CATEGORY_BANNERS: Record<string, string> = {
  parfums: "/images/banner-parfums.webp",
  bodycare: "/images/banner-bodycare.webp",
  coffrets: "/images/banner-coffrets.webp",
}

export const getCategoryBanner = (handle?: string | null) =>
  (handle && CATEGORY_BANNERS[handle]) || "/images/banner-default.webp"
