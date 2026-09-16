import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { moderateReviewWorkflow } from "../../../../workflows/moderate-review"

type ModerateReviewBody = {
  status?: "approved" | "rejected"
}

export async function POST(
  req: MedusaRequest<ModerateReviewBody>,
  res: MedusaResponse
) {
  const status = req.body?.status

  if (status !== "approved" && status !== "rejected") {
    return res.status(400).json({
      message: "status doit être 'approved' ou 'rejected'.",
    })
  }

  const { result: review } = await moderateReviewWorkflow(req.scope).run({
    input: {
      review_id: req.params.id,
      status,
    },
  })

  return res.status(200).json({ review })
}
