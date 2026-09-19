import { getHomeContent } from "@lib/data/home-content"
import { ArrowUpRightMini } from "@medusajs/icons"
import { Text } from "@modules/common/components/ui"
import { Metadata } from "next"
import Link from "next/link"

export const metadata: Metadata = {
  title: "404",
  description: "Cette page est introuvable.",
}

export default async function NotFound() {
  const { blocks } = await getHomeContent()
  const messages = blocks.not_found_messages

  return (
    <main id="main-content" className="flex min-h-screen flex-col items-center justify-center gap-4 px-5 text-center">
      <h1 className="text-2xl-semi text-ui-fg-base">
        {messages?.title || "Page introuvable"}
      </h1>
      <p className="text-small-regular text-ui-fg-base">
        {messages?.text ||
          "La page que vous essayez d'atteindre n'existe pas."}
      </p>
      <Link className="group flex min-h-11 items-center gap-x-1" href="/">
        <Text className="text-ui-fg-interactive">Retour à l&apos;accueil</Text>
        <ArrowUpRightMini
          className="group-hover:rotate-45 ease-in-out duration-150"
          color="var(--fg-interactive)"
        />
      </Link>
    </main>
  )
}
