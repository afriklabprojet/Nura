"use client"

import { SEARCH_ENABLED, searchClient } from "@lib/config-search"
import { MagnifyingGlass, XMark } from "@medusajs/icons"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import Image from "next/image"
import { useEffect, useRef, useState } from "react"

type SearchHit = {
  id: string
  title: string
  handle: string
  thumbnail: string | null
}

const SearchBar = () => {
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState("")
  const [hits, setHits] = useState<SearchHit[]>([])
  const [isSearching, setIsSearching] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!open) {
      return
    }

    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setOpen(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [open])

  useEffect(() => {
    if (!searchClient || query.trim().length < 2) {
      setHits([])
      return
    }
    const client = searchClient

    setIsSearching(true)
    const timeout = setTimeout(() => {
      client
        .index("products")
        // No filter needed: the search index is seeded with
        // `{ status: 'published' }` only (see src/search/products.ts), so
        // every indexed document is already a published product.
        .search<SearchHit>(query, {
          limit: 6,
        })
        .then((res) => setHits(res.hits))
        .catch(() => setHits([]))
        .finally(() => setIsSearching(false))
    }, 250)

    return () => clearTimeout(timeout)
  }, [query])

  if (!SEARCH_ENABLED) {
    return null
  }

  return (
    <div className="relative" ref={containerRef}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="hover:text-gold flex items-center"
        aria-label="Rechercher"
        data-testid="nav-search-button"
      >
        {open ? <XMark /> : <MagnifyingGlass />}
      </button>

      {open && (
        <div
          className="absolute top-full right-0 mt-3 w-80 bg-bg-alt border border-ui-border-base shadow-lg rounded-sm p-4 z-50"
          role="search"
        >
          <label htmlFor="product-search" className="sr-only">
            Rechercher un produit
          </label>
          <input
            id="product-search"
            type="search"
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Rechercher un produit..."
            className="w-full bg-transparent border-b border-ui-fg-muted txt-small py-1 focus:outline-none focus:border-gold placeholder:text-ui-fg-muted"
            data-testid="search-input"
          />

          <div
            className="mt-3 flex flex-col gap-y-2 max-h-80 overflow-y-auto"
            aria-live="polite"
            aria-busy={isSearching}
          >
            {isSearching && (
              <p className="txt-small text-ui-fg-subtle">Recherche...</p>
            )}
            {!isSearching && query.trim().length >= 2 && hits.length === 0 && (
              <p className="txt-small text-ui-fg-subtle">
                Aucun résultat pour « {query} ».
              </p>
            )}
            {hits.map((hit) => (
              <LocalizedClientLink
                key={hit.id}
                href={`/products/${hit.handle}`}
                onClick={() => setOpen(false)}
                className="flex items-center gap-x-3 hover:bg-nude/30 p-1 rounded-sm"
                data-testid="search-result"
              >
                {hit.thumbnail && (
                  <Image
                    src={hit.thumbnail}
                    alt={hit.title}
                    width={40}
                    height={40}
                    className="object-cover rounded-sm shrink-0"
                  />
                )}
                <span className="txt-small text-ui-fg-base">{hit.title}</span>
              </LocalizedClientLink>
            ))}
            {!isSearching && hits.length > 0 && (
              <span className="sr-only">
                {hits.length} résultat{hits.length > 1 ? "s" : ""} trouvé
                {hits.length > 1 ? "s" : ""}.
              </span>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

export default SearchBar
