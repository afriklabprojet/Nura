"use client"

const CookiePreferencesButton = ({ className = "" }: { className?: string }) => (
  <button
    type="button"
    onClick={() => window.dispatchEvent(new Event("nura:open-cookie-preferences"))}
    className={className}
  >
    Gérer mes cookies
  </button>
)

export default CookiePreferencesButton
