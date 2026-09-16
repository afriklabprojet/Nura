import { Metadata } from "next"
import ContactForm from "@modules/contact/components/contact-form"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import { CONTACT_EMAIL, SERVICE_CLIENT_CONTACTS } from "@lib/constants"

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Contactez la maison Nura pour toute question sur nos parfums, nos soins ou votre commande.",
}

export default function ContactPage() {
  return (
    <div className="content-container section-y">
      <div className="mx-auto mb-12 flex max-w-lg flex-col items-center gap-4 text-center small:mb-16">
        <span className="eyebrow">Nura</span>
        <h1 className="font-serif text-4xl text-brown small:text-5xl">
          Contact
        </h1>
        <p className="text-sm leading-relaxed text-ui-fg-subtle">
          Une question sur un produit, une commande ou une collaboration ?
          Écrivez-nous, nous vous répondons sous 24 à 48 h.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-12 small:grid-cols-[1fr_1.1fr] small:gap-20">
        <div className="flex flex-col gap-10">
          <div className="flex flex-col gap-4">
            <span className="eyebrow">Service client</span>
            <ul className="flex flex-col gap-y-3">
              {SERVICE_CLIENT_CONTACTS.map((contact) => (
                <li key={contact.tel} className="flex flex-col">
                  <span className="text-[11px] uppercase tracking-[0.2em] text-ui-fg-muted">
                    {contact.label}
                  </span>
                  <a
                    href={`tel:${contact.tel}`}
                    className="font-serif text-2xl text-brown hover:text-gold"
                  >
                    {contact.display}
                  </a>
                </li>
              ))}
            </ul>
            <p className="text-xs text-ui-fg-muted">
              Du lundi au vendredi, 9h — 18h
            </p>
          </div>

          <div className="flex flex-col gap-3 border-t border-nude pt-8">
            <span className="eyebrow">Par email</span>
            <a
              href={`mailto:${CONTACT_EMAIL}`}
              className="text-brown hover:text-gold"
            >
              {CONTACT_EMAIL}
            </a>
          </div>

          <div className="flex flex-col gap-3 border-t border-nude pt-8">
            <span className="eyebrow">Avant d&apos;écrire</span>
            <p className="text-sm leading-relaxed text-ui-fg-subtle">
              Livraison, retours, paiement : la plupart des réponses se
              trouvent déjà dans notre FAQ.
            </p>
            <LocalizedClientLink
              href="/faq"
              className="link-underline self-start text-[11px] uppercase tracking-[0.2em] text-gold hover:text-brown"
            >
              Consulter la FAQ
            </LocalizedClientLink>
          </div>
        </div>

        <div className="border border-nude bg-bg-alt p-6 small:p-10">
          <ContactForm />
        </div>
      </div>
    </div>
  )
}
