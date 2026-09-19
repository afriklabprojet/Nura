"use client"

import { AccountMessagesBlock } from "@lib/data/home-content"
import { Button } from "@modules/common/components/ui"

import OrderCard from "../order-card"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import { HttpTypes } from "@medusajs/types"

const OrderOverview = ({
  orders,
  messages,
}: {
  orders: HttpTypes.StoreOrder[]
  messages?: AccountMessagesBlock
}) => {
  if (orders?.length) {
    return (
      <div className="flex flex-col gap-y-8 w-full">
        {orders.map((o) => (
          <div
            key={o.id}
            className="border-b border-gray-200 pb-6 last:pb-0 last:border-none"
          >
            <OrderCard order={o} />
          </div>
        ))}
      </div>
    )
  }

  return (
    <div
      className="w-full flex flex-col items-center gap-y-4"
      data-testid="no-orders-container"
    >
      <h2 className="text-large-semi">
        {messages?.order_overview_empty_title || "Rien à afficher ici"}
      </h2>
      <p className="text-base-regular">
        {messages?.order_overview_empty_text ||
          "Vous n'avez pas encore de commande, changeons ça :)"}
      </p>
      <div className="mt-4">
        <LocalizedClientLink href="/" passHref>
          <Button data-testid="continue-shopping-button">
            Continuer mes achats
          </Button>
        </LocalizedClientLink>
      </div>
    </div>
  )
}

export default OrderOverview
