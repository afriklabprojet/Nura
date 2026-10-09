import {
	revalidateTag as nextRevalidateTag,
	updateTag as nextUpdateTag,
} from "next/cache"

export const revalidateTag = (tag: string) => nextRevalidateTag(tag, "max")

export const updateTag = (tag: string) => {
	if (tag) {
		nextUpdateTag(tag)
	}
}
