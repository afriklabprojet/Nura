import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { CONTENT_MODULE } from "../../../modules/content"
import type ContentModuleService from "../../../modules/content/service"
import { createPostWorkflow, PostInput } from "../../../workflows/manage-post"

export async function GET(req: MedusaRequest, res: MedusaResponse) {
  const service: ContentModuleService = req.scope.resolve(CONTENT_MODULE)

  const status = req.query.status as string | undefined

  const posts = await service.listPosts(status ? { status } : {}, {
    order: { created_at: "DESC" },
  })

  return res.status(200).json({ posts })
}

export async function POST(
  req: MedusaRequest<PostInput>,
  res: MedusaResponse
) {
  const { result } = await createPostWorkflow(req.scope).run({
    input: req.body,
  })

  return res.status(200).json({ post: result })
}
