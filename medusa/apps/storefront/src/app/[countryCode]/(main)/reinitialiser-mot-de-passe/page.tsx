import { getHomeContent } from "@lib/data/home-content"
import { Metadata } from "next"
import { Suspense } from "react"
import ResetPassword from "@modules/account/components/reset-password"

export const metadata: Metadata = {
  title: "Réinitialiser le mot de passe",
  description: "Choisissez un nouveau mot de passe pour votre compte Nura.",
}

export default async function ResetPasswordPage() {
  const { blocks } = await getHomeContent()

  return (
    <div className="w-full flex justify-center px-8 py-12">
      <Suspense
        fallback={
          <p className="text-base-regular text-ui-fg-base">Chargement...</p>
        }
      >
        <ResetPassword messages={blocks.account_messages} />
      </Suspense>
    </div>
  )
}
