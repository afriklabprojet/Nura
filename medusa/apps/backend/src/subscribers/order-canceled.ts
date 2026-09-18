import type { SubscriberArgs, SubscriberConfig } from "@medusajs/framework"
import { ContainerRegistrationKeys } from "@medusajs/framework/utils"
import { getOrderAccessUrl, renderButton, renderEmailLayout } from "../lib/email-templates"
import { sendEmailNotificationWorkflow } from "../workflows/send-email-notification"

type OrderCanceledEvent = {
  id: string
}

export default async function orderCanceledHandler({
  event: { data },
  container,
}: SubscriberArgs<OrderCanceledEvent>) {
  if (!process.env.RESEND_API_KEY || !process.env.RESEND_FROM_EMAIL) {
    return
  }

  const query = container.resolve(ContainerRegistrationKeys.QUERY)
  const {
    data: [order],
  } = await query.graph({
    entity: "order",
    fields: ["id", "display_id", "email"],
    filters: { id: data.id },
  })

  if (!order?.email) {
    return
  }

  const orderUrl = getOrderAccessUrl(order.id)

  await sendEmailNotificationWorkflow(container).run({
    input: {
      to: order.email,
      trigger_type: "order_canceled",
      resource_id: order.id,
      resource_type: "order",
      idempotency_key: `order-canceled:${order.id}`,
      subject: `Annulation de votre commande Nura n°${order.display_id}`,
      html: renderEmailLayout(`
        <h1 style="font-size:20px;text-align:center;margin:0 0 16px;">Commande annulée</h1>
        <p style="font-size:14px;line-height:1.6;">
          Votre commande <strong>n°${order.display_id}</strong> a été annulée.
          Si un paiement avait déjà été encaissé, son remboursement est traité
          séparément et vous recevrez une confirmation dédiée.
        </p>
        ${renderButton(orderUrl, "Voir ma commande")}
      `),
    },
  })
}

export const config: SubscriberConfig = {
  event: "order.canceled",
}
