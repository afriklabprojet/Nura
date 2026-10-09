import { HttpTypes } from "@medusajs/types"
import { describe, expect, it } from "vitest"
import {
  hasUnavailableCartItems,
  isCartItemUnavailable,
} from "../cart-availability"

const lineItem = (
  variant: Partial<HttpTypes.StoreProductVariant>,
  quantity = 1
) =>
  ({
    quantity,
    variant,
  }) as HttpTypes.StoreCartLineItem

describe("cart availability", () => {
  it("keeps unmanaged and backorderable items available", () => {
    expect(
      isCartItemUnavailable(lineItem({ manage_inventory: false }))
    ).toBe(false)
    expect(
      isCartItemUnavailable(
        lineItem({
          manage_inventory: true,
          allow_backorder: true,
          inventory_quantity: 0,
        })
      )
    ).toBe(false)
  })

  it("marks an item unavailable when inventory cannot cover its quantity", () => {
    expect(
      isCartItemUnavailable(
        lineItem({ manage_inventory: true, inventory_quantity: 0 })
      )
    ).toBe(true)
    expect(
      isCartItemUnavailable(
        lineItem({ manage_inventory: true, inventory_quantity: 1 }, 2)
      )
    ).toBe(true)
  })

  it("blocks a cart when any line is unavailable", () => {
    const cart = {
      items: [
        lineItem({ manage_inventory: false }),
        lineItem({ manage_inventory: true, inventory_quantity: 0 }),
      ],
    } as HttpTypes.StoreCart

    expect(hasUnavailableCartItems(cart)).toBe(true)
  })
})