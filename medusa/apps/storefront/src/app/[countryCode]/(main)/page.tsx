import { Metadata } from "next"

import BestSellers from "@modules/home/components/best-sellers"
import Campaign from "@modules/home/components/campaign"
import CategoriesSection from "@modules/home/components/categories"
import Editorial from "@modules/home/components/editorial"
import FeaturedProducts from "@modules/home/components/featured-products"
import Gallery from "@modules/home/components/gallery"
import Hero from "@modules/home/components/hero"
import HomeReviews from "@modules/home/components/reviews"
import RitualBand from "@modules/home/components/ritual-band"
import { listCategories } from "@lib/data/categories"
import { getHomeContent } from "@lib/data/home-content"
import { getRegion } from "@lib/data/regions"

export const metadata: Metadata = {
  title: {
    absolute: "Nura — Parfums & Bodycare | Votre aura commence ici",
  },
  description:
    "Nura imagine des parfums et des soins premium, entre Paris et Abidjan, pensés pour accompagner chaque aura, chaque humeur et chaque moment.",
}

export default async function Home(props: {
  params: Promise<{ countryCode: string }>
}) {
  const params = await props.params

  const { countryCode } = params

  const [region, categories, { blocks, hidden }] = await Promise.all([
    getRegion(countryCode),
    listCategories(),
    getHomeContent(),
  ])

  return (
    <>
      <Hero block={blocks.hero} />
      {region && (
        <FeaturedProducts
          region={region}
          block={blocks.essentials}
          hidden={hidden.includes("essentials")}
        />
      )}
      <Editorial block={blocks.editorial} />
      {region && (
        <CategoriesSection
          categories={categories}
          region={region}
          block={blocks.categories}
        />
      )}
      {region && (
        <BestSellers
          region={region}
          block={blocks.best_sellers}
          hidden={hidden.includes("best_sellers")}
        />
      )}
      <RitualBand block={blocks.ritual} />
      <Campaign block={blocks.campaign} hidden={hidden.includes("campaign")} />
      <HomeReviews block={blocks.reviews_heading} />
      <Gallery block={blocks.gallery} />
    </>
  )
}
