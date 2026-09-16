import { Metadata } from "next"
import Image from "next/image"
import { notFound } from "next/navigation"

import { getPost, listPosts } from "@lib/data/journal"
import { listRegions } from "@lib/data/regions"
import { getBaseURL } from "@lib/util/env"
import Breadcrumbs from "@modules/common/components/breadcrumbs"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import PostBody from "@modules/journal/components/post-body"

type Props = {
  params: Promise<{ countryCode: string; handle: string }>
}

const formatDate = (value: string | null) =>
  value
    ? new Date(value).toLocaleDateString("fr-FR", {
        day: "numeric",
        month: "long",
        year: "numeric",
      })
    : null

export async function generateStaticParams() {
  try {
    const [regions, { posts }] = await Promise.all([
      listRegions(),
      listPosts(100),
    ])

    const countryCodes = regions
      .flatMap((region) => region.countries?.map((country) => country.iso_2))
      .filter((code): code is string => Boolean(code))

    return countryCodes.flatMap((countryCode) =>
      posts.map((post) => ({ countryCode, handle: post.handle }))
    )
  } catch {
    return []
  }
}

export async function generateMetadata(props: Props): Promise<Metadata> {
  const { handle } = await props.params
  const data = await getPost(handle)

  if (!data) {
    return { title: "Article introuvable" }
  }

  const { post } = data
  const description =
    post.seo_description || post.excerpt || `${post.title} — Journal Nura`

  return {
    title: post.seo_title || post.title,
    description,
    openGraph: {
      type: "article",
      title: post.seo_title || post.title,
      description,
      images: post.cover_image ? [post.cover_image] : undefined,
      publishedTime: post.published_at ?? undefined,
    },
  }
}

export default async function JournalPostPage(props: Props) {
  const { countryCode, handle } = await props.params
  const data = await getPost(handle)

  if (!data) {
    notFound()
  }

  const { post, related } = data
  const url = `${getBaseURL()}/${countryCode}/journal/${post.handle}`

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    description: post.seo_description || post.excerpt || post.title,
    image: post.cover_image ? [post.cover_image] : undefined,
    datePublished: post.published_at ?? undefined,
    author: { "@type": "Organization", name: post.author || "Nura" },
    publisher: { "@type": "Organization", name: "Nura" },
    mainEntityOfPage: url,
  }

  return (
    <>
      <script
        type="application/ld+json"
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <article className="content-container py-10 small:py-16">
        <div className="mb-8">
          <Breadcrumbs
            countryCode={countryCode}
            crumbs={[
              { label: "Journal", href: "/journal" },
              { label: post.title },
            ]}
          />
        </div>

        <header className="mx-auto mb-10 flex max-w-2xl flex-col items-center gap-4 text-center">
          {post.published_at && (
            <span className="text-[11px] uppercase tracking-[0.2em] text-ui-fg-muted">
              {formatDate(post.published_at)}
            </span>
          )}
          <h1 className="font-serif text-4xl leading-tight text-brown small:text-5xl">
            {post.title}
          </h1>
          {post.excerpt && (
            <p className="text-base leading-relaxed text-ui-fg-subtle">
              {post.excerpt}
            </p>
          )}
          {post.author && (
            <span className="text-[11px] uppercase tracking-[0.2em] text-gold">
              {post.author}
            </span>
          )}
        </header>

        {post.cover_image && (
          <div className="relative mb-12 aspect-[3/2] w-full overflow-hidden">
            <Image
              src={post.cover_image}
              alt={post.title}
              fill
              priority
              sizes="100vw"
              className="object-cover object-center"
            />
          </div>
        )}

        <div className="mx-auto max-w-2xl">
          <PostBody content={post.content} />
        </div>
      </article>

      {related.length > 0 && (
        <section className="border-t border-nude bg-bg-alt">
          <div className="content-container section-y">
            <h2 className="mb-10 text-center font-serif text-3xl text-brown">
              À lire aussi
            </h2>
            <ul className="grid grid-cols-1 gap-8 xsmall:grid-cols-3">
              {related.map((other) => (
                <li key={other.id}>
                  <LocalizedClientLink
                    href={`/journal/${other.handle}`}
                    className="group flex flex-col gap-3"
                  >
                    <div className="relative aspect-[3/2] w-full overflow-hidden bg-nude/30">
                      {other.cover_image && (
                        <Image
                          src={other.cover_image}
                          alt={other.title}
                          fill
                          sizes="(max-width: 512px) 100vw, 33vw"
                          className="object-cover object-center transition-transform duration-700 group-hover:scale-105"
                        />
                      )}
                    </div>
                    <span className="font-serif text-xl text-brown">
                      {other.title}
                    </span>
                  </LocalizedClientLink>
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}
    </>
  )
}
