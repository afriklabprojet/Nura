import { Suspense } from "react"

import { OptionValueIds } from "@lib/util/product-option-filters"
import SkeletonProductGrid from "@modules/skeletons/templates/skeleton-product-grid"
import RefinementList from "@modules/store/components/refinement-list"
import { SortOptions } from "@modules/store/components/refinement-list/sort-products"

import PaginatedProducts from "./paginated-products"

const StoreTemplate = ({
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

  return (
    <div className="content-container py-10 small:py-16" data-testid="category-container">
      <div className="mb-10 flex flex-col items-center gap-4 text-center small:mb-14">
        <span className="eyebrow">La boutique</span>
        <h1
          className="font-serif text-4xl text-brown small:text-6xl"
          data-testid="store-page-title"
        >
          Tous nos produits
        </h1>
        <p className="max-w-md text-sm leading-relaxed text-ui-fg-subtle">
          Parfums, soins et coffrets : toute la maison Nura en un seul endroit.
        </p>
      </div>

      <RefinementList sortBy={sort} />

      <Suspense fallback={<SkeletonProductGrid />}>
        <PaginatedProducts
          sortBy={sort}
          page={pageNumber}
          countryCode={countryCode}
          optionValueIds={optionValueIds}
        />
      </Suspense>
    </div>
  )
}

export default StoreTemplate
