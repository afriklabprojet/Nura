"use server"

import { sdk } from "@lib/config"

export type ContactFormState = {
  success: boolean
  error: string | null
}

export async function submitContactForm(
  _currentState: ContactFormState,
  formData: FormData
): Promise<ContactFormState> {
  const name = formData.get("name") as string
  const email = formData.get("email") as string
  const phone = formData.get("phone") as string
  const subject = formData.get("subject") as string
  const orderReference = formData.get("order_reference") as string
  const message = formData.get("message") as string
  const contextualMessage = [
    `Sujet : ${subject}`,
    orderReference ? `Commande : ${orderReference}` : null,
    "",
    message,
  ]
    .filter((line) => line !== null)
    .join("\n")

  try {
    await sdk.client.fetch("/store/contact", {
      method: "POST",
      body: { name, email, phone, message: contextualMessage },
    })

    return { success: true, error: null }
  } catch (_error) {
    return {
      success: false,
      error: "Votre message n’a pas pu être envoyé. Réessayez dans quelques instants.",
    }
  }
}
