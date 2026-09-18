import { CartMessagesBlock } from "@lib/data/home-content"
import LocalizedClientLink from "@modules/common/components/localized-client-link"

const EmptyCartMessage = ({ block }: { block?: CartMessagesBlock }) => {
  return (
    <div
      className="flex flex-col items-center gap-5 py-28 text-center"
      data-testid="empty-cart-message"
    >
      <span className="eyebrow">Votre panier</span>
      <h1 className="font-serif text-4xl text-brown small:text-5xl">
        {block?.empty_title || "Votre panier est vide"}
      </h1>
      <p className="max-w-md text-sm leading-relaxed text-ui-fg-subtle">
        {block?.empty_text ||
          "Parfums, soins et coffrets vous attendent — laissez-vous porter par votre aura."}
      </p>
      <LocalizedClientLink
        href={block?.empty_cta_href || "/store"}
        className="mt-2 inline-flex h-12 items-center justify-center bg-brown px-8 text-[11px] uppercase tracking-[0.2em] text-bg-alt transition-colors hover:bg-ink"
      >
        {block?.empty_cta_label || "Découvrir la collection"}
      </LocalizedClientLink>
    </div>
  )
}

export default EmptyCartMessage
