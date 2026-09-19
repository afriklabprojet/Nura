import { OrderMessagesBlock } from "@lib/data/home-content"
import { HttpTypes } from "@medusajs/types"
import { Text } from "@modules/common/components/ui"

type OrderDetailsProps = {
  order: HttpTypes.StoreOrder
  showStatus?: boolean
  messages?: OrderMessagesBlock
}

const FULFILLMENT_STATUS_LABELS: Record<string, string> = {
  not_fulfilled: "Non préparée",
  partially_fulfilled: "Partiellement préparée",
  fulfilled: "Préparée",
  partially_shipped: "Partiellement expédiée",
  shipped: "Expédiée",
  partially_delivered: "Partiellement livrée",
  delivered: "Livrée",
  canceled: "Annulée",
}

const PAYMENT_STATUS_LABELS: Record<string, string> = {
  not_paid: "Non payée",
  awaiting: "En attente",
  captured: "Payée",
  partially_refunded: "Partiellement remboursée",
  refunded: "Remboursée",
  canceled: "Annulée",
  requires_action: "Action requise",
}

const DEFAULT_CONFIRMATION_TEXT =
  "Les détails de confirmation de votre commande ont été envoyés à {email}."

const OrderDetails = ({ order, showStatus, messages }: OrderDetailsProps) => {
  const formatStatus = (str: string, labels: Record<string, string>) => {
    if (labels[str]) {
      return labels[str]
    }

    const formatted = str.split("_").join(" ")

    return formatted.slice(0, 1).toUpperCase() + formatted.slice(1)
  }

  const [before, after] = (
    messages?.confirmation_email_text || DEFAULT_CONFIRMATION_TEXT
  ).split("{email}")

  return (
    <div>
      <Text>
        {before}
        <span
          className="text-ui-fg-medium-plus font-semibold"
          data-testid="order-email"
        >
          {order.email}
        </span>
        {after ?? ""}
      </Text>
      <Text className="mt-2">
        Date de commande :{" "}
        <span data-testid="order-date">
          {new Date(order.created_at).toLocaleDateString("fr-FR")}
        </span>
      </Text>
      <Text className="mt-2 text-ui-fg-interactive">
        N° de commande : <span data-testid="order-id">{order.display_id}</span>
      </Text>

      <div className="flex items-center text-compact-small gap-x-4 mt-4">
        {showStatus && (
          <>
            <Text>
              Statut de la commande :{" "}
              <span className="text-ui-fg-subtle " data-testid="order-status">
                {formatStatus(order.fulfillment_status, FULFILLMENT_STATUS_LABELS)}
              </span>
            </Text>
            <Text>
              Statut du paiement :{" "}
              <span
                className="text-ui-fg-subtle "
                data-testid="order-payment-status"
              >
                {formatStatus(order.payment_status, PAYMENT_STATUS_LABELS)}
              </span>
            </Text>
          </>
        )}
      </div>
    </div>
  )
}

export default OrderDetails
