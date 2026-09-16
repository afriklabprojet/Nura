import {
  AuthenticatedMedusaRequest,
  MedusaResponse,
} from "@medusajs/framework/http"
import { WISHLIST_MODULE } from "../../../../../modules/wishlist"
import type WishlistModuleService from "../../../../../modules/wishlist/service"
import { addWishlistItemWorkflow } from "../../../../../workflows/add-wishlist-item"

type AddToWishlistBody = {
  product_id?: string
}

export async function GET(
  req: AuthenticatedMedusaRequest,
  res: MedusaResponse
) {
  const wishlistModuleService: WishlistModuleService = req.scope.resolve(
    WISHLIST_MODULE
  )
  const customerId = req.auth_context.actor_id

  const items = await wishlistModuleService.listWishlistItems({
    customer_id: customerId,
  })

  return res.status(200).json({ wishlist: items })
}

export async function POST(
  req: AuthenticatedMedusaRequest<AddToWishlistBody>,
  res: MedusaResponse
) {
  const productId = req.body?.product_id
  if (!productId) {
    return res.status(400).json({ message: "product_id is required." })
  }

  const { result: item } = await addWishlistItemWorkflow(req.scope).run({
    input: {
      customer_id: req.auth_context.actor_id,
      product_id: productId,
    },
  })

  return res.status(200).json({ wishlist_item: item })
}
