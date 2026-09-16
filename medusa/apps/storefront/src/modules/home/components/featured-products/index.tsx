import { listProducts } from "@lib/data/products"
import { HttpTypes } from "@medusajs/types"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import ProductPreview from "@modules/products/components/product-preview"

export default async function FeaturedProducts({
  region,
}: {
  region: HttpTypes.StoreRegion
}) {
  const {
    response: { products },
  } = await listProducts({
    regionId: region.id,
    queryParams: {
      limit: 4,
      fields: "*variants.calculated_price",
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
            <span className="eyebrow">La sélection</span>
            <h2 className="font-serif text-4xl text-brown small:text-5xl">
              Les essentiels Nura
            </h2>
          </div>
          <LocalizedClientLink
            href="/store"
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
