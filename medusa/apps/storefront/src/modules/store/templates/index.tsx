import { Suspense } from "react"

import { getHomeContent } from "@lib/data/home-content"
import { listProductOptions } from "@lib/data/products"
import { OptionValueIds } from "@lib/util/product-option-filters"
import SkeletonProductGrid from "@modules/skeletons/templates/skeleton-product-grid"
import RefinementList from "@modules/store/components/refinement-list"
import { SortOptions } from "@modules/store/components/refinement-list/sort-products"

import PaginatedProducts from "./paginated-products"

const StoreTemplate = async ({
  sortBy,
  page,
  countryCode,
  optionValueIds,
}: {
  sortBy?: SortOptions
  page?: string
  countryCode: string
  optionValueIds?: OptionValueIds
}) => {
  const pageNumber = page ? parseInt(page) : 1
  const sort = sortBy || "created_at"
  const [options, { blocks }] = await Promise.all([
    listProductOptions(),
    getHomeContent(),
  ])
  const storePage = blocks.store_page

  return (
    <div className="content-container py-10 small:py-16" data-testid="category-container">
      <div className="mb-10 flex flex-col items-center gap-4 text-center small:mb-14">
        <span className="eyebrow">{storePage?.eyebrow || "La boutique"}</span>
        <h1
          className="font-serif text-4xl text-brown small:text-6xl"
          data-testid="store-page-title"
        >
          {storePage?.title || "Tous nos produits"}
        </h1>
        <p className="max-w-md text-sm leading-relaxed text-ui-fg-subtle">
          {storePage?.text ||
            "Parfums, soins et coffrets : toute la maison Nura en un seul endroit."}
        </p>
      </div>

      <RefinementList sortBy={sort} options={options} />

      <Suspense fallback={<SkeletonProductGrid />}>
        <PaginatedProducts
          sortBy={sort}
          page={pageNumber}
          countryCode={countryCode}
          optionValueIds={optionValueIds}
          emptyText={storePage?.empty_state}
        />
      </Suspense>
    </div>
  )
}

export default StoreTemplate
