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
  const [searchError, setSearchError] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)
  const triggerRef = useRef<HTMLButtonElement>(null)
  const requestIdRef = useRef(0)

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
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false)
        requestAnimationFrame(() => triggerRef.current?.focus())
      }
    }
    document.addEventListener("keydown", handleEscape)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
      document.removeEventListener("keydown", handleEscape)
    }
  }, [open])

  useEffect(() => {
    if (!searchClient || query.trim().length < 2) {
      setHits([])
      setSearchError(false)
      setIsSearching(false)
      return
    }
    const client = searchClient
    const requestId = ++requestIdRef.current

    setIsSearching(true)
    setSearchError(false)
    const timeout = setTimeout(() => {
      client
        .index("products")
        // No filter needed: the search index is seeded with
        // `{ status: 'published' }` only (see src/search/products.ts), so
        // every indexed document is already a published product.
        .search<SearchHit>(query, {
          limit: 6,
        })
        .then((res) => {
          if (requestId === requestIdRef.current) {
            setHits(res.hits)
          }
        })
        .catch(() => {
          if (requestId === requestIdRef.current) {
            setHits([])
            setSearchError(true)
          }
        })
        .finally(() => {
          if (requestId === requestIdRef.current) {
            setIsSearching(false)
          }
        })
    }, 250)

    return () => clearTimeout(timeout)
  }, [query])

  if (!SEARCH_ENABLED) {
    return null
  }

  return (
    <div className="relative" ref={containerRef}>
      <button
        ref={triggerRef}
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex h-11 w-11 items-center justify-center hover:text-gold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold"
        aria-label="Rechercher"
        data-testid="nav-search-button"
      >
        {open ? <XMark /> : <MagnifyingGlass />}
      </button>

      {open && (
        <div
          className="fixed left-5 right-5 top-[92px] z-50 border border-ui-border-base bg-bg-alt p-4 shadow-lg xsmall:absolute xsmall:left-auto xsmall:right-0 xsmall:top-full xsmall:mt-3 xsmall:w-80"
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
            className="min-h-11 w-full border-b border-ui-fg-muted bg-transparent py-2 txt-small placeholder:text-ui-fg-muted focus:border-gold focus:outline-none"
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
            {!isSearching && searchError && (
              <div className="txt-small text-rose-700" role="alert">
                <p>La recherche est momentanément indisponible.</p>
                <button
                  type="button"
                  onClick={() => setQuery((value) => `${value} `)}
                  className="mt-1 min-h-11 underline underline-offset-4"
                >
                  Réessayer
                </button>
              </div>
            )}
            {!isSearching && !searchError && query.trim().length >= 2 && hits.length === 0 && (
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
