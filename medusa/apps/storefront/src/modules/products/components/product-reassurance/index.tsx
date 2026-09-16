import { SERVICE_CLIENT_CONTACTS } from "@lib/constants"

const ProductReassurance = () => {
  return (
    <ul className="flex flex-col gap-y-2 border-t border-nude pt-6 text-xs text-ui-fg-subtle">
      <li>Expédition en France et en Côte d&apos;Ivoire, 3 à 7 jours ouvrés</li>
      <li>Retour sous 14 jours pour tout produit non ouvert</li>
      <li className="flex flex-wrap gap-x-3">
        <span>Une question ?</span>
        {SERVICE_CLIENT_CONTACTS.map((contact) => (
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
