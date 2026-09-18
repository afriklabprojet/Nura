import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { ContainerRegistrationKeys } from "@medusajs/framework/utils"
import { subscribeToNewsletterWorkflow } from "../../../workflows/subscribe-to-newsletter"
import { sendEmailNotificationWorkflow } from "../../../workflows/send-email-notification"
import { renderEmailLayout } from "../../../lib/email-templates"
import { escapeHtml } from "../../../lib/escape-html"

type NewsletterRequestBody = {
  email?: string
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export async function POST(
  req: MedusaRequest<NewsletterRequestBody>,
  res: MedusaResponse
) {
  const email = req.body?.email?.trim().toLowerCase()

  if (!email || email.length > 254 || !EMAIL_RE.test(email)) {
    return res.status(400).json({ message: "Adresse email invalide." })
  }

  const logger = req.scope.resolve(ContainerRegistrationKeys.LOGGER)

  try {
    await subscribeToNewsletterWorkflow(req.scope).run({ input: { email } })
  } catch (error) {
    logger.error(
      `[newsletter] Failed to store subscriber: ${
        error instanceof Error ? error.message : String(error)
      }`
    )
    return res.status(500).json({ message: "Une erreur est survenue." })
  }

  const storeEmail = process.env.RESEND_FROM_EMAIL
  if (process.env.RESEND_API_KEY && storeEmail) {
    try {
      await sendEmailNotificationWorkflow(req.scope).run({
        input: {
          to: storeEmail,
          trigger_type: "newsletter_signup",
          subject: "Nouvel inscrit à la newsletter Nura",
          html: renderEmailLayout(
            `<p style="font-size:14px;">Nouvelle inscription : <strong>${escapeHtml(email)}</strong></p>`
          ),
        },
      })
    } catch (error) {
      logger.error(
        `[newsletter] Failed to notify of new subscriber: ${
          error instanceof Error ? error.message : String(error)
        }`
      )
    }
  }

  return res.status(200).json({ success: true })
}
