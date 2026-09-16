import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { CONTENT_MODULE } from "../../../modules/content"
import type ContentModuleService from "../../../modules/content/service"

const DEFAULT_LIMIT = 12

export async function GET(req: MedusaRequest, res: MedusaResponse) {
  const service: ContentModuleService = req.scope.resolve(CONTENT_MODULE)

  const limit = Math.min(Number(req.query.limit) || DEFAULT_LIMIT, 50)
  const offset = Math.max(Number(req.query.offset) || 0, 0)

  const posts = await service.listPosts(
    { status: "published" },
    { order: { published_at: "DESC" } }
  )

  return res.status(200).json({
    posts: posts.slice(offset, offset + limit),
    count: posts.length,
  })
}
