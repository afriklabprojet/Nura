import crypto from "node:crypto"

// Human-friendly, hard-to-guess code: NURA-XXXX-XXXX (uppercase alphanumeric,
// excludes 0/O/1/I to avoid transcription mistakes when read aloud or typed
// from a printed card).
const ALPHABET = "23456789ABCDEFGHJKLMNPQRSTUVWXYZ"

export function generatePromoCode() {
  const group = () =>
    Array.from({ length: 4 }, () => ALPHABET[crypto.randomInt(ALPHABET.length)]).join("")
  return `NURA-${group()}-${group()}`
}
