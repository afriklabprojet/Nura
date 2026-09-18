import { Metadata } from "next"
import ContactForm from "@modules/contact/components/contact-form"
import { getHomeContent } from "@lib/data/home-content"
import { getSiteSettings } from "@lib/data/site-settings"
import PostBody from "@modules/journal/components/post-body"

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Contactez la maison Nura pour toute question sur nos parfums, nos soins ou votre commande.",
}

const DEFAULT_CONTENT = `Une question sur un produit, une commande ou une collaboration ? Écrivez-nous, nous vous répondons sous 24 à 48 h.

Livraison, retours, paiement : la plupart des réponses se trouvent déjà dans notre [FAQ](/faq).`

export default async function ContactPage() {
  const [{ blocks }, settings] = await Promise.all([
    getHomeContent(),
    getSiteSettings(),
  ])
  const page = blocks.page_contact

  return (
    <div className="content-container section-y">
      <div className="mx-auto mb-12 flex max-w-lg flex-col items-center gap-4 text-center small:mb-16">
        <span className="eyebrow">Nura</span>
        <h1 className="font-serif text-4xl text-brown small:text-5xl">
          {page?.title || "Contact"}
        </h1>
      </div>

      <div className="grid grid-cols-1 gap-12 small:grid-cols-[1fr_1.1fr] small:gap-20">
        <div className="flex flex-col gap-10">
          <div className="flex flex-col gap-4">
            <span className="eyebrow">Service client</span>
            <ul className="flex flex-col gap-y-3">
              {settings.phones.map((contact) => (
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
            <p className="text-xs text-ui-fg-muted">{settings.hours}</p>
          </div>

          <div className="flex flex-col gap-3 border-t border-nude pt-8">
            <span className="eyebrow">Par email</span>
            <a
              href={`mailto:${settings.email}`}
              className="text-brown hover:text-gold"
            >
              {settings.email}
            </a>
          </div>

          <div className="flex flex-col gap-3 border-t border-nude pt-8 text-sm leading-relaxed text-ui-fg-subtle [&_a]:text-gold [&_a]:underline [&_a]:underline-offset-4 [&_a]:hover:text-brown [&_p]:mb-0">
            <PostBody content={page?.content || DEFAULT_CONTENT} />
          </div>
        </div>

        <div className="border border-nude bg-bg-alt p-6 small:p-10">
          <ContactForm />
        </div>
      </div>
    </div>
  )
}
