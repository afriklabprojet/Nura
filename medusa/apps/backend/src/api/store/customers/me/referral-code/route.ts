import {
  AuthenticatedMedusaRequest,
  MedusaResponse,
} from "@medusajs/framework/http"
import { assignReferralCodeWorkflow } from "../../../../../workflows/assign-referral-code"

export async function GET(
  req: AuthenticatedMedusaRequest,
  res: MedusaResponse
) {
  const customerId = req.auth_context.actor_id

  const {
    result: { code },
  } = await assignReferralCodeWorkflow(req.scope).run({
    input: { customer_id: customerId },
  })

  return res.status(200).json({ code })
}
