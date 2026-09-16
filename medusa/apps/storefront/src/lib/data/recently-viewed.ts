"use server"

import { cookies as nextCookies } from "next/headers"
import { listProducts } from "./products"
import { HttpTypes } from "@medusajs/types"

const COOKIE_NAME = "_nura_recently_viewed"
const MAX_ITEMS = 8

export async function trackRecentlyViewed(handle: string) {
  const cookies = await nextCookies()
  const current = cookies.get(COOKIE_NAME)?.value
  let handles: string[] = []

  try {
    handles = current ? JSON.parse(current) : []
  } catch {
    handles = []
  }

  handles = [handle, ...handles.filter((h) => h !== handle)].slice(0, MAX_ITEMS)

  cookies.set(COOKIE_NAME, JSON.stringify(handles), {
    maxAge: 60 * 60 * 24 * 30,
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
  })
}

async function getRecentlyViewedHandles(
  excludeHandle?: string
): Promise<string[]> {
  const cookies = await nextCookies()
  const current = cookies.get(COOKIE_NAME)?.value

  try {
    const handles: string[] = current ? JSON.parse(current) : []
    return handles.filter((h) => h !== excludeHandle)
  } catch {
    return []
  }
}

export async function listRecentlyViewedProducts({
  regionId,
  excludeHandle,
}: {
  regionId: string
  excludeHandle?: string
}): Promise<HttpTypes.StoreProduct[]> {
  const handles = await getRecentlyViewedHandles(excludeHandle)

  if (handles.length === 0) {
    return []
  }

  const {
    response: { products },
  } = await listProducts({
    regionId,
    queryParams: {
      handle: handles,
      fields: "*variants.calculated_price",
    },
  })

  // Re-sort to match the visit order (most recent first) — listProducts
  // doesn't guarantee the `handle` filter's input order is preserved.
  const byHandle = new Map(products.map((p) => [p.handle, p]))
  return handles
    .map((h) => byHandle.get(h))
    .filter((p): p is HttpTypes.StoreProduct => !!p)
}
