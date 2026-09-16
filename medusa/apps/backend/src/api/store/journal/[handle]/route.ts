import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { MedusaError } from "@medusajs/framework/utils"
import { CONTENT_MODULE } from "../../../../modules/content"
import type ContentModuleService from "../../../../modules/content/service"

export async function GET(req: MedusaRequest, res: MedusaResponse) {
  const service: ContentModuleService = req.scope.resolve(CONTENT_MODULE)

  const [post] = await service.listPosts({
    handle: req.params.handle,
    status: "published",
  })

  if (!post) {
    throw new MedusaError(MedusaError.Types.NOT_FOUND, "Article introuvable.")
  }

  const others = await service.listPosts(
    { status: "published" },
    { order: { published_at: "DESC" } }
  )

  return res.status(200).json({
    post,
    related: others.filter((other) => other.id !== post.id).slice(0, 3),
  })
}
