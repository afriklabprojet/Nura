"use server"

import { sdk } from "@lib/config"
import { getCacheOptions } from "./cookies"

export type Post = {
  id: string
  title: string
  handle: string
  excerpt: string | null
  content: string
  cover_image: string | null
  author: string | null
  seo_title: string | null
  seo_description: string | null
  published_at: string | null
}

export const listPosts = async (limit = 12, offset = 0) => {
  const next = { ...(await getCacheOptions("journal")) }

  return sdk.client
    .fetch<{ posts: Post[]; count: number }>("/store/journal", {
      method: "GET",
      query: { limit, offset },
      next: { ...next, revalidate: 60 },
      cache: "force-cache",
    })
    .catch(() => ({ posts: [], count: 0 }))
}

export const getPost = async (handle: string) => {
  const next = { ...(await getCacheOptions(`journal-${handle}`)) }

  return sdk.client
    .fetch<{ post: Post; related: Post[] }>(
      `/store/journal/${encodeURIComponent(handle)}`,
      { method: "GET", next: { ...next, revalidate: 60 }, cache: "force-cache" }
    )
    .catch(() => null)
}
