import { Metadata } from "next"
import { getHomeContent } from "@lib/data/home-content"

export const metadata: Metadata = {
  title: "FAQ",
  description:
    "Questions fréquentes — livraison, retours, paiement et suivi de commande Nura.",
}

const DEFAULT_ITEMS = [
  {
    question: "Quels sont les délais et zones de livraison ?",
    answer:
      "Nous livrons en France métropolitaine et en Côte d'Ivoire. Le délai indicatif est de 3 à 7 jours ouvrés. Les frais de livraison sont précisés avant la validation de votre commande.",
  },
  {
    question: "Comment suivre ma commande ?",
    answer:
      "Un email de confirmation vous est envoyé dès la validation de votre commande. Vous pouvez ensuite suivre son statut depuis votre compte, rubrique « Commandes ».",
  },
  {
    question: "Quels moyens de paiement acceptez-vous ?",
    answer:
      "En Europe, vous pouvez payer par carte bancaire (Stripe). En Côte d'Ivoire, le paiement mobile money (Wave, Orange Money, MTN, Moov, Djamo) est disponible via notre partenaire Jèko.",
  },
  {
    question: "Puis-je retourner un produit ?",
    answer:
      "Vous disposez d'un délai de 14 jours après réception pour exercer votre droit de rétractation. Les produits doivent être retournés neufs, non ouverts et dans leur emballage d'origine. Pour des raisons d'hygiène, les produits descellés (parfums, cosmétiques) ne peuvent pas être retournés.",
  },
  {
    question: "Les produits sont-ils testés sur les animaux ?",
    answer:
      "Non. Conformément à la réglementation européenne, aucun produit cosmétique Nura n'est testé sur les animaux, et nous ne le demandons pas à nos fournisseurs.",
  },
  {
    question: "Comment vous contacter ?",
    answer:
      "Vous pouvez nous écrire via le formulaire de contact, par email à contact@nura-paris.com, ou joindre notre service client France (+33 7 45 06 48 87) et Abidjan (+225 05 05 79 88 82), du lundi au vendredi.",
  },
]

export default async function FaqPage() {
  const { blocks } = await getHomeContent()
  const items = blocks.faq?.items?.length ? blocks.faq.items : DEFAULT_ITEMS

  return (
    <div className="content-container py-16 small:py-24">
      <div className="max-w-2xl mx-auto flex flex-col items-center text-center gap-y-4 mb-14">
        <span className="text-xs uppercase tracking-[0.3em] text-gold">
          Aide
        </span>
        <h1 className="font-serif text-4xl small:text-6xl text-brown">
          Questions fréquentes
        </h1>
      </div>

      <div className="max-w-2xl mx-auto flex flex-col gap-y-10">
        {items.map((item) => (
          <section key={item.question}>
            <h2 className="font-serif text-xl small:text-2xl text-brown mb-3">
              {item.question}
            </h2>
            <p className="text-ui-fg-subtle leading-relaxed">{item.answer}</p>
          </section>
        ))}
      </div>
    </div>
  )
}
