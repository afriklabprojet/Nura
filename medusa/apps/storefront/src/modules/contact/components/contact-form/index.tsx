"use client"

import { useActionState } from "react"

import { submitContactForm } from "@lib/data/contact"
import { SubmitButton } from "@modules/checkout/components/submit-button"
import ErrorMessage from "@modules/checkout/components/error-message"
import Input from "@modules/common/components/input"
import Textarea from "@modules/common/components/textarea"
import { Text } from "@modules/common/components/ui"

const ContactForm = ({ successMessage }: { successMessage?: string }) => {
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
          {successMessage ||
            "Merci, votre message a bien été envoyé. Nous vous répondons sous 24 à 48 h."}
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
      <label className="flex flex-col gap-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-brown">
        Sujet
        <select
          name="subject"
          required
          defaultValue=""
          className="h-11 rounded-sm border border-nude bg-bg-alt px-3 text-sm font-normal normal-case tracking-normal focus:outline-none focus:ring-2 focus:ring-gold"
        >
          <option value="" disabled>Sélectionner un sujet</option>
          <option value="Produit">Question sur un produit</option>
          <option value="Commande">Question sur une commande</option>
          <option value="Retour">Livraison ou retour</option>
          <option value="Collaboration">Collaboration</option>
          <option value="Autre">Autre demande</option>
        </select>
      </label>
      <Input
        label="N° de commande (si applicable)"
        name="order_reference"
        autoComplete="off"
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
