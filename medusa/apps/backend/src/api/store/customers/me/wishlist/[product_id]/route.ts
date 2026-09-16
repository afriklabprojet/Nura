import {
  AuthenticatedMedusaRequest,
  MedusaResponse,
} from "@medusajs/framework/http"
import { removeWishlistItemWorkflow } from "../../../../../../workflows/remove-wishlist-item"

export async function DELETE(
  req: AuthenticatedMedusaRequest,
  res: MedusaResponse
) {
  await removeWishlistItemWorkflow(req.scope).run({
    input: {
      customer_id: req.auth_context.actor_id,
      product_id: req.params.product_id,
    },
  })

  return res.status(200).json({ success: true })
}
