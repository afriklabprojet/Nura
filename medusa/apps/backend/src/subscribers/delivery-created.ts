import type { SubscriberArgs, SubscriberConfig } from "@medusajs/framework"
import { ContainerRegistrationKeys } from "@medusajs/framework/utils"
import { getOrderAccessUrl, renderButton, renderEmailLayout } from "../lib/email-templates"
import { sendEmailNotificationWorkflow } from "../workflows/send-email-notification"

type DeliveryCreatedEvent = {
  id: string
  no_notification?: boolean
}

export default async function deliveryCreatedHandler({
  event: { data },
  container,
}: SubscriberArgs<DeliveryCreatedEvent>) {
  if (
    data.no_notification ||
    !process.env.RESEND_API_KEY ||
    !process.env.RESEND_FROM_EMAIL
  ) {
    return
  }

  const query = container.resolve(ContainerRegistrationKeys.QUERY)
  const {
    data: [fulfillment],
  } = await query.graph({
    entity: "fulfillment",
    fields: ["id", "order.id", "order.display_id", "order.email"],
    filters: { id: data.id },
  })
  const order = fulfillment?.order

  if (!order?.email) {
    return
  }

  const orderUrl = getOrderAccessUrl(order.id)

  await sendEmailNotificationWorkflow(container).run({
    input: {
      to: order.email,
      trigger_type: "delivery_created",
      resource_id: order.id,
      resource_type: "order",
      idempotency_key: `delivery-created:${fulfillment.id}`,
      subject: `Votre commande Nura n°${order.display_id} a été livrée`,
      html: renderEmailLayout(`
        <h1 style="font-size:20px;text-align:center;margin:0 0 16px;">Commande livrée</h1>
        <p style="font-size:14px;line-height:1.6;">
          La commande <strong>n°${order.display_id}</strong> est indiquée comme livrée.
          En cas de problème, contactez rapidement notre service client.
        </p>
        ${renderButton(orderUrl, "Voir ma commande")}
      `),
    },
  })
}

export const config: SubscriberConfig = {
  event: "delivery.created",
}
