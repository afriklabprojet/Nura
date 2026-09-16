import { Metadata } from "next"

import CategoriesSection from "@modules/home/components/categories"
import Editorial from "@modules/home/components/editorial"
import FeaturedProducts from "@modules/home/components/featured-products"
import Gallery from "@modules/home/components/gallery"
import Hero from "@modules/home/components/hero"
import HomeReviews from "@modules/home/components/reviews"
import RitualBand from "@modules/home/components/ritual-band"
import TrustBand from "@modules/home/components/trust-band"
import { listCategories } from "@lib/data/categories"
import { getRegion } from "@lib/data/regions"

export const metadata: Metadata = {
  title: "Parfumerie & bodycare premium",
  description:
    "Nura imagine des parfums et des soins pensés pour accompagner chaque aura, chaque humeur et chaque moment. Votre aura commence ici.",
}

export default async function Home(props: {
  params: Promise<{ countryCode: string }>
}) {
  const params = await props.params

  const { countryCode } = params

  const region = await getRegion(countryCode)

  const categories = await listCategories()

  return (
    <>
      <Hero />
      <TrustBand />
      {region && <CategoriesSection categories={categories} region={region} />}
      {region && <FeaturedProducts region={region} />}
      <RitualBand />
      <HomeReviews />
      <Editorial />
      <Gallery />
    </>
  )
}
