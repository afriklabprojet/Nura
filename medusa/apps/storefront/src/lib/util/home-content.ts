/** Splits the admin's comma-separated product handles into a clean list. */
export const parseHandles = (value?: string) =>
  (value || "")
    .split(",")
    .map((handle) => handle.trim())
    .filter(Boolean)
