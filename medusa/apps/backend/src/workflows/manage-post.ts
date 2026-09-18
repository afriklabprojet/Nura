import {
  createStep,
  createWorkflow,
  StepResponse,
  WorkflowResponse,
} from "@medusajs/framework/workflows-sdk"
import { MedusaError } from "@medusajs/framework/utils"
import { emitEventStep } from "@medusajs/medusa/core-flows"
import { CONTENT_MODULE } from "../modules/content"
import type ContentModuleService from "../modules/content/service"
import { slugify } from "../lib/content"

/** Fired whenever the Journal changes, so the storefront can drop its cache. */
export const JOURNAL_CHANGED_EVENT = "content.journal.changed"

export type PostInput = {
  title: string
  handle?: string | null
  excerpt?: string | null
  content: string
  cover_image?: string | null
  author?: string | null
  seo_title?: string | null
  seo_description?: string | null
  status?: "draft" | "published"
}

const normalise = async (
  service: ContentModuleService,
  input: PostInput,
  currentId?: string
) => {
  const title = input.title?.trim()

  if (!title) {
    throw new MedusaError(MedusaError.Types.INVALID_DATA, "Le titre est requis.")
  }

  if (!input.content?.trim()) {
    throw new MedusaError(MedusaError.Types.INVALID_DATA, "Le contenu est requis.")
  }

  if (
    title.length > 200 ||
    input.content.length > 100_000 ||
    (input.excerpt?.length ?? 0) > 500 ||
    (input.author?.length ?? 0) > 100 ||
    (input.seo_title?.length ?? 0) > 200 ||
    (input.seo_description?.length ?? 0) > 500
  ) {
    throw new MedusaError(
      MedusaError.Types.INVALID_DATA,
      "Un ou plusieurs champs dépassent la longueur autorisée."
    )
  }

  const handle = slugify(input.handle?.trim() || title)

  if (!handle) {
    throw new MedusaError(
      MedusaError.Types.INVALID_DATA,
      "Impossible de générer une URL à partir de ce titre."
    )
  }

  const clash = await service.listPosts({ handle })

  if (clash.some((post) => post.id !== currentId)) {
    throw new MedusaError(
      MedusaError.Types.INVALID_DATA,
      `L'URL « ${handle} » est déjà utilisée par un autre article.`
    )
  }

  const status: "draft" | "published" =
    input.status === "published" ? "published" : "draft"

  return {
    title,
    handle,
    excerpt: input.excerpt?.trim() || null,
    content: input.content,
    cover_image: input.cover_image?.trim() || null,
    author: input.author?.trim() || null,
    seo_title: input.seo_title?.trim() || null,
    seo_description: input.seo_description?.trim() || null,
    status,
  }
}

const createPostStep = createStep(
  "create-post",
  async (input: PostInput, { container }) => {
    const service: ContentModuleService = container.resolve(CONTENT_MODULE)
    const data = await normalise(service, input)

    const post = await service.createPosts({
      ...data,
      published_at: data.status === "published" ? new Date() : null,
    })

    return new StepResponse(post, post.id)
  },
  async (postId, { container }) => {
    if (!postId) {
      return
    }
    const service: ContentModuleService = container.resolve(CONTENT_MODULE)
    await service.deletePosts([postId])
  }
)

export const createPostWorkflow = createWorkflow(
  "create-post",
  (input: PostInput) => {
    const post = createPostStep(input)
    emitEventStep({ eventName: JOURNAL_CHANGED_EVENT, data: {} })
    return new WorkflowResponse(post)
  }
)

export type UpdatePostInput = PostInput & { id: string }

const updatePostStep = createStep(
  "update-post",
  async (input: UpdatePostInput, { container }) => {
    const service: ContentModuleService = container.resolve(CONTENT_MODULE)
    const [existing] = await service.listPosts({ id: input.id })

    if (!existing) {
      throw new MedusaError(MedusaError.Types.NOT_FOUND, "Article introuvable.")
    }

    const data = await normalise(service, input, input.id)

    // Stamp the publication date the first time it goes live, and keep it
    // afterwards so an edit never changes the article's date.
    const publishedAt =
      data.status === "published"
        ? existing.published_at ?? new Date()
        : null

    const post = await service.updatePosts({
      id: input.id,
      ...data,
      published_at: publishedAt,
    })

    return new StepResponse(post, existing)
  },
  async (previous, { container }) => {
    if (!previous) {
      return
    }
    const service: ContentModuleService = container.resolve(CONTENT_MODULE)
    await service.updatePosts({
      id: previous.id,
      title: previous.title,
      handle: previous.handle,
      excerpt: previous.excerpt,
      content: previous.content,
      cover_image: previous.cover_image,
      author: previous.author,
      seo_title: previous.seo_title,
      seo_description: previous.seo_description,
      status: previous.status,
      published_at: previous.published_at,
    })
  }
)

export const updatePostWorkflow = createWorkflow(
  "update-post",
  (input: UpdatePostInput) => {
    const post = updatePostStep(input)
    emitEventStep({ eventName: JOURNAL_CHANGED_EVENT, data: {} })
    return new WorkflowResponse(post)
  }
)

const deletePostStep = createStep(
  "delete-post",
  async (input: { id: string }, { container }) => {
    const service: ContentModuleService = container.resolve(CONTENT_MODULE)
    await service.deletePosts([input.id])
    return new StepResponse({ id: input.id })
  }
)

export const deletePostWorkflow = createWorkflow(
  "delete-post",
  (input: { id: string }) => {
    const deleted = deletePostStep(input)
    emitEventStep({ eventName: JOURNAL_CHANGED_EVENT, data: {} })
    return new WorkflowResponse(deleted)
  }
)
