import { getHomeContent } from "@lib/data/home-content"
import { Metadata } from "next"

import InteractiveLink from "@modules/common/components/interactive-link"

export const metadata: Metadata = {
  title: "404",
  description: "Cette page est introuvable.",
}

export default async function NotFound() {
  const { blocks } = await getHomeContent()
  const messages = blocks.not_found_messages

  return (
    <div className="flex flex-col gap-4 items-center justify-center min-h-[calc(100vh-64px)]">
      <h1 className="text-2xl-semi text-ui-fg-base">
        {messages?.title || "Page introuvable"}
      </h1>
      <p className="text-small-regular text-ui-fg-base">
        {messages?.text ||
          "La page que vous essayez d'atteindre n'existe pas."}
      </p>
      <div className="flex flex-wrap justify-center gap-5">
        <InteractiveLink href="/">Retour à l&apos;accueil</InteractiveLink>
        <InteractiveLink href="/store">Découvrir la boutique</InteractiveLink>
        <InteractiveLink href="/contact">Contacter Nura</InteractiveLink>
      </div>
    </div>
  )
}
