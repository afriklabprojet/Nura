import { listLatestReviews } from "@lib/data/reviews"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import Reveal from "@modules/common/components/reveal"
import StarRating from "@modules/products/components/star-rating"

export default async function HomeReviews() {
  const reviews = await listLatestReviews(6)

  if (reviews.length === 0) {
    return null
  }

  return (
    <section className="border-t border-nude bg-bg">
      <div className="content-container section-y">
        <Reveal className="mb-10 flex flex-col items-center gap-3 text-center small:mb-14">
          <span className="eyebrow">Avis clients</span>
          <h2 className="font-serif text-4xl text-brown small:text-5xl">
            Ils parlent de Nura
          </h2>
        </Reveal>

        {/* One testimonial at a time on a phone, three across on desktop. */}
        <ul className="no-scrollbar -mx-5 flex snap-x snap-mandatory gap-5 overflow-x-auto px-5 small:mx-0 small:grid small:grid-cols-3 small:gap-10 small:overflow-visible small:px-0">
          {reviews.map((review) => (
            <li
              key={review.id}
              className="flex w-[85%] flex-none snap-center flex-col gap-4 border-t border-nude pt-6 small:w-auto"
            >
              <StarRating value={review.rating} size="small" />
              {review.title && (
                <span className="font-serif text-xl text-brown">
                  {review.title}
                </span>
              )}
              <p className="font-serif text-lg leading-relaxed text-brown/80">
                « {review.content} »
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
