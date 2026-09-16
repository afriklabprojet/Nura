import { EssentialsBlock } from "@lib/data/home-content"
import { listCollections } from "@lib/data/collections"
import { listProducts } from "@lib/data/products"
import { parseHandles } from "@lib/util/home-content"
import { HttpTypes } from "@medusajs/types"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import Reveal from "@modules/common/components/reveal"
import ProductPreview from "@modules/products/components/product-preview"

const PRODUCT_FIELDS =
  "*variants.calculated_price,+variants.inventory_quantity,+variants.manage_inventory,+variants.allow_backorder,+metadata"

const DEFAULTS = {
  title: "Les essentiels Nura",
  subtitle: "Découvrez les signatures parfumées de la maison.",
}

export default async function FeaturedProducts({
  region,
  block,
  hidden,
}: {
  region: HttpTypes.StoreRegion
  block?: EssentialsBlock
  hidden?: boolean
}) {
  if (hidden) {
    return null
  }

  const content = { ...DEFAULTS, ...(block || {}) }
  const handles = parseHandles(block?.handles)

  let products: HttpTypes.StoreProduct[] = []

  if (handles.length > 0) {
    const { response } = await listProducts({
      regionId: region.id,
      queryParams: { handle: handles, limit: handles.length, fields: PRODUCT_FIELDS },
    })

    // Honour the order the admin typed rather than the API's.
    products = handles
      .map((handle) => response.products.find((p) => p.handle === handle))
      .filter((product): product is HttpTypes.StoreProduct => Boolean(product))
  }

  if (products.length === 0) {
    const { collections } = await listCollections({ fields: "id,handle,title" })
    const essentials = collections.find(
      (collection) => collection.handle === "les-essentiels-nura"
    )

    const { response } = await listProducts({
      regionId: region.id,
      queryParams: {
        limit: 4,
        fields: PRODUCT_FIELDS,
        ...(essentials ? { collection_id: [essentials.id] } : {}),
      },
    })

    products = response.products
  }

  if (!products.length) {
    return null
  }

  return (
    <section className="border-t border-nude bg-bg-alt">
      <div className="content-container section-y">
        <Reveal className="mb-10 flex flex-col gap-3 text-center small:mb-14">
          <span className="eyebrow">Nos essentiels</span>
          <h2 className="font-serif text-4xl text-brown small:text-5xl">
            {content.title}
          </h2>
          {content.subtitle && (
            <p className="mx-auto max-w-md text-sm leading-relaxed text-ui-fg-subtle">
              {content.subtitle}
            </p>
          )}
        </Reveal>

        {/* Swipeable on a phone, an even grid from 900px up. */}
        <ul className="no-scrollbar -mx-5 flex snap-x snap-mandatory gap-4 overflow-x-auto px-5 small:mx-0 small:grid small:grid-cols-4 small:gap-8 small:overflow-visible small:px-0">
          {products.slice(0, 4).map((product) => (
            <li
              key={product.id}
              className="w-[62%] flex-none snap-start xsmall:w-[44%] small:w-auto"
            >
              <ProductPreview product={product} region={region} isFeatured />
            </li>
          ))}
        </ul>

        <div className="mt-12 flex justify-center">
          <LocalizedClientLink
            href="/store"
            className="inline-flex h-12 items-center justify-center border border-brown/30 px-10 text-[11px] uppercase tracking-[0.2em] text-brown transition-colors hover:border-brown"
          >
            Voir tous les produits
          </LocalizedClientLink>
        </div>
      </div>
    </section>
  )
}
