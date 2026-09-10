import { Metadata } from "next"
import ContactForm from "@modules/contact/components/contact-form"

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Contactez la maison Nura pour toute question sur nos parfums, nos soins ou votre commande.",
}

export default function ContactPage() {
  return (
    <div className="content-container py-12 small:py-24">
      <div className="max-w-lg mx-auto flex flex-col items-center text-center gap-y-4 mb-12">
        <span className="text-xs uppercase tracking-[0.3em] text-gold">
          Nura
        </span>
        <h1 className="font-serif text-4xl text-brown">Contact</h1>
        <p className="text-ui-fg-subtle">
          Une question sur un produit, une commande ou une collaboration ?
          Écrivez-nous, nous vous répondons sous 24 à 48 h.
        </p>
      </div>
      <div className="max-w-lg mx-auto">
        <ContactForm />
      </div>
    </div>
  )
}
