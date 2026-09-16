"use client"

import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { useCallback, useMemo, useState } from "react"

import {
  OPTION_VALUE_QUERY_KEY,
  parseOptionValueIds,
} from "@lib/util/product-option-filters"
import { clx } from "@modules/common/components/ui"
import OptionsPicker from "./options-picker"
import { SortOptions, sortOptions } from "./sort-products"

type RefinementListProps = {
  sortBy: SortOptions
  search?: boolean
  hideOptionsPicker?: boolean
  count?: number
  "data-testid"?: string
}

const RefinementList = ({
  sortBy,
  hideOptionsPicker = false,
  count,
  "data-testid": dataTestId,
}: RefinementListProps) => {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const [filtersOpen, setFiltersOpen] = useState(false)

  const updateQueryParams = useCallback(
    (updater: (params: URLSearchParams) => void) => {
      const params = new URLSearchParams(searchParams.toString())
      updater(params)

      params.delete("page")

      const queryString = params.toString()
      const currentQuery = searchParams.toString()
      const nextPath = queryString ? `${pathname}?${queryString}` : pathname
      const currentPath = currentQuery
        ? `${pathname}?${currentQuery}`
        : pathname

      if (nextPath !== currentPath) {
        router.push(nextPath)
      }
    },
    [pathname, router, searchParams]
  )

  const selectedOptionValueIds = useMemo(
    () => parseOptionValueIds(searchParams),
    [searchParams]
  )

  const setOptionValueIds = (valueIds: string[]) =>
    updateQueryParams((params) => {
      params.delete(OPTION_VALUE_QUERY_KEY)
      valueIds.forEach((valueId) =>
        params.append(OPTION_VALUE_QUERY_KEY, valueId)
      )
    })

  const clearFilters = () =>
    updateQueryParams((params) => params.delete(OPTION_VALUE_QUERY_KEY))

  return (
    <div className="sticky top-16 z-30 -mx-5 mb-10 border-y border-nude bg-bg/95 px-5 backdrop-blur small:top-[72px] small:-mx-10 small:px-10">
      <div className="flex items-center justify-between gap-4 py-3">
        <div className="flex items-center gap-4">
          {!hideOptionsPicker && (
            <button
              type="button"
              onClick={() => setFiltersOpen((open) => !open)}
              aria-expanded={filtersOpen}
              className="text-[11px] uppercase tracking-[0.2em] text-brown hover:text-gold"
            >
              {filtersOpen ? "Masquer les filtres" : "Filtrer"}
            </button>
          )}
          {selectedOptionValueIds.length > 0 && (
            <button
              type="button"
              onClick={clearFilters}
              className="text-[11px] uppercase tracking-[0.2em] text-gold hover:text-brown"
            >
              Tout effacer ({selectedOptionValueIds.length})
            </button>
          )}
          {typeof count === "number" && (
            <span className="hidden text-[11px] uppercase tracking-[0.2em] text-ui-fg-muted xsmall:inline">
              {count} produit{count > 1 ? "s" : ""}
            </span>
          )}
        </div>

        <div
          className="flex items-center gap-3 overflow-x-auto no-scrollbar"
          data-testid={dataTestId}
        >
          <span className="hidden text-[11px] uppercase tracking-[0.2em] text-ui-fg-muted xsmall:inline">
            Trier
          </span>
          {sortOptions.map((option) => (
            <button
              key={option.value}
              type="button"
              onClick={() => updateQueryParams((p) => p.set("sortBy", option.value))}
              className={clx(
                "whitespace-nowrap text-[11px] uppercase tracking-[0.15em] transition-colors",
                sortBy === option.value
                  ? "text-brown underline underline-offset-4 decoration-gold"
                  : "text-ui-fg-muted hover:text-brown"
              )}
              data-testid={`sort-${option.value}`}
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>

      {!hideOptionsPicker && filtersOpen && (
        <div className="border-t border-nude py-6">
          <OptionsPicker
            selectedValueIds={selectedOptionValueIds}
            setOptionValueIds={setOptionValueIds}
          />
        </div>
      )}
    </div>
  )
}

export default RefinementList
