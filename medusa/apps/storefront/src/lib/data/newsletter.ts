"use server"

import { sdk } from "@lib/config"

export type NewsletterFormState = {
  success: boolean
  error: string | null
}

export async function subscribeToNewsletter(
  _currentState: NewsletterFormState,
  formData: FormData
): Promise<NewsletterFormState> {
  const email = formData.get("email") as string

  try {
    await sdk.client.fetch("/store/newsletter", {
      method: "POST",
      body: { email },
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
