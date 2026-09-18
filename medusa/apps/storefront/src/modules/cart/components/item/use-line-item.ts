"use client"

import { updateLineItem } from "@lib/data/cart"
import { HttpTypes } from "@medusajs/types"
import { useState } from "react"

/** Quantity handling shared by the phone card and the desktop table row. */
export const useLineItem = (item: HttpTypes.StoreCartLineItem) => {
  const [updating, setUpdating] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const changeQuantity = async (quantity: number) => {
    setError(null)
    setUpdating(true)

    await updateLineItem({ lineId: item.id, quantity })
      .catch((err) => setError(err.message))
      .finally(() => setUpdating(false))
  }

  const maxQuantity =
    !item.variant?.manage_inventory || item.variant?.allow_backorder
      ? 10
      : Math.min(item.variant?.inventory_quantity ?? 0, 10)

  return { updating, error, changeQuantity, maxQuantity }
}
