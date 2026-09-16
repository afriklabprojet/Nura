import { MeiliSearch } from "meilisearch"

export const SEARCH_ENABLED = !!(
  process.env.NEXT_PUBLIC_MEILISEARCH_HOST &&
  process.env.NEXT_PUBLIC_MEILISEARCH_API_KEY
)

// Only constructed when search is actually configured — the search-only
// API key is safe to ship to the browser (it can only query, not write),
// unlike the Meilisearch master key used server-side for indexing.
export const searchClient = SEARCH_ENABLED
  ? new MeiliSearch({
      host: process.env.NEXT_PUBLIC_MEILISEARCH_HOST!,
      apiKey: process.env.NEXT_PUBLIC_MEILISEARCH_API_KEY!,
    })
  : null
