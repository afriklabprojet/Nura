import { Metadata } from "next"
import Image from "next/image"

import { listPosts } from "@lib/data/journal"
import LocalizedClientLink from "@modules/common/components/localized-client-link"

export const metadata: Metadata = {
  title: "Journal",
  description:
    "Conseils parfum et bodycare, rituels et coulisses de la maison Nura.",
}

const formatDate = (value: string | null) =>
  value
    ? new Date(value).toLocaleDateString("fr-FR", {
        day: "numeric",
        month: "long",
        year: "numeric",
      })
    : null

export default async function JournalPage() {
  const { posts } = await listPosts(24)

  return (
    <div className="content-container section-y">
      <div className="mx-auto mb-12 flex max-w-xl flex-col items-center gap-4 text-center small:mb-16">
        <span className="eyebrow">Journal</span>
        <h1 className="font-serif text-4xl text-brown small:text-6xl">
          Conseils &amp; rituels
        </h1>
        <p className="text-sm leading-relaxed text-ui-fg-subtle">
          Choisir son parfum, prendre soin de sa peau, comprendre nos
          matières : les mots de la maison.
        </p>
      </div>

      {posts.length === 0 ? (
        <p className="py-12 text-center text-sm text-ui-fg-subtle">
          Les premiers articles arrivent bientôt.
        </p>
      ) : (
        <ul className="grid grid-cols-1 gap-10 xsmall:grid-cols-2 small:grid-cols-3 small:gap-x-8 small:gap-y-14">
          {posts.map((post) => (
            <li key={post.id}>
              <LocalizedClientLink
                href={`/journal/${post.handle}`}
                className="group flex flex-col gap-4"
              >
                <div className="relative aspect-[3/2] w-full overflow-hidden bg-nude/30">
                  {post.cover_image ? (
                    <Image
                      src={post.cover_image}
                      alt={post.title}
                      fill
                      sizes="(max-width: 512px) 100vw, (max-width: 900px) 50vw, 33vw"
                      className="object-cover object-center transition-transform duration-700 group-hover:scale-105"
                    />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-[#F3E8DA] via-[#EFE0CE] to-[#E7D3C0]">
                      <span className="select-none font-serif text-5xl leading-none text-brown/30">
                        N
                      </span>
                    </div>
                  )}
                </div>
                <div className="flex flex-col gap-2">
                  {post.published_at && (
                    <span className="text-[11px] uppercase tracking-[0.2em] text-ui-fg-muted">
                      {formatDate(post.published_at)}
                    </span>
                  )}
                  <h2 className="font-serif text-2xl leading-snug text-brown">
                    {post.title}
                  </h2>
                  {post.excerpt && (
                    <p className="text-sm leading-relaxed text-ui-fg-subtle">
                      {post.excerpt}
                    </p>
                  )}
                  <span className="link-underline mt-1 self-start text-[11px] uppercase tracking-[0.2em] text-gold">
                    Lire l&apos;article
                  </span>
                </div>
              </LocalizedClientLink>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
