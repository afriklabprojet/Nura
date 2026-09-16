import { listLatestReviews } from "@lib/data/reviews"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import StarRating from "@modules/products/components/star-rating"

export default async function HomeReviews() {
  const reviews = await listLatestReviews(3)

  if (reviews.length === 0) {
    return null
  }

  return (
    <section className="border-t border-nude bg-bg">
      <div className="content-container section-y">
        <div className="mb-10 flex flex-col items-center gap-3 text-center small:mb-14">
          <span className="eyebrow">Elles en parlent</span>
          <h2 className="font-serif text-4xl text-brown small:text-5xl">
            Avis clientes
          </h2>
        </div>

        <ul className="grid grid-cols-1 gap-8 small:grid-cols-3 small:gap-10">
          {reviews.map((review) => (
            <li
              key={review.id}
              className="flex flex-col gap-4 border-t border-nude pt-6"
            >
              <StarRating value={review.rating} size="small" />
              {review.title && (
                <span className="font-serif text-xl text-brown">
                  {review.title}
                </span>
              )}
              <p className="text-sm leading-relaxed text-ui-fg-subtle">
                {review.content}
              </p>
              <div className="mt-auto flex flex-col gap-1 pt-2 text-[11px] uppercase tracking-[0.15em] text-ui-fg-muted">
                <span>
                  {review.customer_name}
                  {review.verified_purchase && " — achat vérifié"}
                </span>
                {review.product && (
                  <LocalizedClientLink
                    href={`/products/${review.product.handle}`}
                    className="text-gold hover:text-brown"
                  >
                    {review.product.title}
                  </LocalizedClientLink>
                )}
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
