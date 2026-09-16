import NewsletterForm from "@modules/layout/components/newsletter-form"

const NewsletterBand = () => {
  return (
    <section className="border-t border-nude bg-bg-alt">
      <div className="content-container section-y flex flex-col items-center gap-5 text-center">
        <span className="eyebrow">Newsletter</span>
        <h2 className="font-serif text-3xl text-brown small:text-5xl">
          Entrez dans l&apos;univers Nura.
        </h2>
        <p className="max-w-md text-sm leading-relaxed text-ui-fg-subtle">
          Recevez nos nouveautés, lancements, conseils parfum &amp; bodycare et
          accès exclusifs.
        </p>
        <div className="w-full max-w-sm pt-2">
          <NewsletterForm />
        </div>
      </div>
    </section>
  )
}

export default NewsletterBand
