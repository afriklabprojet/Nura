/** Thin wrapper around the admin API — same-origin, session cookie auth. */
export const adminFetch = async <T>(
  path: string,
  init?: RequestInit
): Promise<T> => {
  const res = await fetch(path, {
    credentials: "include",
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...(init?.headers || {}),
    },
  })

  if (!res.ok) {
    const body = await res.json().catch(() => null)
    throw new Error(body?.message || "La requête a échoué.")
  }

  return res.json() as Promise<T>
}

/**
 * Uploads a file through the admin uploads endpoint and returns its public
 * URL, so editors can pick an image instead of pasting a link.
 */
export const uploadImage = async (file: File): Promise<string> => {
  const body = new FormData()
  body.append("files", file)

  const res = await fetch("/admin/uploads", {
    method: "POST",
    credentials: "include",
    body,
  })

  if (!res.ok) {
    const error = await res.json().catch(() => null)
    throw new Error(error?.message || "L'envoi de l'image a échoué.")
  }

  const json = await res.json()
  const url = json?.files?.[0]?.url || json?.uploads?.[0]?.url

  if (!url) {
    throw new Error("Le serveur n'a pas renvoyé d'URL pour cette image.")
  }

  return url as string
}
