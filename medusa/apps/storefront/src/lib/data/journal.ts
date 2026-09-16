"use server"

import { sdk } from "@lib/config"

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

// Invalidated by the backend when an article is saved, published or deleted;
// the long window is the fallback if that call cannot get through.
const JOURNAL_CACHE = { tags: ["journal"], revalidate: 3600 }

export const listPosts = async (limit = 12, offset = 0) => {
  return sdk.client
    .fetch<{ posts: Post[]; count: number }>("/store/journal", {
      method: "GET",
      query: { limit, offset },
      next: JOURNAL_CACHE,
      cache: "force-cache",
    })
    .catch(() => ({ posts: [], count: 0 }))
}

export const getPost = async (handle: string) => {
  return sdk.client
    .fetch<{ post: Post; related: Post[] }>(
      `/store/journal/${encodeURIComponent(handle)}`,
      { method: "GET", next: JOURNAL_CACHE, cache: "force-cache" }
    )
    .catch(() => null)
}
