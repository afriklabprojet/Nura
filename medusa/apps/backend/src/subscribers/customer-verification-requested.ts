import type { SubscriberArgs, SubscriberConfig } from "@medusajs/framework"
import { sendEmailNotificationWorkflow } from "../workflows/send-email-notification"
import { renderEmailLayout, renderButton, getStorefrontUrl } from "../lib/email-templates"

type VerificationRequestedEvent = {
  entity_id: string
  entity_type: string
  code_provider: string
  auth_identity_id: string
  code: string
  expires_at: string
}

export default async function customerVerificationRequestedHandler({
  event: { data },
  container,
}: SubscriberArgs<VerificationRequestedEvent>) {
  if (data.entity_type !== "email") {
    return
  }

  if (!process.env.RESEND_API_KEY || !process.env.RESEND_FROM_EMAIL) {
    return
  }

  const verifyUrl = `${getStorefrontUrl()}/verify-account?token=${encodeURIComponent(
    data.code
  )}`

  await sendEmailNotificationWorkflow(container).run({
    input: {
      to: data.entity_id,
      trigger_type: "customer_verification_requested",
      subject: "Confirmez votre adresse email — Nura",
      html: renderEmailLayout(`
        <h1 style="font-size:20px;text-align:center;margin:0 0 16px;">Bienvenue chez Nura</h1>
        <p style="font-size:14px;line-height:1.6;">
          Merci de votre inscription. Confirmez votre adresse email pour
          activer votre compte et accéder à votre espace client.
        </p>
        ${renderButton(verifyUrl, "Confirmer mon email")}
        <p style="font-size:12px;color:#8a7a6d;line-height:1.6;">
          Si vous n'êtes pas à l'origine de cette inscription, ignorez cet
          email.
        </p>
      `),
    },
  })
}

export const config: SubscriberConfig = {
  event: "auth.verification_requested",
}
