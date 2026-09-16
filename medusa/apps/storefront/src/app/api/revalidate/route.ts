import { revalidateTag } from "next/cache"
import { NextRequest, NextResponse } from "next/server"

import { CONTENT_CACHE_TAGS } from "@lib/util/cache-tags"

/**
 * Called by the backend when editorial content changes, so an edit made in
 * the admin shows on the shop straight away. Only the content tags can be
 * revalidated, and only with the shared secret.
 */
export async function POST(request: NextRequest) {
  const secret = process.env.REVALIDATE_SECRET

  if (!secret) {
    return NextResponse.json(
      { message: "Revalidation is not configured." },
      { status: 501 }
    )
  }

  if (request.headers.get("x-revalidate-secret") !== secret) {
    return NextResponse.json({ message: "Unauthorized." }, { status: 401 })
  }

  const body = await request.json().catch(() => null)
  const requested: unknown = body?.tags

  if (!Array.isArray(requested)) {
    return NextResponse.json(
      { message: "Expected a `tags` array." },
      { status: 400 }
    )
  }

  const tags = requested.filter((tag): tag is string =>
    CONTENT_CACHE_TAGS.includes(tag as (typeof CONTENT_CACHE_TAGS)[number])
  )

  tags.forEach((tag) => revalidateTag(tag))

  return NextResponse.json({ revalidated: tags })
}
