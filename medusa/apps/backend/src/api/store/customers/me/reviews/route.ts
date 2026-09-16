import {
  AuthenticatedMedusaRequest,
  MedusaResponse,
} from "@medusajs/framework/http"
import { ContainerRegistrationKeys } from "@medusajs/framework/utils"
import { REVIEW_MODULE } from "../../../../../modules/review"
import type ReviewModuleService from "../../../../../modules/review/service"
import { createReviewWorkflow } from "../../../../../workflows/create-review"

type CreateReviewBody = {
  product_id?: string
  rating?: number
  title?: string
  content?: string
}

export async function GET(
  req: AuthenticatedMedusaRequest,
  res: MedusaResponse
) {
  const reviewModuleService: ReviewModuleService = req.scope.resolve(REVIEW_MODULE)

  const reviews = await reviewModuleService.listReviews({
    customer_id: req.auth_context.actor_id,
  })

  return res.status(200).json({ reviews })
}

export async function POST(
  req: AuthenticatedMedusaRequest<CreateReviewBody>,
  res: MedusaResponse
) {
  const { product_id, rating, title, content } = req.body ?? {}

  if (!product_id || !rating || !content?.trim()) {
    return res.status(400).json({
      message: "product_id, rating et content sont requis.",
    })
  }

  const customerId = req.auth_context.actor_id

  const query = req.scope.resolve(ContainerRegistrationKeys.QUERY)
  const {
    data: [customer],
  } = await query.graph({
    entity: "customer",
    fields: ["first_name", "last_name", "email"],
    filters: { id: customerId },
  })

  const customerName =
    [customer?.first_name, customer?.last_name].filter(Boolean).join(" ") ||
    customer?.email ||
    "Client Nura"

  const { result: review } = await createReviewWorkflow(req.scope).run({
    input: {
      customer_id: customerId,
      customer_name: customerName,
      product_id,
      rating,
      title,
      content: content.trim(),
    },
  })

  return res.status(200).json({ review })
}
