import {
  createStep,
  createWorkflow,
  StepResponse,
  WorkflowResponse,
} from "@medusajs/framework/workflows-sdk"
import { WISHLIST_MODULE } from "../modules/wishlist"
import type WishlistModuleService from "../modules/wishlist/service"

export type RemoveWishlistItemInput = {
  customer_id: string
  product_id: string
}

const removeWishlistItemStep = createStep(
  "remove-wishlist-item",
  async (input: RemoveWishlistItemInput, { container }) => {
    const wishlistModuleService: WishlistModuleService =
      container.resolve(WISHLIST_MODULE)

    const existing = await wishlistModuleService.listWishlistItems({
      customer_id: input.customer_id,
      product_id: input.product_id,
    })

    if (existing.length > 0) {
      await wishlistModuleService.deleteWishlistItems(
        existing.map((item) => item.id)
      )
    }

    return new StepResponse({ success: true })
  }
)

export const removeWishlistItemWorkflow = createWorkflow(
  "remove-wishlist-item",
  (input: RemoveWishlistItemInput) => {
    const result = removeWishlistItemStep(input)
    return new WorkflowResponse(result)
  }
)
