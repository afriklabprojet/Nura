import type { SubscriberArgs, SubscriberConfig } from "@medusajs/framework"
import type { CreatePromotionDTO } from "@medusajs/framework/types"
import { ContainerRegistrationKeys, Modules } from "@medusajs/framework/utils"
import { sendEmailNotificationWorkflow } from "../workflows/send-email-notification"
import { renderEmailLayout, getStorefrontUrl } from "../lib/email-templates"
import { formatMoney } from "../lib/format-money"
import { generateIdempotentPromoCode } from "../lib/generate-promo-code"

type OrderPlacedEvent = {
  id: string
}

export default async function giftCardIssuedHandler({
  event: { data },
  container,
}: SubscriberArgs<OrderPlacedEvent>) {
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
      "metadata",
      "payment_collections.status",
      "items.id",
      "items.quantity",
      "items.unit_price",
      "items.title",
      "items.product.is_giftcard",
    ],
    filters: { id: data.id },
  })

  if (
    !order?.email ||
    !order.payment_collections?.length ||
    order.payment_collections.some(
      (collection) => !collection || collection.status !== "completed"
    )
  ) {
    return
  }

  const metadata = (order.metadata || {}) as Record<string, unknown>
  const existingCodes = metadata.gift_card_codes as
    | { code: string; amount: number }[]
    | undefined

  const giftCardItems = (order.items || []).filter(
    (item) => item?.product?.is_giftcard
  )

  if (giftCardItems.length === 0) {
    return
  }

  const promotionModuleService = container.resolve(Modules.PROMOTION)

  const codes: { code: string; amount: number }[] = existingCodes || []
  const promotionsToCreate: CreatePromotionDTO[] = []

  if (!existingCodes) for (const item of giftCardItems) {
    const quantity = item!.quantity || 1
    const amount = item!.unit_price || 0

    for (let i = 0; i < quantity; i++) {
      const code = generateIdempotentPromoCode(
        "gift-card",
        `${order.id}:${item!.id}:${i}`
      )
      codes.push({ code, amount })
      promotionsToCreate.push({
        code,
        type: "standard" as const,
        status: "active" as const,
        is_automatic: false,
        limit: 1,
        application_method: {
          type: "fixed" as const,
          target_type: "order" as const,
          value: amount,
          currency_code: order.currency_code,
        },
      })
    }
  }

  if (promotionsToCreate.length > 0) {
    const existingPromotions = await promotionModuleService.listPromotions({
      code: codes.map(({ code }) => code),
    })
    const existingCodeSet = new Set(existingPromotions.map(({ code }) => code))

    await promotionModuleService.createPromotions(
      promotionsToCreate.filter(({ code }) => !existingCodeSet.has(code))
    )

    const orderModuleService = container.resolve(Modules.ORDER)
    await orderModuleService.updateOrders(order.id, {
      metadata: { ...metadata, gift_card_codes: codes },
    })
  }

  // The codes represent real paid value, so they're always issued — even if
  // Resend isn't configured, the codes exist and are redeemable, an admin
  // can look them up and pass them on manually. Only the email is skipped.
  await promotionModuleService.createPromotions(promotionsToCreate)

  if (
    metadata.gift_card_email_sent === true ||
    !process.env.RESEND_API_KEY ||
    !process.env.RESEND_FROM_EMAIL
  ) {
    return
  }

  const codesHtml = codes
    .map(
      (c) => `
        <tr>
          <td style="padding:8px 0;font-size:16px;font-family:monospace;letter-spacing:1px;border-bottom:1px solid #E7D3C0;">
            ${c.code}
          </td>
          <td style="padding:8px 0;font-size:14px;text-align:right;border-bottom:1px solid #E7D3C0;">
            ${formatMoney(c.amount, order.currency_code)}
          </td>
        </tr>
      `
    )
    .join("")

  await sendEmailNotificationWorkflow(container).run({
    input: {
      to: order.email,
      trigger_type: "gift_card_issued",
      subject: `Votre carte cadeau Nura — commande n°${order.display_id}`,
      html: renderEmailLayout(`
        <h1 style="font-size:20px;text-align:center;margin:0 0 16px;">Votre carte cadeau est prête</h1>
        <p style="font-size:14px;line-height:1.6;">
          Merci pour votre achat. Voici ${
            codes.length > 1 ? "vos codes cadeau" : "votre code cadeau"
          }, à utiliser dans le champ « Code promo » lors du paiement sur
          ${getStorefrontUrl()} :
        </p>
        <table style="width:100%;border-collapse:collapse;margin:16px 0;">
          ${codesHtml}
        </table>
        <p style="font-size:12px;color:#8A7B6C;line-height:1.6;">
          Chaque code est valable pour un usage unique, à hauteur du montant
          indiqué, sur une seule commande.
        </p>
      `),
    },
  })

  const orderModuleService = container.resolve(Modules.ORDER)
  await orderModuleService.updateOrders(order.id, {
    metadata: {
      ...metadata,
      gift_card_codes: codes,
      gift_card_email_sent: true,
    },
  })
}

export const config: SubscriberConfig = {
  event: "order.placed",
}
