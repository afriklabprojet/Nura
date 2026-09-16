import {
  createStep,
  createWorkflow,
  StepResponse,
  WorkflowResponse,
} from "@medusajs/framework/workflows-sdk"
import { REVIEW_MODULE } from "../modules/review"
import type ReviewModuleService from "../modules/review/service"

export type ModerateReviewInput = {
  review_id: string
  status: "approved" | "rejected"
}

const moderateReviewStep = createStep(
  "moderate-review",
  async (input: ModerateReviewInput, { container }) => {
    const reviewModuleService: ReviewModuleService =
      container.resolve(REVIEW_MODULE)

    const review = await reviewModuleService.updateReviews({
      id: input.review_id,
      status: input.status,
    })

    return new StepResponse(review)
  }
)

export const moderateReviewWorkflow = createWorkflow(
  "moderate-review",
  (input: ModerateReviewInput) => {
    const review = moderateReviewStep(input)
    return new WorkflowResponse(review)
  }
)
