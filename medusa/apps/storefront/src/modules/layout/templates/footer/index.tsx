import { listCategories } from "@lib/data/categories"
import { getSiteSettings } from "@lib/data/site-settings"

import LocalizedClientLink from "@modules/common/components/localized-client-link"
import NewsletterForm from "@modules/layout/components/newsletter-form"

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

const HELP_LINKS = [
  { label: "FAQ", href: "/faq" },
  { label: "Livraison & retours", href: "/livraison-retours" },
  { label: "Suivi de commande", href: "/account/orders" },
  { label: "Conditions générales", href: "/cgv" },
  { label: "Politique de confidentialité", href: "/confidentialite" },
  { label: "Mentions légales", href: "/mentions-legales" },
]

export default async function Footer() {
  const productCategories = await listCategories()
  const siteSettings = await getSiteSettings()
  const topLevel = productCategories?.filter((c) => !c.parent_category) || []

  return (
    <footer className="w-full border-t border-nude bg-bg-alt">
      <div className="content-container flex flex-col">
        <div className="grid grid-cols-1 gap-12 py-16 xsmall:grid-cols-2 small:grid-cols-[1.3fr_1fr_1fr_1.2fr] small:py-20">
          <div className="flex max-w-xs flex-col gap-4">
            <LocalizedClientLink
              href="/"
              className="font-serif text-2xl uppercase tracking-[0.3em] text-brown hover:text-gold"
            >
              Nura
            </LocalizedClientLink>
            <p className="font-serif text-lg text-brown/70">
              Votre aura commence ici.
            </p>
            <p className="text-sm leading-relaxed text-ui-fg-subtle">
              Parfums et soins pensés pour accompagner chaque aura, chaque
              humeur et chaque moment.
            </p>
            <div className="flex gap-x-5 pt-2">
              <a
                href={siteSettings.social.instagram}
                target="_blank"
                rel="noreferrer"
                className="text-[11px] uppercase tracking-[0.2em] text-brown/70 hover:text-gold"
              >
                Instagram
              </a>
              <a
                href={siteSettings.social.tiktok}
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
              {topLevel.slice(0, 4).map((category) => (
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
              <li>
                <LocalizedClientLink
                  href="/collections"
                  className="hover:text-gold"
                >
                  Collections
                </LocalizedClientLink>
              </li>
              <li>
                <LocalizedClientLink href="/store" className="hover:text-gold">
                  Tous les produits
                </LocalizedClientLink>
              </li>
              <li>
                <LocalizedClientLink
                  href="/a-propos"
                  className="hover:text-gold"
                >
                  À propos
                </LocalizedClientLink>
              </li>
              <li>
                <LocalizedClientLink href="/journal" className="hover:text-gold">
                  Journal
                </LocalizedClientLink>
              </li>
              <li>
                <LocalizedClientLink href="/contact" className="hover:text-gold">
                  Contact
                </LocalizedClientLink>
              </li>
            </ul>
          </div>

          <div className="flex flex-col gap-4">
            <span className="eyebrow">Aide</span>
            <ul className="flex flex-col gap-y-2 text-sm text-ui-fg-subtle">
              {HELP_LINKS.map((link) => (
                <li key={link.href}>
                  <LocalizedClientLink
                    href={link.href}
                    className="hover:text-gold"
                  >
                    {link.label}
                  </LocalizedClientLink>
                </li>
              ))}
            </ul>
          </div>

          <div className="flex flex-col gap-6">
            <div className="flex flex-col gap-3">
              <span className="eyebrow">Newsletter</span>
              <p className="text-sm leading-relaxed text-ui-fg-subtle">
                Nouveautés, lancements et accès exclusifs.
              </p>
              <NewsletterForm />
            </div>

            <div className="flex flex-col gap-2 border-t border-nude pt-5">
              <span className="eyebrow">Service client</span>
              <ul className="flex flex-col gap-y-2 text-sm text-ui-fg-subtle">
                {siteSettings.phones.map((contact) => (
                  <li key={contact.tel}>
                    <a href={`tel:${contact.tel}`} className="hover:text-gold">
                      {contact.label} — {contact.display}
                    </a>
                  </li>
                ))}
                <li>
                  <a
                    href={`mailto:${siteSettings.email}`}
                    className="hover:text-gold"
                  >
                    {siteSettings.email}
                  </a>
                </li>
                <li className="text-xs text-ui-fg-muted">{siteSettings.hours}</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-y-5 border-t border-nude py-8 text-ui-fg-muted small:flex-row small:items-center small:justify-between">
          <p className="text-xs">
            © {new Date().getFullYear()} Nura — Tous droits réservés.
          </p>
          <ul className="flex flex-wrap gap-2">
            {PAYMENT_METHODS.map((method) => (
              <li
                key={method}
                className="border border-nude px-2.5 py-1 text-[10px] uppercase tracking-[0.1em]"
              >
                {method}
              </li>
            ))}
          </ul>
          <p className="text-xs">Votre aura commence ici.</p>
        </div>
      </div>
    </footer>
  )
}
