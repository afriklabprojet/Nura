import { Metadata } from "next"

import { CONTACT_EMAIL, SERVICE_CLIENT_CONTACTS } from "@lib/constants"
import LocalizedClientLink from "@modules/common/components/localized-client-link"

export const metadata: Metadata = {
  title: "Livraison & retours",
  description:
    "Zones et délais de livraison Nura, suivi de commande, droit de rétractation et conditions de retour.",
}

export default function LivraisonRetoursPage() {
  return (
    <div className="content-container section-y">
      <div className="mx-auto mb-12 flex max-w-xl flex-col items-center gap-4 text-center small:mb-16">
        <span className="eyebrow">Informations pratiques</span>
        <h1 className="font-serif text-4xl text-brown small:text-5xl">
          Livraison &amp; retours
        </h1>
        <p className="text-sm leading-relaxed text-ui-fg-subtle">
          Tout ce qu&apos;il faut savoir avant et après votre commande.
        </p>
      </div>

      <div className="mx-auto flex max-w-2xl flex-col gap-y-12">
        <section className="flex flex-col gap-3">
          <h2 className="font-serif text-2xl text-brown">Zones et délais</h2>
          <p className="leading-relaxed text-ui-fg-subtle">
            Nous livrons en France métropolitaine et en Côte d&apos;Ivoire. Le
            délai indicatif est de 3 à 7 jours ouvrés à compter de la
            validation de votre commande.
          </p>
        </section>

        <section className="flex flex-col gap-3 border-t border-nude pt-10">
          <h2 className="font-serif text-2xl text-brown">
            Frais de livraison
          </h2>
          <p className="leading-relaxed text-ui-fg-subtle">
            Les frais de livraison dépendent de votre destination. Ils sont
            calculés et affichés avant la validation du paiement, à l&apos;étape
            Livraison du tunnel de commande.
          </p>
        </section>

        <section className="flex flex-col gap-3 border-t border-nude pt-10">
          <h2 className="font-serif text-2xl text-brown">
            Suivi de commande
          </h2>
          <p className="leading-relaxed text-ui-fg-subtle">
            Un email de confirmation vous est envoyé dès la validation de
            votre commande. Vous pouvez ensuite en suivre le statut depuis
            votre compte, rubrique{" "}
            <LocalizedClientLink
              href="/account/orders"
              className="text-gold hover:underline"
            >
              Commandes
            </LocalizedClientLink>
            .
          </p>
        </section>

        <section className="flex flex-col gap-3 border-t border-nude pt-10">
          <h2 className="font-serif text-2xl text-brown">
            Droit de rétractation
          </h2>
          <p className="leading-relaxed text-ui-fg-subtle">
            Vous disposez de 14 jours après réception pour exercer votre droit
            de rétractation. Les produits doivent être retournés neufs, non
            ouverts et dans leur emballage d&apos;origine.
          </p>
          <p className="leading-relaxed text-ui-fg-subtle">
            Pour des raisons d&apos;hygiène, les produits descellés — parfums et
            cosmétiques ouverts — ne peuvent pas être repris. Le remboursement
            intervient dans les 14 jours suivant la réception du retour, sur le
            moyen de paiement utilisé lors de la commande.
          </p>
          <p className="leading-relaxed text-ui-fg-subtle">
            Les conditions complètes figurent dans nos{" "}
            <LocalizedClientLink href="/cgv" className="text-gold hover:underline">
              conditions générales de vente
            </LocalizedClientLink>
            .
          </p>
        </section>

        <section className="flex flex-col gap-3 border-t border-nude pt-10">
          <h2 className="font-serif text-2xl text-brown">
            Un colis abîmé, une question ?
          </h2>
          <p className="leading-relaxed text-ui-fg-subtle">
            Écrivez-nous à{" "}
            <a href={`mailto:${CONTACT_EMAIL}`} className="text-gold hover:underline">
              {CONTACT_EMAIL}
            </a>{" "}
            ou appelez le service client :
          </p>
          <ul className="flex flex-col gap-1">
            {SERVICE_CLIENT_CONTACTS.map((contact) => (
              <li key={contact.tel}>
                <a
                  href={`tel:${contact.tel}`}
                  className="text-gold hover:underline"
                >
                  {contact.label} — {contact.display}
                </a>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </div>
  )
}
