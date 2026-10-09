import { findCategoryImage, getCategoryImage } from "@lib/constants"
import { CategoriesBlock } from "@lib/data/home-content"
import { listProducts } from "@lib/data/products"
import { HttpTypes } from "@medusajs/types"
import Image from "next/image"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import Reveal from "@modules/common/components/reveal"

// The two doors into the shop, editable from the admin. Anything else the
// catalogue holds stays reachable from the navigation and the store page.
const DEFAULT_DOORS = [
  {
    handle: "parfums",
    title: "Parfums",
    description: "Trouvez le parfum qui vous ressemble.",
  },
  {
    handle: "bodycare",
    title: "Bodycare",
    description: "Des essentiels pour prendre soin de votre peau.",
  },
]

type Tile = {
  id: string
  title: string
  description: string
  href: string
  image: string
}

const CategoriesSection = async ({
  categories,
  region,
  block,
}: {
  categories: HttpTypes.StoreProductCategory[]
  region: HttpTypes.StoreRegion
  block?: CategoriesBlock
}) => {
  const doors = block?.doors?.length ? block.doors : DEFAULT_DOORS

  const categoryTiles: Tile[] = await Promise.all(
    doors.map(async (door) => {
      const category = categories.find((c) => c.handle === door.handle)

      let packshot: string | undefined

      if (category) {
        const { response } = await listProducts({
          regionId: region.id,
          queryParams: {
            category_id: [category.id],
            limit: 1,
            fields: "thumbnail",
          },
        })

        packshot = response.products?.[0]?.thumbnail ?? undefined
      }

      return {
        id: door.handle,
        title: category?.name || door.title,
        description: door.description,
        href: category ? `/categories/${category.handle}` : "/store",
        // The curated artwork wins over a packshot so the tiles don't repeat
        // the product rows further down the page.
        image:
          findCategoryImage(door.handle) ||
          packshot ||
          getCategoryImage(door.handle),
      }
    })
  )

  const tiles: Tile[] = [
    ...categoryTiles,
    {
      id: "collections",
      title: "Collections",
      description: "Découvrez les univers imaginés par Nura.",
      href: "/collections",
      image: "/images/category-collections.webp",
    },
  ]

  return (
    <section className="content-container section-y">
      <ul className="grid grid-cols-1 gap-6 small:grid-cols-3 small:gap-8">
        {tiles.map((tile, index) => (
          <li key={tile.id}>
            <Reveal delay={index * 80}>
              <LocalizedClientLink href={tile.href} className="group flex flex-col gap-5">
                <div className="relative aspect-[3/4] w-full overflow-hidden bg-nude/30">
                  <Image
                    src={tile.image}
                    alt={tile.title}
                    fill
                    sizes="(max-width: 900px) 100vw, 33vw"
                    className="object-cover object-center transition-transform duration-900 ease-out group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-ink/45 via-transparent to-transparent" />
                </div>
                <div className="flex flex-col gap-2">
                  <h2 className="font-serif text-3xl text-brown">
                    {tile.title}
                  </h2>
                  <p className="text-sm leading-relaxed text-ui-fg-subtle">
                    {tile.description}
                  </p>
                  <span className="link-underline mt-1 self-start text-[11px] uppercase tracking-[0.2em] text-gold">
                    Explorer
                  </span>
                </div>
              </LocalizedClientLink>
            </Reveal>
          </li>
        ))}
      </ul>
    </section>
  )
}

export default CategoriesSection
