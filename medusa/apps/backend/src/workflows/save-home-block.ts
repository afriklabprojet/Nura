import {
  createStep,
  createWorkflow,
  StepResponse,
  WorkflowResponse,
} from "@medusajs/framework/workflows-sdk"
import { MedusaError } from "@medusajs/framework/utils"
import { CONTENT_MODULE } from "../modules/content"
import type ContentModuleService from "../modules/content/service"
import { isHomeBlockKey } from "../lib/content"

export type SaveHomeBlockInput = {
  key: string
  data: Record<string, unknown>
  active?: boolean
  rank?: number
  starts_at?: string | null
  ends_at?: string | null
}

const toDate = (value?: string | null) =>
  value ? new Date(value) : null

const saveHomeBlockStep = createStep(
  "save-home-block",
  async (input: SaveHomeBlockInput, { container }) => {
    if (!isHomeBlockKey(input.key)) {
      throw new MedusaError(
        MedusaError.Types.INVALID_DATA,
        `Section inconnue : ${input.key}.`
      )
    }

    const service: ContentModuleService = container.resolve(CONTENT_MODULE)
    const [existing] = await service.listHomeBlocks({ key: input.key })

    const payload = {
      key: input.key,
      data: input.data ?? {},
      active: input.active ?? true,
      rank: input.rank ?? 0,
      starts_at: toDate(input.starts_at),
      ends_at: toDate(input.ends_at),
    }

    if (existing) {
      const block = await service.updateHomeBlocks({
        id: existing.id,
        ...payload,
      })
      return new StepResponse(block, existing)
    }

    const block = await service.createHomeBlocks(payload)
    return new StepResponse(block, null)
  },
  async (previous, { container }) => {
    if (previous === undefined) {
      return
    }

    const service: ContentModuleService = container.resolve(CONTENT_MODULE)

    if (previous === null) {
      return
    }

    await service.updateHomeBlocks({
      id: previous.id,
      key: previous.key,
      data: previous.data,
      active: previous.active,
      rank: previous.rank,
      starts_at: previous.starts_at,
      ends_at: previous.ends_at,
    })
  }
)

export const saveHomeBlockWorkflow = createWorkflow(
  "save-home-block",
  (input: SaveHomeBlockInput) => new WorkflowResponse(saveHomeBlockStep(input))
)
