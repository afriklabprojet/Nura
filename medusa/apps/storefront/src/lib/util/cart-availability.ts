import { HttpTypes } from "@medusajs/types"

export const isCartItemUnavailable = (
  item: HttpTypes.StoreCartLineItem
) =>
  Boolean(
    item.variant?.manage_inventory &&
      !item.variant.allow_backorder &&
      (item.variant.inventory_quantity ?? 0) < item.quantity
  )

export const hasUnavailableCartItems = (cart: HttpTypes.StoreCart) =>
  cart.items?.some(isCartItemUnavailable) ?? false