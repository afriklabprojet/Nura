import type { SubscriberArgs, SubscriberConfig } from "@medusajs/framework"
import { ContainerRegistrationKeys } from "@medusajs/framework/utils"
import { getOrderAccessUrl, renderButton, renderEmailLayout } from "../lib/email-templates"
import { formatMoney } from "../lib/format-money"
import { sendEmailNotificationWorkflow } from "../workflows/send-email-notification"

type PaymentRefundedEvent = {
  id: string
}

export default async function paymentRefundedHandler({
  event: { data },
  container,
}: SubscriberArgs<PaymentRefundedEvent>) {
  if (!process.env.RESEND_API_KEY || !process.env.RESEND_FROM_EMAIL) {
    return
  }

  const query = container.resolve(ContainerRegistrationKeys.QUERY)
  const {
    data: [payment],
  } = await query.graph({
    entity: "payment",
    fields: [
      "id",
      "currency_code",
      "refunds.amount",
      "payment_collection.order.id",
      "payment_collection.order.display_id",
      "payment_collection.order.email",
    ],
    filters: { id: data.id },
  })
  const order = payment?.payment_collection?.order
  const refundedAmount = (payment?.refunds || []).reduce(
    (total, refund) => total + Number(refund?.amount || 0),
    0
  )

  if (!order?.email || !refundedAmount) {
    return
  }

  const orderUrl = getOrderAccessUrl(order.id)
  const refundText = formatMoney(refundedAmount, payment.currency_code)

  await sendEmailNotificationWorkflow(container).run({
    input: {
      to: order.email,
      trigger_type: "payment_refunded",
      resource_id: order.id,
      resource_type: "order",
      idempotency_key: `payment-refunded:${payment.id}:${refundedAmount}`,
      subject: `Remboursement de votre commande Nura n°${order.display_id}`,
      html: renderEmailLayout(`
        <h1 style="font-size:20px;text-align:center;margin:0 0 16px;">Remboursement confirmé</h1>
        <p style="font-size:14px;line-height:1.6;">
          Un remboursement cumulé de <strong>${refundText}</strong> a été enregistré
          pour la commande <strong>n°${order.display_id}</strong>. Le délai d'apparition
          dépend de votre banque ou de votre opérateur de paiement mobile.
        </p>
        ${renderButton(orderUrl, "Voir ma commande")}
      `),
    },
  })
}

export const config: SubscriberConfig = {
  event: "payment.refunded",
}
