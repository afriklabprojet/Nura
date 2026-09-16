import { listCollections } from "@lib/data/collections"
import { listProducts } from "@lib/data/products"
import { HttpTypes } from "@medusajs/types"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import ProductPreview from "@modules/products/components/product-preview"

export default async function FeaturedProducts({
  region,
}: {
  region: HttpTypes.StoreRegion
}) {
  const { collections } = await listCollections({ fields: "id,handle,title" })
  const essentials = collections.find(
    (collection) => collection.handle === "les-essentiels-nura"
  )

  const {
    response: { products },
  } = await listProducts({
    regionId: region.id,
    queryParams: {
      limit: 4,
      fields: "*variants.calculated_price,+variants.inventory_quantity,+variants.manage_inventory,+variants.allow_backorder,+metadata",
      ...(essentials ? { collection_id: [essentials.id] } : {}),
    },
  })

  if (!products?.length) {
    return null
  }

  return (
    <section className="border-t border-nude bg-bg-alt">
      <div className="content-container section-y">
        <div className="mb-10 flex flex-col gap-4 small:mb-14 small:flex-row small:items-end small:justify-between">
          <div className="flex flex-col gap-3">
            <span className="eyebrow">Nos essentiels</span>
            <h2 className="font-serif text-4xl text-brown small:text-5xl">
              Les essentiels Nura
            </h2>
            <p className="max-w-md text-sm leading-relaxed text-ui-fg-subtle">
              Découvrez les signatures parfumées de la maison.
            </p>
          </div>
          <LocalizedClientLink
            href={
              essentials ? `/collections/${essentials.handle}` : "/store"
            }
            className="link-underline self-start text-[11px] uppercase tracking-[0.2em] text-brown/70 hover:text-brown"
          >
            Tout voir
          </LocalizedClientLink>
        </div>

        <ul className="grid grid-cols-2 gap-x-5 gap-y-12 small:grid-cols-4 small:gap-x-8">
          {products.map((product) => (
            <li key={product.id}>
              <ProductPreview product={product} region={region} isFeatured />
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
