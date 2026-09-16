import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { CONTENT_MODULE } from "../../../modules/content"
import type ContentModuleService from "../../../modules/content/service"
import {
  saveHomeBlockWorkflow,
  SaveHomeBlockInput,
} from "../../../workflows/save-home-block"

export async function GET(req: MedusaRequest, res: MedusaResponse) {
  const service: ContentModuleService = req.scope.resolve(CONTENT_MODULE)
  const blocks = await service.listHomeBlocks({}, { order: { key: "ASC" } })

  return res.status(200).json({ blocks })
}

export async function POST(
  req: MedusaRequest<SaveHomeBlockInput>,
  res: MedusaResponse
) {
  const { result } = await saveHomeBlockWorkflow(req.scope).run({
    input: req.body,
  })

  return res.status(200).json({ block: result })
}
