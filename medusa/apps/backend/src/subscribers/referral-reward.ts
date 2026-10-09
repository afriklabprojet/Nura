import type { SubscriberArgs, SubscriberConfig } from "@medusajs/framework"
import type { CreatePromotionDTO } from "@medusajs/framework/types"
import {
  ContainerRegistrationKeys,
  MedusaError,
  Modules,
} from "@medusajs/framework/utils"
import { sendEmailNotificationWorkflow } from "../workflows/send-email-notification"
import { renderEmailLayout, getStorefrontUrl } from "../lib/email-templates"
import { formatMoney } from "../lib/format-money"
import { generateIdempotentPromoCode } from "../lib/generate-promo-code"

type OrderPlacedEvent = {
  id: string
}

const REWARD_AMOUNT: Record<string, number> = {
  eur: Number(process.env.REFERRAL_REWARD_EUR || 10),
  xof: Number(process.env.REFERRAL_REWARD_XOF || 6500),
}

if (
  Object.values(REWARD_AMOUNT).some(
    (amount) => !Number.isSafeInteger(amount) || amount <= 0
  )
) {
  throw new MedusaError(
    MedusaError.Types.INVALID_DATA,
    "Referral reward amounts must be positive integers"
  )
}

export default async function referralRewardHandler({
  event: { data },
  container,
}: SubscriberArgs<OrderPlacedEvent>) {
  const query = container.resolve(ContainerRegistrationKeys.QUERY)
  const customerModuleService = container.resolve(Modules.CUSTOMER)
  const promotionModuleService = container.resolve(Modules.PROMOTION)

  const {
    data: [order],
  } = await query.graph({
    entity: "order",
    fields: [
      "id",
      "display_id",
      "customer_id",
      "email",
      "currency_code",
      "total",
      "payment_collections.status",
    ],
    filters: { id: data.id },
  })

  if (
    !order?.customer_id ||
    !order.payment_collections?.length ||
    order.payment_collections.some(
      (collection) => !collection || collection.status !== "completed"
    )
  ) {
    return
  }

  const customer = await customerModuleService.retrieveCustomer(
    order.customer_id
  )
  const metadata = (customer.metadata || {}) as Record<string, unknown>
  const referredBy = metadata.referred_by as string | undefined

  // Already rewarded (or never referred) — nothing to do. Gating on this
  // flag rather than "is this their first order" keeps the check simple
  // and just as safe: it can only ever fire once per referred customer.
  if (!referredBy || metadata.referral_reward_issued === true) {
    return
  }

  // `metadata` is a valid runtime filter (JSON containment match, verified
  // against a live DB) but isn't part of the public FilterableCustomerProps
  // type yet, hence the cast.
  const [referrer] = await customerModuleService.listCustomers({
    metadata: { referral_code: referredBy },
  } as Parameters<typeof customerModuleService.listCustomers>[0])

  // A code that doesn't match any customer (typo'd, stale, or the referrer
  // account was deleted) — mark as handled so we don't keep re-checking on
  // every future order from this customer, but issue nothing.
  if (!referrer) {
    await customerModuleService.updateCustomers(customer.id, {
      metadata: { ...metadata, referral_reward_issued: true },
    })
    return
  }

  if (referrer.id === customer.id) {
    await customerModuleService.updateCustomers(customer.id, {
      metadata: { ...metadata, referral_reward_issued: true },
    })
    return
  }

  const rewardAmount = REWARD_AMOUNT[order.currency_code]

  if (!rewardAmount) {
    await customerModuleService.updateCustomers(customer.id, {
      metadata: { ...metadata, referral_reward_issued: true },
    })
    return
  }

  if ((order.total || 0) < rewardAmount) {
    await customerModuleService.updateCustomers(customer.id, {
      metadata: { ...metadata, referral_reward_issued: true },
    })
    return
  }

  const refereeCode = generateIdempotentPromoCode("referee", customer.id)
  const referrerCode = generateIdempotentPromoCode("referrer", customer.id)

  const promotionsToCreate: CreatePromotionDTO[] = [refereeCode, referrerCode].map(
    (code) => ({
      code,
      type: "standard",
      status: "active",
      is_automatic: false,
      limit: 1,
      application_method: {
        type: "fixed",
        target_type: "order",
        value: rewardAmount,
        currency_code: order.currency_code,
      },
    })
  )

  const existingPromotions = await promotionModuleService.listPromotions({
    code: [refereeCode, referrerCode],
  })
  const existingCodeSet = new Set(existingPromotions.map(({ code }) => code))

  await promotionModuleService.createPromotions(
    promotionsToCreate.filter(({ code }) => !existingCodeSet.has(code))
  )

  await customerModuleService.updateCustomers(customer.id, {
    metadata: { ...metadata, referral_reward_issued: true },
  })

  if (!process.env.RESEND_API_KEY || !process.env.RESEND_FROM_EMAIL) {
    return
  }

  const rewardText = formatMoney(rewardAmount, order.currency_code)

  if (order.email) {
    await sendEmailNotificationWorkflow(container).run({
      input: {
        to: order.email,
        trigger_type: "referral_reward_referee",
        subject: "Merci d'avoir rejoint Nura — votre code de bienvenue",
        html: renderEmailLayout(`
          <h1 style="font-size:20px;text-align:center;margin:0 0 16px;">Bienvenue chez Nura</h1>
          <p style="font-size:14px;line-height:1.6;">
            Merci pour votre première commande n°${order.display_id} ! Voici
            un code de ${rewardText} à utiliser dans le champ « Code promo »
            lors de votre prochaine commande sur ${getStorefrontUrl()} :
          </p>
          <p style="font-size:20px;font-family:monospace;letter-spacing:1px;text-align:center;margin:16px 0;">
            ${refereeCode}
          </p>
        `),
      },
    })
  }

  if (referrer.email) {
    await sendEmailNotificationWorkflow(container).run({
      input: {
        to: referrer.email,
        trigger_type: "referral_reward_referrer",
        subject: "Votre filleul(e) a commandé — voici votre récompense",
        html: renderEmailLayout(`
          <h1 style="font-size:20px;text-align:center;margin:0 0 16px;">Merci pour votre parrainage</h1>
          <p style="font-size:14px;line-height:1.6;">
            La personne que vous avez parrainée vient de passer sa première
            commande. Voici votre code de ${rewardText}, à utiliser dans le
            champ « Code promo » lors de votre prochaine commande sur
            ${getStorefrontUrl()} :
          </p>
          <p style="font-size:20px;font-family:monospace;letter-spacing:1px;text-align:center;margin:16px 0;">
            ${referrerCode}
          </p>
        `),
      },
    })
  }
}

export const config: SubscriberConfig = {
  event: "order.placed",
}
