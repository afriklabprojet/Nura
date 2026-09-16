import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { REVIEW_MODULE } from "../../../../../modules/review"
import type ReviewModuleService from "../../../../../modules/review/service"

export async function GET(req: MedusaRequest, res: MedusaResponse) {
  const reviewModuleService: ReviewModuleService = req.scope.resolve(REVIEW_MODULE)

  const reviews = await reviewModuleService.listReviews(
    {
      product_id: req.params.id,
      status: "approved",
    },
    { order: { created_at: "DESC" } }
  )

  const count = reviews.length
  const average =
    count > 0
      ? Math.round((reviews.reduce((sum, r) => sum + r.rating, 0) / count) * 10) / 10
      : 0

  const breakdown = [5, 4, 3, 2, 1].map((stars) => ({
    stars,
    count: reviews.filter((r) => r.rating === stars).length,
  }))

  return res.status(200).json({
    reviews,
    average_rating: average,
    count,
    breakdown,
  })
}
