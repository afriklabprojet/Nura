import crypto from "node:crypto"

// Same alphabet as gift card / promo codes — excludes 0/O/1/I to avoid
// transcription mistakes when read aloud or typed from a printed card.
const ALPHABET = "23456789ABCDEFGHJKLMNPQRSTUVWXYZ"

export function generateReferralCode() {
  const suffix = Array.from(
    { length: 6 },
    () => ALPHABET[crypto.randomInt(ALPHABET.length)]
  ).join("")
  return `NURA-${suffix}`
}
