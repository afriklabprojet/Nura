import ItemsPreviewTemplate from "@modules/cart/templates/preview"
import DiscountCode from "@modules/checkout/components/discount-code"
import CartTotals from "@modules/common/components/cart-totals"
import Divider from "@modules/common/components/divider"
import { getSiteSettings } from "@lib/data/site-settings"
import { HttpTypes } from "@medusajs/types"

const CheckoutSummary = async ({ cart }: { cart: HttpTypes.StoreCart }) => {
  const siteSettings = await getSiteSettings()

  return (
    <div className="flex flex-col gap-4 small:sticky small:top-8 small:self-start">
      <div className="flex w-full flex-col border border-nude bg-bg-alt p-6">
        <h2 className="font-serif text-2xl text-brown">Dans votre panier</h2>
        <Divider className="my-5" />
        <CartTotals totals={cart} />
        <Divider className="my-5" />
        <ItemsPreviewTemplate cart={cart} />
        <div className="mt-6">
          <DiscountCode cart={cart} />
        </div>
      </div>

      <p className="px-1 text-xs leading-relaxed text-ui-fg-muted">
        Une question sur votre commande ?{" "}
        {siteSettings.phones.map((contact, index) => (
          <span key={contact.tel}>
            {index > 0 && " · "}
            <a href={`tel:${contact.tel}`} className="text-gold hover:text-brown">
              {contact.display}
            </a>
          </span>
        ))}
      </p>
    </div>
  )
}

export default CheckoutSummary
