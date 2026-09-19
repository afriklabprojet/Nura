import { Metadata } from "next"
import { notFound } from "next/navigation"

import { retrieveCustomer } from "@lib/data/customer"
import { getHomeContent } from "@lib/data/home-content"
import { getRegion } from "@lib/data/regions"
import { listProducts } from "@lib/data/products"
import { listWishlist } from "@lib/data/wishlist"
import WishlistOverview from "@modules/account/components/wishlist-overview"

export const metadata: Metadata = {
  title: "Mes favoris",
  description: "Retrouvez les produits que vous avez ajoutés à vos favoris.",
}

export default async function WishlistPage(props: {
  params: Promise<{ countryCode: string }>
}) {
  const { countryCode } = await props.params
  const customer = await retrieveCustomer()
  const region = await getRegion(countryCode)

  if (!customer || !region) {
    notFound()
  }

  const wishlist = await listWishlist()
  const productIds = wishlist.map((item) => item.product_id)

  const products = productIds.length
    ? await listProducts({
        queryParams: { id: productIds },
        regionId: region.id,
      }).then(({ response }) => response.products)
    : []

  const { blocks } = await getHomeContent()

  return (
    <div className="w-full" data-testid="wishlist-page-wrapper">
      <div className="mb-8 flex flex-col gap-y-4">
        <h1 className="text-2xl-semi">Mes favoris</h1>
        <p className="text-base-regular">
          {blocks.account_messages?.wishlist_intro ||
            "Retrouvez ici les produits que vous avez ajoutés à vos favoris."}
        </p>
      </div>
      <WishlistOverview
        products={products}
        region={region}
        emptyText={blocks.account_messages?.wishlist_empty_text}
      />
    </div>
  )
}
