export type SortOptions = "price_asc" | "price_desc" | "created_at"

export const sortOptions: { value: SortOptions; label: string }[] = [
  {
    value: "created_at",
    label: "Nouveautés",
  },
  {
    value: "price_asc",
    label: "Prix : croissant",
  },
  {
    value: "price_desc",
    label: "Prix : décroissant",
  },
]
