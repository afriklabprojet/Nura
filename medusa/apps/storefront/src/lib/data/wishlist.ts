"use server"

import { sdk } from "@lib/config"
import { revalidateTag } from "@lib/util/revalidate"
import { getAuthHeaders, getCacheOptions, getCacheTag } from "./cookies"

export type WishlistItem = {
  id: string
  customer_id: string
  product_id: string
}

export async function listWishlist(): Promise<WishlistItem[]> {
  const authHeaders = await getAuthHeaders()
  if (!authHeaders) {
    return []
  }

  const next = { ...(await getCacheOptions("wishlist")) }

  return sdk.client
    .fetch<{ wishlist: WishlistItem[] }>("/store/customers/me/wishlist", {
      method: "GET",
      headers: authHeaders,
      next,
      cache: "force-cache",
    })
    .then(({ wishlist }) => wishlist)
    .catch(() => [])
}

export async function addToWishlist(productId: string) {
  const authHeaders = await getAuthHeaders()
  if (!authHeaders) {
    throw new Error("Vous devez être connecté(e) pour ajouter un favori.")
  }

  await sdk.client.fetch("/store/customers/me/wishlist", {
    method: "POST",
    headers: authHeaders,
    body: { product_id: productId },
  })

  const cacheTag = await getCacheTag("wishlist")
  revalidateTag(cacheTag)
}

export async function removeFromWishlist(productId: string) {
  const authHeaders = await getAuthHeaders()
  if (!authHeaders) {
    throw new Error("Vous devez être connecté(e) pour gérer vos favoris.")
  }

  await sdk.client.fetch(`/store/customers/me/wishlist/${productId}`, {
    method: "DELETE",
    headers: authHeaders,
  })

  const cacheTag = await getCacheTag("wishlist")
  revalidateTag(cacheTag)
}
