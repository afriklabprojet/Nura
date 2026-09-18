import { getHomeContent } from "@lib/data/home-content"
import { Metadata } from "next"

import InteractiveLink from "@modules/common/components/interactive-link"

export const metadata: Metadata = {
  title: "404",
  description: "Une erreur est survenue",
}

export default async function NotFound() {
  const { blocks } = await getHomeContent()

  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-64px)]">
      <h1 className="text-2xl-semi text-ui-fg-base">
        {blocks.not_found_messages?.title || "Page introuvable"}
      </h1>
      <p className="text-small-regular text-ui-fg-base">
        {blocks.cart_messages?.not_found_text ||
          "Le panier que vous essayez d'atteindre n'existe pas. Videz vos cookies et réessayez."}
      </p>
      <InteractiveLink href="/">Retour à l&apos;accueil</InteractiveLink>
    </div>
  )
}
