import { findCategoryImage, getCategoryImage } from "@lib/constants"
import { listProducts } from "@lib/data/products"
import { HttpTypes } from "@medusajs/types"
import Image from "next/image"
import LocalizedClientLink from "@modules/common/components/localized-client-link"

type Tile = {
  id: string
  name: string
  href: string
  image: string
}

const CategoriesSection = async ({
  categories,
  region,
}: {
  categories: HttpTypes.StoreProductCategory[]
  region: HttpTypes.StoreRegion
}) => {
  const topLevel = categories.filter((category) => !category.parent_category)

  const categoryTiles: Tile[] = await Promise.all(
    topLevel.map(async (category) => {
      const { response } = await listProducts({
        regionId: region.id,
        queryParams: {
          category_id: [category.id],
          limit: 1,
          fields: "thumbnail",
        },
      })

      return {
        id: category.id,
        name: category.name,
        href: `/categories/${category.handle}`,
        // The curated artwork wins over a packshot so the tiles don't repeat
        // the product rows further down the page.
        image:
          findCategoryImage(category.handle) ||
          response.products?.[0]?.thumbnail ||
          getCategoryImage(category.handle),
      }
    })
  )

  const tiles: Tile[] = [
    ...categoryTiles,
    {
      id: "collections",
      name: "Collections",
      href: "/collections",
      image: "/images/category-collections.jpg",
    },
  ]

  return (
    <section className="content-container section-y">
      <div className="mb-10 flex flex-col gap-4 small:mb-14 small:flex-row small:items-end small:justify-between">
        <div className="flex flex-col gap-3">
          <span className="eyebrow">Nos univers</span>
          <h2 className="font-serif text-4xl text-brown small:text-5xl">
            Découvrir par catégorie
          </h2>
        </div>
        <LocalizedClientLink
          href="/store"
          className="link-underline self-start text-[11px] uppercase tracking-[0.2em] text-brown/70 hover:text-brown"
        >
          Voir toute la boutique
        </LocalizedClientLink>
      </div>

      <ul className="grid grid-cols-1 gap-5 xsmall:grid-cols-2 small:grid-cols-4 small:gap-6">
        {tiles.map((tile) => (
          <li key={tile.id}>
            <LocalizedClientLink href={tile.href} className="group flex flex-col gap-5">
              <div className="relative aspect-[4/5] w-full overflow-hidden bg-nude/30">
                <Image
                  src={tile.image}
                  alt={tile.name}
                  fill
                  sizes="(max-width: 512px) 100vw, (max-width: 900px) 50vw, 25vw"
                  className="object-cover object-center transition-transform duration-[900ms] ease-out group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-ink/40 via-transparent to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
              </div>
              <div className="flex items-baseline justify-between">
                <span className="font-serif text-2xl text-brown">
                  {tile.name}
                </span>
                <span className="text-[11px] uppercase tracking-[0.2em] text-gold">
                  Découvrir
                </span>
              </div>
            </LocalizedClientLink>
          </li>
        ))}
      </ul>
    </section>
  )
}

export default CategoriesSection
