// Shared between the consent banner and the analytics script loader — both
// need to read/write the same stored choice and react to it changing in the
// same tab (a "storage" event only fires in *other* tabs, so a change made
// here also needs a same-tab signal).
export const CONSENT_STORAGE_KEY = "nura_cookie_consent"
export const CONSENT_CHANGE_EVENT = "nura:cookie-consent-changed"

export type CookieConsent = {
  analytics: boolean
}

export const readConsent = (): CookieConsent | null => {
  try {
    const raw = localStorage.getItem(CONSENT_STORAGE_KEY)
    if (!raw) {
      return null
    }
    return JSON.parse(raw) as CookieConsent
  } catch {
    return null
  }
}

export const writeConsent = (consent: CookieConsent) => {
  try {
    localStorage.setItem(CONSENT_STORAGE_KEY, JSON.stringify(consent))
    window.dispatchEvent(new CustomEvent(CONSENT_CHANGE_EVENT, { detail: consent }))
  } catch {
    // localStorage unavailable (private mode, blocked storage) — the
    // banner will just reappear next visit, which is an acceptable
    // degradation rather than a crash.
  }
}
