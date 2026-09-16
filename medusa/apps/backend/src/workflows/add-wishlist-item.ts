import {
  createStep,
  createWorkflow,
  StepResponse,
  WorkflowResponse,
} from "@medusajs/framework/workflows-sdk"
import { WISHLIST_MODULE } from "../modules/wishlist"
import type WishlistModuleService from "../modules/wishlist/service"

export type AddWishlistItemInput = {
  customer_id: string
  product_id: string
}

const addWishlistItemStep = createStep(
  "add-wishlist-item",
  async (input: AddWishlistItemInput, { container }) => {
    const wishlistModuleService: WishlistModuleService =
      container.resolve(WISHLIST_MODULE)

    const existing = await wishlistModuleService.listWishlistItems({
      customer_id: input.customer_id,
      product_id: input.product_id,
    })

    const item =
      existing[0] ?? (await wishlistModuleService.createWishlistItems(input))

    return new StepResponse(item, existing[0] ? undefined : item.id)
  },
  async (createdItemId, { container }) => {
    if (!createdItemId) {
      return
    }
    const wishlistModuleService: WishlistModuleService =
      container.resolve(WISHLIST_MODULE)
    await wishlistModuleService.deleteWishlistItems([createdItemId])
  }
)

export const addWishlistItemWorkflow = createWorkflow(
  "add-wishlist-item",
  (input: AddWishlistItemInput) => {
    const item = addWishlistItemStep(input)
    return new WorkflowResponse(item)
  }
)
