import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { ContainerRegistrationKeys, Modules } from "@medusajs/framework/utils"
import type { INotificationModuleService } from "@medusajs/framework/types"

type ContactRequestBody = {
  name?: string
  email?: string
  phone?: string
  message?: string
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;")
}

export async function POST(
  req: MedusaRequest<ContactRequestBody>,
  res: MedusaResponse
) {
  const { name, email, phone, message } = req.body ?? {}

  if (!name?.trim() || !email?.trim() || !message?.trim()) {
    return res.status(400).json({
      message: "Le nom, l'email et le message sont obligatoires.",
    })
  }

  if (!EMAIL_RE.test(email.trim())) {
    return res.status(400).json({
      message: "Adresse email invalide.",
    })
  }

  const logger = req.scope.resolve(ContainerRegistrationKeys.LOGGER)

  // Always keep a server-side record, regardless of whether email delivery
  // below succeeds — this is the only trace of the message if Resend isn't
  // configured yet, or if sending fails.
  logger.info(
    `[contact] New message from ${name.trim()} <${email.trim()}>${
      phone?.trim() ? ` (${phone.trim()})` : ""
    }: ${message.trim()}`
  )

  const storeEmail = process.env.RESEND_FROM_EMAIL
  if (process.env.RESEND_API_KEY && storeEmail) {
    try {
      const notificationModuleService: INotificationModuleService =
        req.scope.resolve(Modules.NOTIFICATION)

      await notificationModuleService.createNotifications({
        to: storeEmail,
        channel: "email",
        content: {
          subject: `Nouveau message de contact — ${name.trim()}`,
          html: `
            <p><strong>Nom :</strong> ${escapeHtml(name.trim())}</p>
            <p><strong>Email :</strong> ${escapeHtml(email.trim())}</p>
            ${phone?.trim() ? `<p><strong>Téléphone :</strong> ${escapeHtml(phone.trim())}</p>` : ""}
            <p><strong>Message :</strong></p>
            <p>${escapeHtml(message.trim()).replace(/\n/g, "<br>")}</p>
          `,
        },
      })
    } catch (error) {
      logger.error(
        `[contact] Failed to email the contact message: ${
          error instanceof Error ? error.message : String(error)
        }`
      )
    }
  }

  return res.status(200).json({ success: true })
}
