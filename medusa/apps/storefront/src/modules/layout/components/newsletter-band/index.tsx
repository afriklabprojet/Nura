import { Heading, Text } from "@modules/common/components/ui"
import NewsletterForm from "@modules/layout/components/newsletter-form"

const NewsletterBand = () => {
  return (
    <section className="border-t border-ui-border-base bg-bg-alt">
      <div className="content-container flex flex-col items-center gap-6 py-20 small:py-28 text-center">
        <Heading level="h2" className="text-3xl small:text-5xl">
          {"Restez dans l'aura"}
        </Heading>
        <Text className="txt-medium max-w-md text-ui-fg-subtle">
          Soyez la première à découvrir nos nouveautés, soins et parfums.
        </Text>
        <div className="w-full max-w-sm">
          <NewsletterForm />
        </div>
      </div>
    </section>
  )
}

export default NewsletterBand
