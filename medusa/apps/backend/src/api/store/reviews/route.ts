import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { ContainerRegistrationKeys } from "@medusajs/framework/utils"
import { REVIEW_MODULE } from "../../../modules/review"
import type ReviewModuleService from "../../../modules/review/service"

const DEFAULT_LIMIT = 6

export async function GET(req: MedusaRequest, res: MedusaResponse) {
  const reviewModuleService: ReviewModuleService = req.scope.resolve(
    REVIEW_MODULE
  )
  const query = req.scope.resolve(ContainerRegistrationKeys.QUERY)

  const limit = Math.min(Number(req.query.limit) || DEFAULT_LIMIT, 24)
  const minRating = Number(req.query.min_rating) || 4

  const reviews = await reviewModuleService.listReviews(
    { status: "approved" },
    { order: { created_at: "DESC" } }
  )

  const selected = reviews
    .filter((review) => review.rating >= minRating)
    .slice(0, limit)

  if (selected.length === 0) {
    return res.status(200).json({ reviews: [] })
  }

  const { data: products } = await query.graph({
    entity: "product",
    fields: ["id", "title", "handle"],
    filters: { id: selected.map((review) => review.product_id) },
  })

  const productById = new Map(products.map((product) => [product.id, product]))

  return res.status(200).json({
    reviews: selected.map((review) => ({
      ...review,
      product: productById.get(review.product_id) ?? null,
    })),
  })
}
