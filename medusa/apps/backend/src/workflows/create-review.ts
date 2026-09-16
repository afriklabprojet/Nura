import {
  createStep,
  createWorkflow,
  StepResponse,
  WorkflowResponse,
} from "@medusajs/framework/workflows-sdk"
import { ContainerRegistrationKeys, MedusaError } from "@medusajs/framework/utils"
import { REVIEW_MODULE } from "../modules/review"
import type ReviewModuleService from "../modules/review/service"
import { isValidRating } from "../lib/review-validation"

export type CreateReviewInput = {
  customer_id: string
  customer_name: string
  product_id: string
  rating: number
  title?: string
  content: string
}

const createReviewStep = createStep(
  "create-review",
  async (input: CreateReviewInput, { container }) => {
    const reviewModuleService: ReviewModuleService =
      container.resolve(REVIEW_MODULE)

    if (!isValidRating(input.rating)) {
      throw new MedusaError(
        MedusaError.Types.INVALID_DATA,
        "La note doit être un entier entre 1 et 5."
      )
    }

    const existing = await reviewModuleService.listReviews({
      customer_id: input.customer_id,
      product_id: input.product_id,
    })

    if (existing.length > 0) {
      throw new MedusaError(
        MedusaError.Types.INVALID_DATA,
        "Vous avez déjà laissé un avis pour ce produit."
      )
    }

    // Best-effort "verified purchase" check — a customer who bought the
    // product gets a trust badge on their review, but a failure here (e.g.
    // the order module being briefly unavailable) shouldn't block them from
    // submitting a review at all.
    let verifiedPurchase = false
    try {
      const query = container.resolve(ContainerRegistrationKeys.QUERY)
      const { data: orders } = await query.graph({
        entity: "order",
        fields: ["id", "items.product_id"],
        filters: { customer_id: input.customer_id },
      })
      verifiedPurchase = orders.some((order) =>
        (order.items || []).some((item) => item?.product_id === input.product_id)
      )
    } catch {
      verifiedPurchase = false
    }

    const review = await reviewModuleService.createReviews({
      customer_id: input.customer_id,
      customer_name: input.customer_name,
      product_id: input.product_id,
      rating: input.rating,
      title: input.title ?? null,
      content: input.content,
      verified_purchase: verifiedPurchase,
      status: "pending",
    })

    return new StepResponse(review, review.id)
  },
  async (reviewId, { container }) => {
    if (!reviewId) {
      return
    }
    const reviewModuleService: ReviewModuleService =
      container.resolve(REVIEW_MODULE)
    await reviewModuleService.deleteReviews([reviewId])
  }
)

export const createReviewWorkflow = createWorkflow(
  "create-review",
  (input: CreateReviewInput) => {
    const review = createReviewStep(input)
    return new WorkflowResponse(review)
  }
)
