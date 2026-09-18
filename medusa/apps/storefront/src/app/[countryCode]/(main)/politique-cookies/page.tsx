import { Metadata } from "next"
import LegalPageLayout from "@modules/legal/components/legal-page-layout"
import { getHomeContent } from "@lib/data/home-content"
import PostBody from "@modules/journal/components/post-body"

export const metadata: Metadata = {
  title: "Politique de cookies",
  description: "Politique de gestion des cookies du site Nura.",
}

const DEFAULT_CONTENT = `## Qu'est-ce qu'un cookie ?

Un cookie est un petit fichier texte déposé sur votre appareil lors de la visite d'un site internet. Il permet au site de reconnaître votre appareil et de mémoriser certaines informations sur vos préférences ou actions passées.

## Les cookies utilisés sur ce site

Cookies strictement nécessaires — indispensables au fonctionnement du site (panier, session de connexion, région choisie). Ils ne peuvent pas être désactivés et ne nécessitent pas votre consentement conformément à la réglementation.

Cookies de mesure d'audience et de publicité — utilisés uniquement si vous les acceptez, pour mesurer la fréquentation du site (Google Analytics) et l'efficacité de nos campagnes publicitaires (Meta, TikTok). Ces outils ne sont chargés qu'après votre consentement explicite via le bandeau de cookies.

## Gérer vos préférences

Lors de votre première visite, un bandeau vous permet d'accepter ou de refuser les cookies non essentiels. Vous pouvez modifier votre choix à tout moment en effaçant les cookies de votre navigateur, ce qui réaffichera le bandeau lors de votre prochaine visite.`

export default async function PolitiqueCookiesPage() {
  const { blocks } = await getHomeContent()
  const page = blocks.page_politique_cookies

  return (
    <LegalPageLayout
      title={page?.title || "Politique de cookies"}
      updatedAt="14 septembre 2026"
    >
      <PostBody content={page?.content || DEFAULT_CONTENT} />
    </LegalPageLayout>
  )
}
