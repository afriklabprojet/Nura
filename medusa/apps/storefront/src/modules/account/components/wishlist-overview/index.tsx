import { HttpTypes } from "@medusajs/types"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import { Text } from "@modules/common/components/ui"
import ProductPreview from "@modules/products/components/product-preview"
import WishlistButton from "@modules/products/components/wishlist-button"

type WishlistOverviewProps = {
  products: HttpTypes.StoreProduct[]
  region: HttpTypes.StoreRegion
  emptyText?: string
}

const WishlistOverview = ({
  products,
  region,
  emptyText,
}: WishlistOverviewProps) => {
  if (products.length === 0) {
    return (
      <div
        className="flex flex-col items-center gap-y-4 py-12 text-center"
        data-testid="wishlist-empty"
      >
        <Text className="text-ui-fg-subtle">
          {emptyText || "Vous n'avez pas encore de favoris."}
        </Text>
        <LocalizedClientLink href="/store" className="underline text-brown">
          Découvrir nos produits
        </LocalizedClientLink>
      </div>
    )
  }

  return (
    <ul
      className="grid grid-cols-2 w-full small:grid-cols-3 gap-x-6 gap-y-8"
      data-testid="wishlist-list"
    >
      {products.map((product) => (
        <li key={product.id} className="flex flex-col gap-y-2">
          <ProductPreview product={product} region={region} />
          <WishlistButton
            productId={product.id!}
            isLoggedIn
            isInWishlist
          />
        </li>
      ))}
    </ul>
  )
}

export default WishlistOverview
