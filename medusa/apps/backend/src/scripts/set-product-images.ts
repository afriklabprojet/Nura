import { MedusaContainer } from "@medusajs/framework"
import { ContainerRegistrationKeys } from "@medusajs/framework/utils"
import { updateProductsWorkflow } from "@medusajs/medusa/core-flows"

import { PRODUCT_IMAGES } from "./product-images"

export default async function setProductImages({
  container,
}: {
  container: MedusaContainer
}) {
  const logger = container.resolve(ContainerRegistrationKeys.LOGGER)
  const query = container.resolve(ContainerRegistrationKeys.QUERY)

  const handles = Object.keys(PRODUCT_IMAGES)

  const { data: products } = await query.graph({
    entity: "product",
    fields: ["id", "handle"],
    filters: { handle: handles },
  })

  if (!products.length) {
    logger.warn("No matching products found — run the Nura seed first.")
    return
  }

  for (const product of products) {
    const urls = PRODUCT_IMAGES[product.handle]

    await updateProductsWorkflow(container).run({
      input: {
        selector: { id: product.id },
        update: {
          thumbnail: urls[0],
          images: urls.map((url) => ({ url })),
        },
      },
    })

    logger.info(`Updated images for ${product.handle}`)
  }

  logger.info(`Product images updated for ${products.length} products.`)
}
