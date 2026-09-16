import {
  createStep,
  createWorkflow,
  StepResponse,
  WorkflowResponse,
} from "@medusajs/framework/workflows-sdk"
import { Modules } from "@medusajs/framework/utils"
import { generateReferralCode } from "../lib/generate-referral-code"

export type AssignReferralCodeInput = {
  customer_id: string
}

type RollbackData = {
  customerId: string
  previousMetadata: Record<string, unknown>
}

const assignReferralCodeStep = createStep(
  "assign-referral-code",
  async (input: AssignReferralCodeInput, { container }) => {
    const customerModuleService = container.resolve(Modules.CUSTOMER)

    const customer = await customerModuleService.retrieveCustomer(input.customer_id)
    const metadata = (customer.metadata || {}) as Record<string, unknown>
    const existingCode = metadata.referral_code as string | undefined

    if (existingCode) {
      return new StepResponse<{ code: string }, RollbackData>({ code: existingCode })
    }

    const code = generateReferralCode()
    await customerModuleService.updateCustomers(input.customer_id, {
      metadata: { ...metadata, referral_code: code },
    })

    return new StepResponse<{ code: string }, RollbackData>(
      { code },
      { customerId: input.customer_id, previousMetadata: metadata }
    )
  },
  async (rollbackData, { container }) => {
    if (!rollbackData) {
      return
    }
    const customerModuleService = container.resolve(Modules.CUSTOMER)
    await customerModuleService.updateCustomers(rollbackData.customerId, {
      metadata: rollbackData.previousMetadata,
    })
  }
)

export const assignReferralCodeWorkflow = createWorkflow(
  "assign-referral-code",
  (input: AssignReferralCodeInput) => {
    const result = assignReferralCodeStep(input)
    return new WorkflowResponse(result)
  }
)
