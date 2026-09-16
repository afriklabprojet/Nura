/**
 * Placeholder product photography (Unsplash, free for commercial use).
 * Every shot was checked to be free of third-party branding — keep that
 * constraint if you swap one out, and replace them all with Nura's own
 * packshots before launch. The storefront reads these straight from the
 * product record, nothing else has to change.
 */
const shot = (id: string, w = 1200, h = 1500) =>
  `https://images.unsplash.com/photo-${id}?w=${w}&h=${h}&fit=crop&crop=entropy&q=75&fm=jpg`

export const PRODUCT_IMAGES: Record<string, string[]> = {
  "eau-de-parfum-aura-doree": [
    shot("1588405748880-12d1d2a59f75"),
    shot("1671493229066-f36e86b35841"),
    shot("1635425886430-6e9d1f8c3ccd"),
  ],
  "eau-de-parfum-nuit-de-nude": [
    shot("1543422655-ac1c6ca993ed"),
    shot("1574670700790-fa314ab37787"),
    shot("1618509682637-e4790939cf96"),
  ],
  "eau-de-parfum-lumiere-nue": [
    shot("1615108395437-df128ad79e80"),
    shot("1671493228689-754b0f200c84"),
    shot("1716827173458-8bde30d6c78f"),
  ],
  "huile-corps-fleur-dambre": [
    shot("1608571423539-e951b9b3871e"),
    shot("1748543668687-624e058c367c"),
    shot("1613876215075-276fd62c89a4"),
  ],
  "baume-corps-nude-velvet": [
    shot("1597931752949-98c74b5b159f"),
    shot("1648203276014-20f97ba1f817"),
  ],
  "coffret-decouverte-nura": [
    shot("1592903297149-37fb25202dfa"),
    shot("1625552186152-668cd2f0b707"),
  ],
  "carte-cadeau-nura": [shot("1699788201352-c700fd34a38c")],
}

export const productMedia = (handle: string) => {
  const urls = PRODUCT_IMAGES[handle]

  if (!urls?.length) {
    return {}
  }

  return {
    thumbnail: urls[0],
    images: urls.map((url) => ({ url })),
  }
}
