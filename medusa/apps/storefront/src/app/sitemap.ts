import type { MetadataRoute } from "next"
import { listRegions } from "@lib/data/regions"
import { listProducts } from "@lib/data/products"
import { listCollections } from "@lib/data/collections"
import { listCategories } from "@lib/data/categories"
import { getBaseURL } from "@lib/util/env"

const DEFAULT_REGION = process.env.NEXT_PUBLIC_DEFAULT_REGION || "fr"

const STATIC_PATHS = [
  "",
  "/store",
  "/contact",
  "/mentions-legales",
  "/cgv",
  "/confidentialite",
  "/politique-cookies",
]

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = getBaseURL()

  const regions = await listRegions().catch(() => [])
  const countryCodes = (regions || [])
    .flatMap((region) => region.countries?.map((c) => c.iso_2))
    .filter((code): code is string => Boolean(code))

  if (countryCodes.length === 0) {
    return STATIC_PATHS.map((path) => ({
      url: `${baseUrl}/${DEFAULT_REGION}${path}`,
    }))
  }

  const entries: MetadataRoute.Sitemap = []

  for (const path of STATIC_PATHS) {
    entries.push({ url: `${baseUrl}/${DEFAULT_REGION}${path}` })
  }

  const [collections, categories] = await Promise.all([
    listCollections({ fields: "handle" }).then((r) => r.collections),
    listCategories({ fields: "handle" }),
  ])

  for (const countryCode of countryCodes) {
    for (const collection of collections || []) {
      entries.push({
        url: `${baseUrl}/${countryCode}/collections/${collection.handle}`,
      })
    }

    for (const category of categories || []) {
      entries.push({
        url: `${baseUrl}/${countryCode}/categories/${category.handle}`,
      })
    }

    const { response } = await listProducts({
      countryCode,
      queryParams: { limit: 200, fields: "handle,updated_at" },
    }).catch(() => ({ response: { products: [], count: 0 } }))

    for (const product of response.products) {
      entries.push({
        url: `${baseUrl}/${countryCode}/products/${product.handle}`,
        lastModified: product.updated_at
          ? new Date(product.updated_at)
          : undefined,
      })
    }
  }

  return entries
}
