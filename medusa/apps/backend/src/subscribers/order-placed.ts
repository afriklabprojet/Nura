import type { SubscriberArgs, SubscriberConfig } from "@medusajs/framework"
import { ContainerRegistrationKeys } from "@medusajs/framework/utils"
import { sendEmailNotificationWorkflow } from "../workflows/send-email-notification"
import { renderEmailLayout, renderButton, getStorefrontUrl } from "../lib/email-templates"
import { formatMoney } from "../lib/format-money"

type OrderPlacedEvent = {
  id: string
}

export default async function orderPlacedHandler({
  event: { data },
  container,
}: SubscriberArgs<OrderPlacedEvent>) {
  if (!process.env.RESEND_API_KEY || !process.env.RESEND_FROM_EMAIL) {
    return
  }

  const query = container.resolve(ContainerRegistrationKeys.QUERY)

  const {
    data: [order],
  } = await query.graph({
    entity: "order",
    fields: [
      "id",
      "display_id",
      "email",
      "currency_code",
      "total",
      "shipping_address.*",
      "items.title",
      "items.quantity",
      "items.total",
    ],
    filters: { id: data.id },
  })

  if (!order?.email) {
    return
  }

  const itemsHtml = (order.items || [])
    .filter((item): item is NonNullable<typeof item> => item !== null)
    .map(
      (item) => `
        <tr>
          <td style="padding:8px 0;font-size:14px;border-bottom:1px solid #E7D3C0;">
            ${item.title} × ${item.quantity}
          </td>
          <td style="padding:8px 0;font-size:14px;text-align:right;border-bottom:1px solid #E7D3C0;">
            ${formatMoney(item.total || 0, order.currency_code)}
          </td>
        </tr>
      `
    )
    .join("")

  const orderUrl = `${getStorefrontUrl()}/order/${order.id}/confirmed`

  await sendEmailNotificationWorkflow(container).run({
    input: {
      to: order.email,
      trigger_type: "order_placed",
      subject: `Confirmation de votre commande Nura n°${order.display_id}`,
      html: renderEmailLayout(`
        <h1 style="font-size:20px;text-align:center;margin:0 0 16px;">Merci pour votre commande</h1>
        <p style="font-size:14px;line-height:1.6;">
          Votre commande <strong>n°${order.display_id}</strong> a bien été
          enregistrée. Voici un récapitulatif :
        </p>
        <table style="width:100%;border-collapse:collapse;margin:16px 0;">
          ${itemsHtml}
          <tr>
            <td style="padding:12px 0 0;font-size:14px;font-weight:bold;">Total</td>
            <td style="padding:12px 0 0;font-size:14px;font-weight:bold;text-align:right;">
              ${formatMoney(order.total || 0, order.currency_code)}
            </td>
          </tr>
        </table>
        ${renderButton(orderUrl, "Suivre ma commande")}
      `),
    },
  })
}

export const config: SubscriberConfig = {
  event: "order.placed",
}
