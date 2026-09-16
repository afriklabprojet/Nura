import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { CONTENT_MODULE } from "../../../modules/content"
import type ContentModuleService from "../../../modules/content/service"
import { isBlockLive } from "../../../lib/content"

/**
 * The live home page configuration. Blocks that are switched off, or outside
 * their scheduling window, are simply absent — the storefront then falls back
 * to its built-in defaults.
 */
export async function GET(req: MedusaRequest, res: MedusaResponse) {
  const service: ContentModuleService = req.scope.resolve(CONTENT_MODULE)
  const blocks = await service.listHomeBlocks({})

  const byKey: Record<string, unknown> = {}
  const hidden: string[] = []

  blocks.forEach((block) => {
    if (isBlockLive(block)) {
      byKey[block.key] = block.data
    } else {
      // Configured but switched off (or outside its dates): the storefront
      // needs to tell this apart from "never configured", where it shows its
      // own defaults.
      hidden.push(block.key)
    }
  })

  return res.status(200).json({ blocks: byKey, hidden })
}
