import { listMyReviews, listProductReviews } from "@lib/data/reviews"
import { retrieveCustomer } from "@lib/data/customer"
import { Heading, Text } from "@modules/common/components/ui"
import StarRating from "../star-rating"
import ReviewForm from "./review-form"

const ProductReviews = async ({ productId }: { productId: string }) => {
  const [{ reviews, average_rating, count, breakdown }, customer] =
    await Promise.all([
      listProductReviews(productId),
      retrieveCustomer().catch(() => null),
    ])

  const myReviews = customer ? await listMyReviews() : []
  const hasReviewed = myReviews.some((r) => r.product_id === productId)

  return (
    <div className="flex flex-col gap-y-8 max-w-3xl">
      <div className="flex items-center gap-x-4">
        <Heading level="h2">Avis clients</Heading>
        {count > 0 && (
          <div className="flex items-center gap-x-2">
            <StarRating value={Math.round(average_rating)} size="small" />
            <Text className="text-ui-fg-subtle">
              {average_rating.toFixed(1)} / 5 ({count} avis)
            </Text>
          </div>
        )}
      </div>

      {count > 0 && (
        <div className="flex flex-col gap-y-1 max-w-xs">
          {breakdown.map(({ stars, count: starCount }) => (
            <div key={stars} className="flex items-center gap-x-2 text-sm">
              <span className="w-12 text-ui-fg-subtle">{stars} ★</span>
              <div className="flex-1 h-1.5 bg-nude rounded-full overflow-hidden">
                <div
                  className="h-full bg-brown"
                  style={{
                    width: count ? `${(starCount / count) * 100}%` : "0%",
                  }}
                />
              </div>
              <span className="w-6 text-right text-ui-fg-subtle">
                {starCount}
              </span>
            </div>
          ))}
        </div>
      )}

      {count === 0 && (
        <Text className="text-ui-fg-subtle">
          Aucun avis pour ce produit pour le moment.
        </Text>
      )}

      <div className="flex flex-col gap-y-6">
        {reviews.map((review) => (
          <div key={review.id} className="flex flex-col gap-y-1 border-b border-nude pb-6">
            <div className="flex items-center gap-x-3">
              <StarRating value={review.rating} size="small" />
              <Text className="font-semibold">{review.customer_name}</Text>
              {review.verified_purchase && (
                <Text className="text-small-regular text-ui-fg-subtle">
                  · Achat vérifié
                </Text>
              )}
            </div>
            {review.title && (
              <Text className="font-semibold">{review.title}</Text>
            )}
            <Text className="text-ui-fg-subtle">{review.content}</Text>
          </div>
        ))}
      </div>

      {customer && !hasReviewed && (
        <div className="flex flex-col gap-y-4 pt-2">
          <Heading level="h3">Laisser un avis</Heading>
          <ReviewForm productId={productId} />
        </div>
      )}
    </div>
  )
}

export default ProductReviews
