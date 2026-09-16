import { listRecentlyViewedProducts } from "@lib/data/recently-viewed"
import { HttpTypes } from "@medusajs/types"
import Product from "../product-preview"

const RecentlyViewed = async ({
  region,
  excludeHandle,
}: {
  region: HttpTypes.StoreRegion
  excludeHandle?: string
}) => {
  const products = await listRecentlyViewedProducts({
    regionId: region.id,
    excludeHandle,
  })

  if (products.length === 0) {
    return null
  }

  return (
    <div className="content-container my-16 small:my-32">
      <div className="flex flex-col items-center text-center mb-16">
        <span className="text-base-regular text-gray-600 mb-6">
          Vu récemment
        </span>
        <p className="text-2xl-regular text-ui-fg-base max-w-lg">
          Reprenez là où vous vous étiez arrêté(e).
        </p>
      </div>

      <ul className="grid grid-cols-2 small:grid-cols-3 medium:grid-cols-4 gap-x-6 gap-y-8">
        {products.map((product) => (
          <li key={product.id}>
            <Product region={region} product={product} />
          </li>
        ))}
      </ul>
    </div>
  )
}

export default RecentlyViewed
