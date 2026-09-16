// Medusa's built-in country list (`region.countries[].display_name`) is only
// ever in English (e.g. "Germany", "Cote D'Ivoire") — there's no localized
// variant coming from the API. Since this storefront is French, look up the
// French name from the ISO code instead of trusting the backend's label.
const frenchRegionNames = new Intl.DisplayNames(["fr"], { type: "region" })

export const getCountryName = (
  isoCode?: string | null,
  fallback?: string | null
): string => {
  if (!isoCode) {
    return fallback ?? ""
  }

  try {
    return (
      frenchRegionNames.of(isoCode.toUpperCase()) ??
      fallback ??
      isoCode.toUpperCase()
    )
  } catch {
    return fallback ?? isoCode.toUpperCase()
  }
}
