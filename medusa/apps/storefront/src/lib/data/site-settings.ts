"use server"

import { CONTACT_EMAIL, SERVICE_CLIENT_CONTACTS, SOCIAL_LINKS } from "@lib/constants"
import { getHomeContent } from "./home-content"

export type SitePhone = { label: string; tel: string; display: string }

export type SiteSettings = {
  email: string
  hours: string
  phones: SitePhone[]
  social: { instagram: string; tiktok: string }
}

const DEFAULTS: SiteSettings = {
  email: CONTACT_EMAIL,
  hours: "Du lundi au vendredi, 9h — 18h",
  phones: SERVICE_CLIENT_CONTACTS,
  social: SOCIAL_LINKS,
}

/**
 * Contact details and social links shown across the footer, nav, contact
 * page, FAQ and delivery page. Reads from the admin-editable "Réglages" —
 * falls back to the built-in defaults for whatever isn't configured yet, so
 * this can never come back empty.
 */
export const getSiteSettings = async (): Promise<SiteSettings> => {
  const { blocks } = await getHomeContent()
  const settings = blocks.site_settings

  return {
    email: settings?.email || DEFAULTS.email,
    hours: settings?.hours || DEFAULTS.hours,
    phones: settings?.phones?.length ? settings.phones : DEFAULTS.phones,
    social: {
      instagram: settings?.social?.instagram || DEFAULTS.social.instagram,
      tiktok: settings?.social?.tiktok || DEFAULTS.social.tiktok,
    },
  }
}
