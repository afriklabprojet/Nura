"use server"

import { getHomeContent } from "./home-content"

export type SitePhone = { label: string; tel: string; display: string }

export type SiteSettings = {
  email: string
  hours: string
  phones: SitePhone[]
  social: { instagram: string; tiktok: string }
}

const DEFAULTS: SiteSettings = {
  email: "",
  hours: "",
  phones: [],
  social: { instagram: "", tiktok: "" },
}

/**
 * Contact details and social links shown across the footer, nav, contact
 * page, FAQ and delivery page. Reads from the admin-editable "Réglages" —
 * has no duplicated contact fallback: the CMS record is the source of truth.
 */
export const getSiteSettings = async (): Promise<SiteSettings> => {
  const { blocks, hidden } = await getHomeContent()
  const settings = hidden.includes("site_settings")
    ? undefined
    : blocks.site_settings

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
