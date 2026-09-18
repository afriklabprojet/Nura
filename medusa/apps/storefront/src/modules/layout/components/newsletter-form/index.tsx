"use client"

import { subscribeToNewsletter } from "@lib/data/newsletter"
import { Text } from "@modules/common/components/ui"
import { SubmitButton } from "@modules/checkout/components/submit-button"
import ErrorMessage from "@modules/checkout/components/error-message"
import InlineText from "@modules/common/components/inline-text"
import { useActionState } from "react"

const DEFAULT_CONSENT_TEXT =
  "En vous inscrivant, vous acceptez de recevoir les actualités Nura. Vous pouvez vous désinscrire à tout moment. Consultez notre [politique de confidentialité](/confidentialite)."

type NewsletterFormProps = {
  successMessage?: string
  consentText?: string
}

const NewsletterForm = ({ successMessage, consentText }: NewsletterFormProps) => {
  const [state, formAction] = useActionState(subscribeToNewsletter, {
    success: false,
    error: null,
  })

  if (state.success) {
    return (
      <Text className="txt-small text-ui-fg-subtle" role="status">
        {successMessage ||
          "Merci ! Vous êtes bien inscrit(e) à la newsletter Nura."}
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
      <p className="text-[11px] leading-relaxed text-ui-fg-muted">
        <InlineText
          text={consentText || DEFAULT_CONSENT_TEXT}
          className="underline underline-offset-2"
        />
      </p>
      <ErrorMessage error={state.error} data-testid="newsletter-error-message" />
    </form>
  )
}

export default NewsletterForm
