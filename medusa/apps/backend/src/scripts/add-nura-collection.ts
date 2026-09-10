import { MedusaContainer } from "@medusajs/framework"
import { ContainerRegistrationKeys } from "@medusajs/framework/utils"
import {
  createCollectionsWorkflow,
  updateProductsWorkflow,
} from "@medusajs/medusa/core-flows"

const NURA_PRODUCT_HANDLES = [
  "eau-de-parfum-aura-doree",
  "eau-de-parfum-nuit-de-nude",
  "eau-de-parfum-lumiere-nue",
  "huile-corps-fleur-dambre",
  "baume-corps-nude-velvet",
  "coffret-decouverte-nura",
]

export default async function addNuraCollection({
  container,
}: {
  container: MedusaContainer
}) {
  const logger = container.resolve(ContainerRegistrationKeys.LOGGER)

  logger.info("Creating 'Les Essentiels Nura' collection...")
  const { result: collections } = await createCollectionsWorkflow(
    container
  ).run({
    input: {
      collections: [
        { title: "Les Essentiels Nura", handle: "les-essentiels-nura" },
      ],
    },
  })
  const collection = collections[0]

  await updateProductsWorkflow(container).run({
    input: {
      selector: { handle: NURA_PRODUCT_HANDLES },
      update: { collection_id: collection.id },
    },
  })
  logger.info("Assigned Nura products to the collection.")
}
