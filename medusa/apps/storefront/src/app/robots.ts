import type { MetadataRoute } from "next"
import { getBaseURL } from "@lib/util/env"

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: [
        "/*/account",
        "/*/cart",
        "/*/checkout",
        "/*/order/",
        "/*/mot-de-passe-oublie",
        "/*/reinitialiser-mot-de-passe",
        "/*/verify-account",
        "/api/",
      ],
    },
    sitemap: `${getBaseURL()}/sitemap.xml`,
  }
}
