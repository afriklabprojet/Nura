import { revalidateTag as nextRevalidateTag } from "next/cache"

export const revalidateTag = (tag: string) => nextRevalidateTag(tag, "max")
