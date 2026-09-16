"use server"

import { sdk } from "@lib/config"
import { getAuthHeaders, getCacheOptions } from "./cookies"

export type Review = {
  id: string
  customer_id: string
  customer_name: string
  product_id: string
  rating: number
  title: string | null
  content: string
  verified_purchase: boolean
  status: "pending" | "approved" | "rejected"
  created_at: string
}

export type ProductReviewsResponse = {
  reviews: Review[]
  average_rating: number
  count: number
  breakdown: { stars: number; count: number }[]
}

export async function listProductReviews(
  productId: string
): Promise<ProductReviewsResponse> {
  const next = { ...(await getCacheOptions(`reviews-${productId}`)) }

  return sdk.client
    .fetch<ProductReviewsResponse>(`/store/products/${productId}/reviews`, {
      method: "GET",
      next,
      cache: "force-cache",
    })
    .catch(() => ({
      reviews: [],
      average_rating: 0,
      count: 0,
      breakdown: [],
    }))
}

export type LatestReview = Review & {
  product: { id: string; title: string; handle: string } | null
}

export async function listLatestReviews(limit = 3): Promise<LatestReview[]> {
  const next = { ...(await getCacheOptions("reviews-latest")) }

  return sdk.client
    .fetch<{ reviews: LatestReview[] }>("/store/reviews", {
      method: "GET",
      query: { limit },
      next,
      cache: "force-cache",
    })
    .then(({ reviews }) => reviews)
    .catch(() => [])
}

export async function listMyReviews(): Promise<Review[]> {
  const authHeaders = await getAuthHeaders()
  if (!authHeaders) {
    return []
  }

  return sdk.client
    .fetch<{ reviews: Review[] }>("/store/customers/me/reviews", {
      method: "GET",
      headers: authHeaders,
      cache: "no-store",
    })
    .then(({ reviews }) => reviews)
    .catch(() => [])
}

export type CreateReviewState = {
  success: boolean
  error: string | null
}

export async function createReview(
  _prevState: CreateReviewState,
  formData: FormData
): Promise<CreateReviewState> {
  const authHeaders = await getAuthHeaders()
  if (!authHeaders) {
    return { success: false, error: "Vous devez être connecté(e) pour laisser un avis." }
  }

  const productId = formData.get("product_id")?.toString()
  const rating = Number(formData.get("rating"))
  const title = formData.get("title")?.toString().trim() || undefined
  const content = formData.get("content")?.toString().trim()

  if (!productId || !rating || !content) {
    return { success: false, error: "Merci de renseigner une note et un avis." }
  }

  return sdk.client
    .fetch("/store/customers/me/reviews", {
      method: "POST",
      headers: authHeaders,
      body: { product_id: productId, rating, title, content },
    })
    .then(() => ({ success: true, error: null }))
    .catch((err) => ({
      success: false,
      error: err instanceof Error ? err.message : "Une erreur est survenue.",
    }))
}
