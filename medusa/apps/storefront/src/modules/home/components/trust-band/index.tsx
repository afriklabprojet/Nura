import { SERVICE_CLIENT_CONTACTS } from "@lib/constants"

const items = [
  {
    title: "France & Côte d'Ivoire",
    detail: "Expédition sous 3 à 7 jours ouvrés",
  },
  {
    title: "Paiement sécurisé",
    detail: "Carte bancaire et mobile money",
  },
  {
    title: "Retours sous 14 jours",
    detail: "Droit de rétractation, produits non ouverts",
  },
  {
    title: "Service client",
    detail: SERVICE_CLIENT_CONTACTS.map((c) => `${c.label} ${c.display}`).join(
      " · "
    ),
  },
]

const TrustBand = () => {
  return (
    <section className="border-b border-nude bg-bg-alt">
      <ul className="content-container grid grid-cols-2 gap-x-6 gap-y-8 py-10 small:grid-cols-4 small:py-12">
        {items.map((item) => (
          <li key={item.title} className="flex flex-col gap-2 text-center">
            <span className="mx-auto h-px w-6 bg-gold" />
            <span className="text-[11px] uppercase tracking-[0.2em] text-brown">
              {item.title}
            </span>
            <span className="text-xs leading-relaxed text-ui-fg-subtle">
              {item.detail}
            </span>
          </li>
        ))}
      </ul>
    </section>
  )
}

export default TrustBand
