import "server-only"
import { getBaseURL } from "@lib/util/env"

const legalValue = (key: string) => {
  const value = process.env[key]?.trim()

  if (!value && process.env.NODE_ENV === "production") {
    throw new Error(`${key} is required for production legal pages`)
  }

  return value || `Configuration requise : ${key}`
}

export const LEGAL_INFORMATION = {
  siteHost: new URL(getBaseURL()).host,
  lastUpdated: legalValue("LEGAL_LAST_UPDATED"),
  businessName: legalValue("LEGAL_BUSINESS_NAME"),
  legalForm: legalValue("LEGAL_FORM"),
  capital: legalValue("LEGAL_CAPITAL"),
  registryCity: legalValue("LEGAL_REGISTRY_CITY"),
  registrationNumber: legalValue("LEGAL_REGISTRATION_NUMBER"),
  vatNumber: legalValue("LEGAL_VAT_NUMBER"),
  address: legalValue("LEGAL_ADDRESS"),
  publicationDirector: legalValue("LEGAL_PUBLICATION_DIRECTOR"),
  hostName: legalValue("LEGAL_HOST_NAME"),
  hostAddress: legalValue("LEGAL_HOST_ADDRESS"),
  hostPhone: legalValue("LEGAL_HOST_PHONE"),
  mediatorName: legalValue("LEGAL_MEDIATOR_NAME"),
  mediatorUrl: legalValue("LEGAL_MEDIATOR_URL"),
} as const
