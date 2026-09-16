import {
  CONTACT_EMAIL,
  SERVICE_CLIENT_CONTACTS,
  SOCIAL_LINKS,
} from "@lib/constants"
import { listCategories } from "@lib/data/categories"
import { listCollections } from "@lib/data/collections"

import LocalizedClientLink from "@modules/common/components/localized-client-link"

// Mirrors what the FAQ states: card payments in Europe, mobile money in
// Côte d'Ivoire through Jèko.
const PAYMENT_METHODS = [
  "Carte bancaire",
  "Wave",
  "Orange Money",
  "MTN",
  "Moov",
  "Djamo",
]

export default async function Footer() {
  const { collections } = await listCollections({
    fields: "*products",
  })
  const productCategories = await listCategories()

  const topLevel = productCategories?.filter((c) => !c.parent_category) || []

  return (
    <footer className="w-full border-t border-nude bg-bg-alt">
      <div className="content-container flex flex-col">
        <div className="grid grid-cols-1 gap-12 py-16 small:grid-cols-[1.4fr_1fr_1fr_1.2fr] small:py-20">
          <div className="flex max-w-xs flex-col gap-4">
            <LocalizedClientLink
              href="/"
              className="font-serif text-2xl uppercase tracking-[0.3em] text-brown hover:text-gold"
            >
              Nura
            </LocalizedClientLink>
            <p className="text-sm leading-relaxed text-ui-fg-subtle">
              Votre aura commence ici. Parfums et soins pensés pour accompagner
              chaque aura, chaque humeur et chaque moment.
            </p>
            <div className="flex gap-x-5 pt-2">
              <a
                href={SOCIAL_LINKS.instagram}
                target="_blank"
                rel="noreferrer"
                className="text-[11px] uppercase tracking-[0.2em] text-brown/70 hover:text-gold"
              >
                Instagram
              </a>
              <a
                href={SOCIAL_LINKS.tiktok}
                target="_blank"
                rel="noreferrer"
                className="text-[11px] uppercase tracking-[0.2em] text-brown/70 hover:text-gold"
              >
                TikTok
              </a>
            </div>
          </div>

          <div className="flex flex-col gap-4">
            <span className="eyebrow">Boutique</span>
            <ul className="flex flex-col gap-y-2 text-sm text-ui-fg-subtle">
              <li>
                <LocalizedClientLink href="/store" className="hover:text-gold">
                  Tous les produits
                </LocalizedClientLink>
              </li>
              {topLevel.slice(0, 5).map((category) => (
                <li key={category.id}>
                  <LocalizedClientLink
                    href={`/categories/${category.handle}`}
                    className="hover:text-gold"
                    data-testid="category-link"
                  >
                    {category.name}
                  </LocalizedClientLink>
                </li>
              ))}
              {collections?.slice(0, 3).map((c) => (
                <li key={c.id}>
                  <LocalizedClientLink
                    href={`/collections/${c.handle}`}
                    className="hover:text-gold"
                  >
                    {c.title}
                  </LocalizedClientLink>
                </li>
              ))}
            </ul>
          </div>

          <div className="flex flex-col gap-4">
            <span className="eyebrow">La maison</span>
            <ul className="flex flex-col gap-y-2 text-sm text-ui-fg-subtle">
              <li>
                <LocalizedClientLink href="/a-propos" className="hover:text-gold">
                  À propos
                </LocalizedClientLink>
              </li>
              <li>
                <LocalizedClientLink href="/faq" className="hover:text-gold">
                  FAQ
                </LocalizedClientLink>
              </li>
              <li>
                <LocalizedClientLink href="/contact" className="hover:text-gold">
                  Contact
                </LocalizedClientLink>
              </li>
              <li>
                <LocalizedClientLink href="/account" className="hover:text-gold">
                  Mon compte
                </LocalizedClientLink>
              </li>
            </ul>
          </div>

          <div className="flex flex-col gap-4">
            <span className="eyebrow">Service client</span>
            <ul className="flex flex-col gap-y-2 text-sm text-ui-fg-subtle">
              {SERVICE_CLIENT_CONTACTS.map((contact) => (
                <li key={contact.tel}>
                  <a href={`tel:${contact.tel}`} className="hover:text-gold">
                    {contact.label} — {contact.display}
                  </a>
                </li>
              ))}
              <li>
                <a href={`mailto:${CONTACT_EMAIL}`} className="hover:text-gold">
                  {CONTACT_EMAIL}
                </a>
              </li>
              <li className="pt-2 text-xs leading-relaxed text-ui-fg-muted">
                Du lundi au vendredi, 9h — 18h
              </li>
            </ul>

            <div className="flex flex-col gap-3 pt-4">
              <span className="text-[10px] uppercase tracking-[0.2em] text-ui-fg-muted">
                Paiements acceptés
              </span>
              <ul className="flex flex-wrap gap-2">
                {PAYMENT_METHODS.map((method) => (
                  <li
                    key={method}
                    className="border border-nude px-2.5 py-1 text-[10px] uppercase tracking-[0.1em] text-ui-fg-subtle"
                  >
                    {method}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-y-4 border-t border-nude py-8 text-ui-fg-muted small:flex-row small:items-center small:justify-between">
          <p className="text-xs">
            © {new Date().getFullYear()} Nura — Tous droits réservés.
          </p>
          <ul className="flex flex-wrap gap-x-6 gap-y-2 text-xs">
            <li>
              <LocalizedClientLink
                href="/mentions-legales"
                className="hover:text-gold"
              >
                Mentions légales
              </LocalizedClientLink>
            </li>
            <li>
              <LocalizedClientLink href="/cgv" className="hover:text-gold">
                CGV
              </LocalizedClientLink>
            </li>
            <li>
              <LocalizedClientLink
                href="/confidentialite"
                className="hover:text-gold"
              >
                Confidentialité
              </LocalizedClientLink>
            </li>
            <li>
              <LocalizedClientLink
                href="/politique-cookies"
                className="hover:text-gold"
              >
                Cookies
              </LocalizedClientLink>
            </li>
          </ul>
          <p className="text-xs">Votre aura commence ici.</p>
        </div>
      </div>
    </footer>
  )
}
