"use client"

import { subscribeToNewsletter } from "@lib/data/newsletter"
import { Text } from "@modules/common/components/ui"
import { SubmitButton } from "@modules/checkout/components/submit-button"
import ErrorMessage from "@modules/checkout/components/error-message"
import { useActionState } from "react"

const NewsletterForm = () => {
  const [state, formAction] = useActionState(subscribeToNewsletter, {
    success: false,
    error: null,
  })

  if (state.success) {
    return (
      <Text className="txt-small text-ui-fg-subtle">
        Merci ! Vous êtes bien inscrit(e) à la newsletter Nura.
      </Text>
    )
  }

  return (
    <form action={formAction} className="flex flex-col gap-y-2">
      <div className="flex gap-x-2">
        <input
          name="email"
          type="email"
          required
          placeholder="Votre email"
          aria-label="Adresse email"
          className="w-full bg-transparent border-b border-ui-fg-muted txt-small py-1 focus:outline-none focus:border-gold placeholder:text-ui-fg-muted"
        />
        <SubmitButton
          size="small"
          variant="transparent"
          className="shrink-0 !px-0 underline"
          data-testid="newsletter-submit-button"
        >
          S&apos;inscrire
        </SubmitButton>
      </div>
      <ErrorMessage error={state.error} data-testid="newsletter-error-message" />
    </form>
  )
}

export default NewsletterForm
