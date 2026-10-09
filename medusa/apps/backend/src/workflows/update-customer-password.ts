import {
  createStep,
  createWorkflow,
  StepResponse,
  WorkflowResponse,
} from "@medusajs/framework/workflows-sdk"
import { MedusaError, Modules } from "@medusajs/framework/utils"

export type UpdateCustomerPasswordInput = {
  email: string
  new_password: string
}

const updateCustomerPasswordStep = createStep(
  "update-customer-password",
  async (input: UpdateCustomerPasswordInput, { container }) => {
    const authService = container.resolve(Modules.AUTH)
    const update = await authService.updateProvider("emailpass", {
      entity_id: input.email,
      password: input.new_password,
    })

    if (!update.success) {
      throw new MedusaError(
        MedusaError.Types.UNEXPECTED_STATE,
        update.error || "Password update failed."
      )
    }

    return new StepResponse(true)
  }
)

export const updateCustomerPasswordWorkflow = createWorkflow(
  "update-customer-password",
  (input: UpdateCustomerPasswordInput) => {
    const updated = updateCustomerPasswordStep(input)
    return new WorkflowResponse(updated)
  }
)