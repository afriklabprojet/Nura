import type { SubscriberArgs, SubscriberConfig } from "@medusajs/framework"
import { sendEmailNotificationWorkflow } from "../workflows/send-email-notification"
import { renderEmailLayout, renderButton, getStorefrontUrl } from "../lib/email-templates"

type PasswordResetEvent = {
  entity_id: string
  actor_type: string
  token: string
}

export default async function customerPasswordResetHandler({
  event: { data },
  container,
}: SubscriberArgs<PasswordResetEvent>) {
  if (data.actor_type !== "customer") {
    // Admin (dashboard) password resets are out of scope for the storefront
    // email — the dashboard surfaces the reset link itself in that flow.
    return
  }

  if (!process.env.RESEND_API_KEY || !process.env.RESEND_FROM_EMAIL) {
    return
  }

  const resetUrl = `${getStorefrontUrl()}/reinitialiser-mot-de-passe?token=${encodeURIComponent(
    data.token
  )}&email=${encodeURIComponent(data.entity_id)}`

  await sendEmailNotificationWorkflow(container).run({
    input: {
      to: data.entity_id,
      trigger_type: "customer_password_reset",
      subject: "Réinitialisez votre mot de passe Nura",
      html: renderEmailLayout(`
        <h1 style="font-size:20px;text-align:center;margin:0 0 16px;">Réinitialisation du mot de passe</h1>
        <p style="font-size:14px;line-height:1.6;">
          Vous avez demandé la réinitialisation du mot de passe de votre
          compte Nura. Cliquez sur le bouton ci-dessous pour choisir un
          nouveau mot de passe. Ce lien expire dans peu de temps pour votre
          sécurité.
        </p>
        ${renderButton(resetUrl, "Réinitialiser mon mot de passe")}
        <p style="font-size:12px;color:#8a7a6d;line-height:1.6;">
          Si vous n'êtes pas à l'origine de cette demande, ignorez cet
          email — votre mot de passe restera inchangé.
        </p>
      `),
    },
  })
}

export const config: SubscriberConfig = {
  event: "auth.password_reset",
}
