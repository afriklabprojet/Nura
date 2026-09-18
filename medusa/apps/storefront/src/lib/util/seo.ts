import { getBaseURL } from "./env"

export const getLocalizedAlternates = (
  countryCodes: string[],
  countryCode: string,
  path: string
) => {
  const baseUrl = getBaseURL()
  const codes = Array.from(new Set([countryCode, ...countryCodes].filter(Boolean)))

  return {
    canonical: `${baseUrl}/${countryCode}${path}`,
    languages: Object.fromEntries(
      codes.map((code) => [code, `${baseUrl}/${code}${path}`])
    ),
  }
}