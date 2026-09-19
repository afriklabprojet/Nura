"use client"

import { useActionState } from "react"
import { AccountMessagesBlock } from "@lib/data/home-content"
import Input from "@modules/common/components/input"
import { LOGIN_VIEW } from "@modules/account/templates/login-template"
import ErrorMessage from "@modules/checkout/components/error-message"
import { SubmitButton } from "@modules/checkout/components/submit-button"
import EmailNotice from "@modules/common/components/email-notice"
import InlineText from "@modules/common/components/inline-text"
import { signup } from "@lib/data/customer"

type Props = {
  setCurrentView: (view: LOGIN_VIEW) => void
  messages?: AccountMessagesBlock
}

const DEFAULT_CONSENT_TEXT =
  "En créant un compte, vous acceptez la [politique de confidentialité](/confidentialite) et les [conditions générales de vente](/cgv) de Nura."

const Register = ({ setCurrentView, messages }: Props) => {
  const [message, formAction] = useActionState(signup, null)

  return (
    <div
      className="max-w-sm flex flex-col items-center"
      data-testid="register-page"
    >
      <h1 className="text-large-semi uppercase mb-6">
        {messages?.register_title || "Rejoindre Nura"}
      </h1>
      <p className="text-center text-base-regular text-ui-fg-base mb-4">
        {messages?.register_text ||
          "Créez votre compte Nura et profitez d'une expérience d'achat enrichie."}
      </p>
      {message?.state === "verification_required" && (
        <div
          className="w-full mb-4 text-center text-base-regular text-ui-fg-base bg-ui-bg-subtle border border-ui-border-base rounded-rounded p-4"
          data-testid="register-verification-message"
        >
          <EmailNotice
            text={
              messages?.register_verify_text ||
              "Un lien de vérification a été envoyé à {email}. Vérifiez votre boîte de réception puis connectez-vous."
            }
            email={message.email}
          />
        </div>
      )}
      <form className="w-full flex flex-col" action={formAction}>
        <div className="flex flex-col w-full gap-y-2">
          <Input
            label="Prénom"
            name="first_name"
            required
            autoComplete="given-name"
            data-testid="first-name-input"
          />
          <Input
            label="Nom"
            name="last_name"
            required
            autoComplete="family-name"
            data-testid="last-name-input"
          />
          <Input
            label="Email"
            name="email"
            required
            type="email"
            autoComplete="email"
            data-testid="email-input"
          />
          <Input
            label="Téléphone"
            name="phone"
            type="tel"
            autoComplete="tel"
            data-testid="phone-input"
          />
          <Input
            label="Mot de passe"
            name="password"
            required
            type="password"
            autoComplete="new-password"
            data-testid="password-input"
          />
        </div>
        <ErrorMessage
          error={message?.state === "error" ? message.error : null}
          data-testid="register-error"
        />
        <span className="text-center text-ui-fg-base text-small-regular mt-6">
          <InlineText
            text={messages?.register_consent_text || DEFAULT_CONSENT_TEXT}
            className="underline"
          />
        </span>
        <SubmitButton className="w-full mt-6" data-testid="register-button">
          Créer mon compte
        </SubmitButton>
      </form>
      <span className="text-center text-ui-fg-base text-small-regular mt-6">
        Déjà membre ?{" "}
        <button
          onClick={() => setCurrentView(LOGIN_VIEW.SIGN_IN)}
          className="underline"
        >
          Se connecter
        </button>
        .
      </span>
    </div>
  )
}

export default Register
