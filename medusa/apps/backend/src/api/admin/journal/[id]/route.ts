import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { MedusaError } from "@medusajs/framework/utils"
import { CONTENT_MODULE } from "../../../../modules/content"
import type ContentModuleService from "../../../../modules/content/service"
import {
  deletePostWorkflow,
  PostInput,
  updatePostWorkflow,
} from "../../../../workflows/manage-post"

export async function GET(req: MedusaRequest, res: MedusaResponse) {
  const service: ContentModuleService = req.scope.resolve(CONTENT_MODULE)
  const [post] = await service.listPosts({ id: req.params.id })

  if (!post) {
    throw new MedusaError(MedusaError.Types.NOT_FOUND, "Article introuvable.")
  }

  return res.status(200).json({ post })
}

export async function POST(
  req: MedusaRequest<PostInput>,
  res: MedusaResponse
) {
  const { result } = await updatePostWorkflow(req.scope).run({
    input: { ...req.body, id: req.params.id },
  })

  return res.status(200).json({ post: result })
}

export async function DELETE(req: MedusaRequest, res: MedusaResponse) {
  await deletePostWorkflow(req.scope).run({ input: { id: req.params.id } })

  return res.status(200).json({ id: req.params.id, object: "post", deleted: true })
}
