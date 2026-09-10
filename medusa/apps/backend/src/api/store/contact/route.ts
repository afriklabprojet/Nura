import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { ContainerRegistrationKeys } from "@medusajs/framework/utils"

type ContactRequestBody = {
  name?: string
  email?: string
  phone?: string
  message?: string
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

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

  // TODO: once a transactional email provider (Resend, SendGrid, SMTP...) is
  // configured as a notification provider in medusa-config.ts, replace this
  // log with a call to the Notification module to actually email the store.
  logger.info(
    `[contact] New message from ${name.trim()} <${email.trim()}>${
      phone?.trim() ? ` (${phone.trim()})` : ""
    }: ${message.trim()}`
  )

  return res.status(200).json({ success: true })
}
