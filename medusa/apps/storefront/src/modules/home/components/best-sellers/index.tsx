import { listProducts } from "@lib/data/products"
import { HttpTypes } from "@medusajs/types"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import ProductPreview from "@modules/products/components/product-preview"

// Merchandising order: whatever the shop flags as a best-seller comes first,
// then the newer pieces. Set `badge` in a product's metadata to surface it.
const BADGE_ORDER = ["Best-seller", "Nouveau", "Édition limitée"]

const badgeOf = (product: HttpTypes.StoreProduct) =>
  typeof product.metadata?.badge === "string" ? product.metadata.badge : null

export default async function BestSellers({
  region,
}: {
  region: HttpTypes.StoreRegion
}) {
  const {
    response: { products },
  } = await listProducts({
    regionId: region.id,
    queryParams: { limit: 20, fields: "*variants.calculated_price,+variants.inventory_quantity,+variants.manage_inventory,+variants.allow_backorder,+metadata" },
  })

  const flagged = products
    .filter((product) => badgeOf(product))
    .sort((a, b) => {
      const rank = (product: HttpTypes.StoreProduct) => {
        const index = BADGE_ORDER.indexOf(badgeOf(product)!)
        return index === -1 ? BADGE_ORDER.length : index
      }

      return rank(a) - rank(b)
    })
    .slice(0, 4)

  if (flagged.length === 0) {
    return null
  }

  return (
    <section className="content-container section-y">
      <div className="mb-10 flex flex-col gap-4 small:mb-14 small:flex-row small:items-end small:justify-between">
        <div className="flex flex-col gap-3">
          <span className="eyebrow">Best-sellers</span>
          <h2 className="font-serif text-4xl text-brown small:text-5xl">
            Les plus désirés
          </h2>
        </div>
        <LocalizedClientLink
          href="/store"
          className="link-underline self-start text-[11px] uppercase tracking-[0.2em] text-brown/70 hover:text-brown"
        >
          Toute la boutique
        </LocalizedClientLink>
      </div>

      <ul className="grid grid-cols-2 gap-x-5 gap-y-12 small:grid-cols-4 small:gap-x-8">
        {flagged.map((product) => (
          <li key={product.id}>
            <ProductPreview product={product} region={region} isFeatured />
          </li>
        ))}
      </ul>
    </section>
  )
}
