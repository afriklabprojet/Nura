import { Metadata } from "next"
import { notFound } from "next/navigation"
import { listProducts } from "@lib/data/products"
import { listProductReviews } from "@lib/data/reviews"
import { getRegion, listRegions } from "@lib/data/regions"
import { getBaseURL } from "@lib/util/env"
import ProductTemplate from "@modules/products/templates"
import { HttpTypes } from "@medusajs/types"
import { getLocalizedAlternates } from "@lib/util/seo"

type Props = {
  params: Promise<{ countryCode: string; handle: string }>
  searchParams: Promise<{ v_id?: string }>
}

export const dynamic = "force-dynamic"

function getImagesForVariant(
  product: HttpTypes.StoreProduct,
  selectedVariantId?: string
) {
  if (!selectedVariantId || !product.variants) {
    return product.images
  }

  const variant = product.variants!.find((v) => v.id === selectedVariantId)
  if (!variant || !variant.images?.length) {
    return product.images
  }

  const imageIdsMap = new Map(variant.images!.map((i) => [i.id, true]))
  return product.images?.filter((i) => imageIdsMap.has(i.id)) ?? null
}

export async function generateMetadata(props: Props): Promise<Metadata> {
  const params = await props.params
  const { handle } = params
  const region = await getRegion(params.countryCode)

  if (!region) {
    notFound()
  }

  const product = await listProducts({
    countryCode: params.countryCode,
    queryParams: { handle },
  }).then(({ response }) => response.products[0])

  if (!product) {
    notFound()
  }

  const description = product.description || product.title
  const countries = await listRegions().then((regions) =>
    regions
      .flatMap((item) => item.countries?.map((country) => country.iso_2))
      .filter((code): code is string => Boolean(code))
  )

  return {
    title: product.title,
    description,
    alternates: getLocalizedAlternates(
      countries,
      params.countryCode,
      `/products/${handle}`
    ),
    openGraph: {
      title: product.title,
      description,
      images: product.thumbnail ? [product.thumbnail] : [],
    },
  }
}

function ProductJsonLd({
  product,
  countryCode,
  reviews,
}: {
  product: HttpTypes.StoreProduct
  countryCode: string
  reviews: Awaited<ReturnType<typeof listProductReviews>>
}) {
  const url = `${getBaseURL()}/${countryCode}/products/${product.handle}`
  const variantsWithPrice = (product.variants || []).filter(
    (v) => v.calculated_price?.calculated_amount != null
  )
  const currencyCode = variantsWithPrice[0]?.calculated_price?.currency_code
  const prices = variantsWithPrice.map(
    (v) => v.calculated_price!.calculated_amount!
  )
  const isAvailable = variantsWithPrice.some(
    (variant) =>
      !variant.manage_inventory ||
      variant.allow_backorder ||
      (variant.inventory_quantity ?? 0) > 0
  )

  const jsonLd: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.title,
    description: product.description || product.title,
    image: product.images?.map((i) => i.url) || product.thumbnail || [],
    url,
    ...(variantsWithPrice[0]?.sku ? { sku: variantsWithPrice[0].sku } : {}),
    brand: { "@type": "Brand", name: "Nura" },
    ...(currencyCode && prices.length > 0
      ? {
          offers: {
            "@type": prices.length > 1 ? "AggregateOffer" : "Offer",
            url,
            priceCurrency: currencyCode.toUpperCase(),
            ...(prices.length > 1
              ? { lowPrice: Math.min(...prices), highPrice: Math.max(...prices) }
              : { price: prices[0] }),
            availability:
              isAvailable
                ? "https://schema.org/InStock"
                : "https://schema.org/OutOfStock",
          },
        }
      : {}),
    ...(reviews.count > 0
      ? {
          aggregateRating: {
            "@type": "AggregateRating",
            ratingValue: reviews.average_rating,
            reviewCount: reviews.count,
          },
        }
      : {}),
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  )
}

export default async function ProductPage(props: Props) {
  const params = await props.params
  const region = await getRegion(params.countryCode)
  const searchParams = await props.searchParams

  const selectedVariantId = searchParams.v_id

  if (!region) {
    notFound()
  }

  const pricedProduct = await listProducts({
    countryCode: params.countryCode,
    queryParams: { handle: params.handle },
  }).then(({ response }) => response.products[0])

  if (!pricedProduct) {
    notFound()
  }

  const images = getImagesForVariant(pricedProduct, selectedVariantId)
  const reviews = await listProductReviews(pricedProduct.id)

  return (
    <>
      <ProductJsonLd
        product={pricedProduct}
        countryCode={params.countryCode}
        reviews={reviews}
      />
      <ProductTemplate
        product={pricedProduct}
        region={region}
        countryCode={params.countryCode}
        images={images ?? []}
      />
    </>
  )
}
