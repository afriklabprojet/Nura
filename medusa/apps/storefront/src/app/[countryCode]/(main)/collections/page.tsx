import { Metadata } from "next"
import Image from "next/image"

import { listCollections } from "@lib/data/collections"
import { getHomeContent } from "@lib/data/home-content"
import { listProducts } from "@lib/data/products"
import { getRegion } from "@lib/data/regions"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import { clx } from "@modules/common/components/ui"

export const metadata: Metadata = {
  title: "Collections",
  description:
    "Les collections Nura : des ensembles de parfums et de soins pensés pour se répondre.",
}

const FALLBACK_IMAGE = "/images/category-collections.webp"

export default async function CollectionsPage(props: {
  params: Promise<{ countryCode: string }>
}) {
  const { countryCode } = await props.params
  const region = await getRegion(countryCode)
  const { collections } = await listCollections({ fields: "*products" })
  const { blocks } = await getHomeContent()
  const collectionsPage = blocks.collections_page

  const tiles = await Promise.all(
    collections.map(async (collection) => {
      if (!region) {
        return { collection, image: FALLBACK_IMAGE, count: 0 }
      }

      const { response } = await listProducts({
        regionId: region.id,
        queryParams: {
          collection_id: [collection.id],
          limit: 1,
          fields: "thumbnail",
        },
      })

      return {
        collection,
        image: response.products?.[0]?.thumbnail || FALLBACK_IMAGE,
        count: collection.products?.length ?? 0,
      }
    })
  )

  return (
    <div className="content-container section-y">
      <div className="mx-auto mb-12 flex max-w-xl flex-col items-center gap-4 text-center small:mb-16">
        <span className="eyebrow">
          {collectionsPage?.eyebrow || "Nos collections"}
        </span>
        <h1 className="font-serif text-4xl text-brown small:text-6xl">
          {collectionsPage?.title || "Collections"}
        </h1>
        <p className="text-sm leading-relaxed text-ui-fg-subtle">
          {collectionsPage?.text ||
            "Des ensembles pensés pour se répondre : un parfum, un soin, un geste."}
        </p>
      </div>

      {tiles.length === 0 ? (
        <p className="py-12 text-center text-sm text-ui-fg-subtle">
          {collectionsPage?.empty_state ||
            "Nos collections arrivent très bientôt."}
        </p>
      ) : (
        <ul
          className={clx("grid gap-6 small:gap-8", {
            "mx-auto max-w-2xl grid-cols-1": tiles.length === 1,
            "grid-cols-1 xsmall:grid-cols-2": tiles.length > 1,
          })}
        >
          {tiles.map(({ collection, image, count }) => (
            <li key={collection.id}>
              <LocalizedClientLink
                href={`/collections/${collection.handle}`}
                className="group flex flex-col gap-5"
              >
                <div className="relative aspect-[3/2] w-full overflow-hidden bg-nude/30">
                  <Image
                    src={image}
                    alt={collection.title}
                    fill
                    sizes="(max-width: 512px) 100vw, 50vw"
                    className="object-cover object-center transition-transform duration-900 ease-out group-hover:scale-105"
                  />
                </div>
                <div className="flex items-baseline justify-between">
                  <h2 className="font-serif text-2xl text-brown">
                    {collection.title}
                  </h2>
                  <span className="text-[11px] uppercase tracking-[0.2em] text-gold">
                    {count > 0 ? `${count} produits` : "Découvrir"}
                  </span>
                </div>
              </LocalizedClientLink>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
