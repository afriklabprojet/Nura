import {
  createStep,
  createWorkflow,
  StepResponse,
  WorkflowResponse,
} from "@medusajs/framework/workflows-sdk"
import { NEWSLETTER_MODULE } from "../modules/newsletter"
import type NewsletterModuleService from "../modules/newsletter/service"

export type SubscribeToNewsletterInput = {
  email: string
}

// A single-step workflow with no compensation: on failure there's nothing
// to roll back beyond what a duplicate/failed insert already leaves as-is.
const subscribeToNewsletterStep = createStep(
  "subscribe-to-newsletter",
  async (input: SubscribeToNewsletterInput, { container }) => {
    const newsletterModuleService: NewsletterModuleService =
      container.resolve(NEWSLETTER_MODULE)

    try {
      await newsletterModuleService.createNewsletterSubscribers(input)
    } catch (error) {
      // A unique constraint violation just means this email is already
      // subscribed — treat it as success rather than leak that distinction
      // to the client (avoids using this endpoint to check who's signed up).
      // MedusaService's own generated create method throws this wrapped
      // "already exists" error rather than the raw Postgres one.
      const message = error instanceof Error ? error.message : String(error)
      if (!message.toLowerCase().includes("already exists")) {
        throw error
      }
    }

    return new StepResponse({ email: input.email })
  }
)

export const subscribeToNewsletterWorkflow = createWorkflow(
  "subscribe-to-newsletter",
  (input: SubscribeToNewsletterInput) => {
    const subscriber = subscribeToNewsletterStep(input)
    return new WorkflowResponse(subscriber)
  }
)
