"use server"

import { sdk } from "@lib/config"

export type HeroBlock = {
  eyebrow?: string
  title?: string
  text?: string
  cta_label?: string
  cta_href?: string
  secondary_label?: string
  secondary_href?: string
  image?: string
  image_mobile?: string
  video?: string
}

export type CampaignBlock = {
  eyebrow?: string
  title?: string
  text?: string
  cta_label?: string
  cta_href?: string
  image?: string
  image_mobile?: string
}

export type EssentialsBlock = {
  title?: string
  subtitle?: string
  handles?: string
}

export type HomeBlocks = {
  hero?: HeroBlock
  campaign?: CampaignBlock
  essentials?: EssentialsBlock
}

export type HomeContent = {
  blocks: HomeBlocks
  /** Keys the admin has switched off, or that are outside their dates. */
  hidden: string[]
}

/**
 * What the admin has configured for the home page. Absent or switched-off
 * blocks come back empty and each section falls back to its own defaults.
 *
 * The cache is dropped by the backend the moment an editor saves (see the
 * content-revalidate subscriber); the hour-long window is only a safety net
 * for when that call cannot get through.
 */
export const getHomeContent = async (): Promise<HomeContent> => {
  return sdk.client
    .fetch<HomeContent>("/store/home-content", {
      method: "GET",
      next: { tags: ["home-content"], revalidate: 3600 },
      cache: "force-cache",
    })
    .then((content) => ({
      blocks: content.blocks || {},
      hidden: content.hidden || [],
    }))
    .catch(() => ({ blocks: {}, hidden: [] }))
}
