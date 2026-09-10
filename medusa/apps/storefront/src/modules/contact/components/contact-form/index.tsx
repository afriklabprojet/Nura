"use client"

import { useActionState } from "react"

import { submitContactForm } from "@lib/data/contact"
import { SubmitButton } from "@modules/checkout/components/submit-button"
import ErrorMessage from "@modules/checkout/components/error-message"
import Input from "@modules/common/components/input"
import Textarea from "@modules/common/components/textarea"
import { Text } from "@modules/common/components/ui"

const ContactForm = () => {
  const [state, formAction] = useActionState(submitContactForm, {
    success: false,
    error: null,
  })

  if (state.success) {
    return (
      <div
        className="bg-bg-alt border border-nude rounded-sm p-6 text-center"
        role="status"
        data-testid="contact-success-message"
      >
        <Text className="text-brown">
          Merci, votre message a bien été envoyé. Nous vous répondons sous 24
          à 48 h.
        </Text>
      </div>
    )
  }

  return (
    <form action={formAction} className="flex flex-col gap-y-4">
      <Input label="Nom" name="name" required autoComplete="name" />
      <Input
        label="Email"
        name="email"
        type="email"
        required
        autoComplete="email"
      />
      <Input
        label="Téléphone (optionnel)"
        name="phone"
        type="tel"
        autoComplete="tel"
      />
      <Textarea label="Message" name="message" required rows={6} />
      <ErrorMessage error={state.error} data-testid="contact-error-message" />
      <SubmitButton data-testid="contact-submit-button" className="w-full">
        Envoyer
      </SubmitButton>
    </form>
  )
}

export default ContactForm
