import { AccountMessagesBlock } from "@lib/data/home-content"
import { login } from "@lib/data/customer"
import { LOGIN_VIEW } from "@modules/account/templates/login-template"
import ErrorMessage from "@modules/checkout/components/error-message"
import { SubmitButton } from "@modules/checkout/components/submit-button"
import EmailNotice from "@modules/common/components/email-notice"
import Input from "@modules/common/components/input"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import { useActionState } from "react"

type Props = {
  setCurrentView: (view: LOGIN_VIEW) => void
  messages?: AccountMessagesBlock
}

const Login = ({ setCurrentView, messages }: Props) => {
  const [message, formAction] = useActionState(login, null)

  return (
    <div
      className="max-w-sm w-full flex flex-col items-center"
      data-testid="login-page"
    >
      <h1 className="text-large-semi uppercase mb-6">
        {messages?.login_title || "Bon retour"}
      </h1>
      <p className="text-center text-base-regular text-ui-fg-base mb-8">
        {messages?.login_text ||
          "Connectez-vous pour accéder à une expérience d'achat enrichie."}
      </p>
      {message?.state === "verification_required" && (
        <div
          className="w-full mb-6 text-center text-base-regular text-ui-fg-base bg-ui-bg-subtle border border-ui-border-base rounded-rounded p-4"
          data-testid="login-verification-message"
        >
          <EmailNotice
            text={
              messages?.verify_sent_text ||
              "Un lien de vérification a été envoyé à {email}. Vérifiez votre email puis connectez-vous."
            }
            email={message.email}
          />
        </div>
      )}
      <form className="w-full" action={formAction}>
        <div className="flex flex-col w-full gap-y-2">
          <Input
            label="Email"
            name="email"
            type="email"
            title="Saisissez une adresse email valide."
            autoComplete="email"
            required
            data-testid="email-input"
          />
          <Input
            label="Mot de passe"
            name="password"
            type="password"
            autoComplete="current-password"
            required
            data-testid="password-input"
          />
        </div>
        <div className="text-right mt-2">
          <LocalizedClientLink
            href="/mot-de-passe-oublie"
            className="text-ui-fg-subtle txt-small underline hover:text-ui-fg-base"
          >
            Mot de passe oublié ?
          </LocalizedClientLink>
        </div>
        <ErrorMessage
          error={message?.state === "error" ? message.error : null}
          data-testid="login-error-message"
        />
        <SubmitButton data-testid="sign-in-button" className="w-full mt-6">
          Se connecter
        </SubmitButton>
      </form>
      <span className="text-center text-ui-fg-base text-small-regular mt-6">
        Pas encore membre ?{" "}
        <button
          onClick={() => setCurrentView(LOGIN_VIEW.REGISTER)}
          className="underline"
          data-testid="register-button"
        >
          Rejoignez-nous
        </button>
        .
      </span>
    </div>
  )
}

export default Login
