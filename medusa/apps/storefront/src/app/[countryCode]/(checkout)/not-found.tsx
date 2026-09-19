import { getHomeContent } from "@lib/data/home-content"
import InteractiveLink from "@modules/common/components/interactive-link"
import { Metadata } from "next"

export const metadata: Metadata = {
  title: "404",
  description: "Une erreur est survenue",
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
      <InteractiveLink href="/">Retour à l&apos;accueil</InteractiveLink>
    </div>
  )
}
