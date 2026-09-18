import { CartMessagesBlock } from "@lib/data/home-content"
import LocalizedClientLink from "@modules/common/components/localized-client-link"

const SignInPrompt = ({ block }: { block?: CartMessagesBlock }) => {
  return (
    <div className="flex flex-col gap-4 border border-nude bg-bg-alt p-5 xsmall:flex-row xsmall:items-center xsmall:justify-between">
      <div className="flex flex-col gap-1">
        <h2 className="font-serif text-xl text-brown">
          {block?.sign_in_title || "Vous avez déjà un compte ?"}
        </h2>
        <p className="text-sm text-ui-fg-subtle">
          {block?.sign_in_text ||
            "Connectez-vous pour retrouver vos adresses et vos commandes."}
        </p>
      </div>
      <LocalizedClientLink
        href="/account"
        className="inline-flex h-11 shrink-0 items-center justify-center border border-brown/30 px-6 text-[11px] uppercase tracking-[0.2em] text-brown transition-colors hover:border-brown"
        data-testid="sign-in-button"
      >
        Se connecter
      </LocalizedClientLink>
    </div>
  )
}

export default SignInPrompt
