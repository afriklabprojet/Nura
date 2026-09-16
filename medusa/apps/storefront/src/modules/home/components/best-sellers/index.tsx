import { listProducts } from "@lib/data/products"
import { listProductReviews } from "@lib/data/reviews"
import { HttpTypes } from "@medusajs/types"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import Reveal from "@modules/common/components/reveal"
import ProductPreview from "@modules/products/components/product-preview"
import StarRating from "@modules/products/components/star-rating"

const PRODUCT_FIELDS =
  "*variants.calculated_price,+variants.inventory_quantity,+variants.manage_inventory,+variants.allow_backorder,+metadata"

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
    queryParams: { limit: 20, fields: PRODUCT_FIELDS },
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

  const ratings = await Promise.all(
    flagged.map(async (product) => {
      const { average_rating, count } = await listProductReviews(product.id)
      return { id: product.id, average: average_rating, count }
    })
  )

  return (
    <section className="content-container section-y">
      <Reveal className="mb-10 flex flex-col gap-3 text-center small:mb-14">
        <span className="eyebrow">Best-sellers</span>
        <h2 className="font-serif text-4xl text-brown small:text-5xl">
          Les incontournables
        </h2>
        <p className="mx-auto max-w-md text-sm leading-relaxed text-ui-fg-subtle">
          Les signatures Nura que vous aimez le plus.
        </p>
      </Reveal>

      <ul className="grid grid-cols-2 gap-x-5 gap-y-12 small:grid-cols-4 small:gap-x-8">
        {flagged.map((product) => {
          const rating = ratings.find((entry) => entry.id === product.id)

          return (
            <li key={product.id} className="flex flex-col">
              <ProductPreview product={product} region={region} isFeatured />
              {rating && rating.count > 0 && (
                <div className="mt-2 flex items-center justify-center gap-2">
                  <StarRating value={Math.round(rating.average)} size="small" />
                  <span className="text-[11px] text-ui-fg-muted">
                    ({rating.count})
                  </span>
                </div>
              )}
            </li>
          )
        })}
      </ul>

      <div className="mt-12 flex justify-center">
        <LocalizedClientLink
          href="/store"
          className="inline-flex h-12 items-center justify-center border border-brown/30 px-10 text-[11px] uppercase tracking-[0.2em] text-brown transition-colors hover:border-brown"
        >
          Découvrir les best-sellers
        </LocalizedClientLink>
      </div>
    </section>
  )
}
