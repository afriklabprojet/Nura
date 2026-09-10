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
  const message = formData.get("message") as string

  try {
    await sdk.client.fetch("/store/contact", {
      method: "POST",
      body: { name, email, phone, message },
    })

    return { success: true, error: null }
  } catch (error) {
    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : "Une erreur est survenue, veuillez réessayer.",
    }
  }
}
