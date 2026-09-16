import { Metadata } from "next"
import LegalPageLayout from "@modules/legal/components/legal-page-layout"

export const metadata: Metadata = {
  title: "Politique de cookies",
  description: "Politique de gestion des cookies du site Nura.",
}

export default function PolitiqueCookiesPage() {
  return (
    <LegalPageLayout
      title="Politique de cookies"
      updatedAt="14 septembre 2026"
    >
      <section>
        <h2>Qu&apos;est-ce qu&apos;un cookie ?</h2>
        <p>
          Un cookie est un petit fichier texte déposé sur votre appareil
          lors de la visite d&apos;un site internet. Il permet au site de
          reconnaître votre appareil et de mémoriser certaines informations
          sur vos préférences ou actions passées.
        </p>
      </section>

      <section>
        <h2>Les cookies utilisés sur ce site</h2>
        <p>
          <strong>Cookies strictement nécessaires</strong> — indispensables
          au fonctionnement du site (panier, session de connexion, région
          choisie). Ils ne peuvent pas être désactivés et ne nécessitent pas
          votre consentement conformément à la réglementation.
        </p>
        <p>
          <strong>Cookies de mesure d&apos;audience et de publicité</strong>{" "}
          — utilisés uniquement si vous les acceptez, pour mesurer la
          fréquentation du site (Google Analytics) et l&apos;efficacité de
          nos campagnes publicitaires (Meta, TikTok). Ces outils ne sont
          chargés qu&apos;après votre consentement explicite via le bandeau
          de cookies.
        </p>
      </section>

      <section>
        <h2>Gérer vos préférences</h2>
        <p>
          Lors de votre première visite, un bandeau vous permet
          d&apos;accepter ou de refuser les cookies non essentiels. Vous
          pouvez modifier votre choix à tout moment en effaçant les cookies
          de votre navigateur, ce qui réaffichera le bandeau lors de votre
          prochaine visite.
        </p>
      </section>
    </LegalPageLayout>
  )
}
