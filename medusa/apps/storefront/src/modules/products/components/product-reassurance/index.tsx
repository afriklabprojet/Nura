import { getSiteSettings } from "@lib/data/site-settings"

const ProductReassurance = async () => {
  const siteSettings = await getSiteSettings()

  return (
    <ul className="flex flex-col gap-y-2 border-t border-nude pt-6 text-xs text-ui-fg-subtle">
      <li>Expédition sous 24 à 48 h, puis livraison selon la destination</li>
      <li>Retour sous 14 jours pour tout produit non ouvert</li>
      <li className="flex flex-wrap gap-x-3">
        <span>Une question ?</span>
        {siteSettings.phones.map((contact) => (
          <a
            key={contact.tel}
            href={`tel:${contact.tel}`}
            className="text-gold hover:text-brown"
          >
            {contact.display}
          </a>
        ))}
      </li>
    </ul>
  )
}

export default ProductReassurance
