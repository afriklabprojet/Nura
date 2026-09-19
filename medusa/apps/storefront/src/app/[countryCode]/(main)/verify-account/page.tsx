import { getHomeContent } from "@lib/data/home-content"
import { Metadata } from "next"
import { Suspense } from "react"

import VerifyAccount from "@modules/account/components/verify-account"

export const metadata: Metadata = {
  title: "Vérification de l'email",
  description: "Vérifiez votre adresse email pour finaliser votre inscription.",
}

export default async function VerifyAccountPage() {
  const { blocks } = await getHomeContent()

  return (
    <div className="w-full flex justify-center px-8 py-12">
      <Suspense
        fallback={
          <p className="text-base-regular text-ui-fg-base">
            Vérification de votre email en cours...
          </p>
        }
      >
        <VerifyAccount messages={blocks.account_messages} />
      </Suspense>
    </div>
  )
}
