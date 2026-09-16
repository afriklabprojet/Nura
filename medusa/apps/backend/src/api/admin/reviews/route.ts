import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { REVIEW_MODULE } from "../../../modules/review"
import type ReviewModuleService from "../../../modules/review/service"

export async function GET(req: MedusaRequest, res: MedusaResponse) {
  const reviewModuleService: ReviewModuleService = req.scope.resolve(REVIEW_MODULE)

  const status = req.query.status as string | undefined
  const productId = req.query.product_id as string | undefined

  const filters: Record<string, unknown> = {}
  if (status) {
    filters.status = status
  }
  if (productId) {
    filters.product_id = productId
  }

  const reviews = await reviewModuleService.listReviews(filters, {
    order: { created_at: "DESC" },
  })

  return res.status(200).json({ reviews })
}
