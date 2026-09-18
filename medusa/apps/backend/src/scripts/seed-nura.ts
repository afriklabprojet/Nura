import { MedusaContainer } from "@medusajs/framework"
import { ContainerRegistrationKeys, ProductStatus } from "@medusajs/framework/utils"
import {
  createProductCategoriesWorkflow,
  createProductOptionsWorkflow,
  createProductsWorkflow,
  createInventoryLevelsWorkflow,
  deleteProductCategoriesWorkflow,
  deleteProductsWorkflow,
  updateStoresWorkflow,
} from "@medusajs/medusa/core-flows"

import { productMedia } from "./product-images"

export default async function seedNura({
  container,
}: {
  container: MedusaContainer
}) {
  const logger = container.resolve(ContainerRegistrationKeys.LOGGER)
  const query = container.resolve(ContainerRegistrationKeys.QUERY)

  logger.info("Renaming store to Nura...")
  const { data: stores } = await query.graph({
    entity: "store",
    fields: ["id", "name"],
  })
  if (stores[0]) {
    await updateStoresWorkflow(container).run({
      input: {
        selector: { id: stores[0].id },
        update: { name: "Nura" },
      },
    })
  }

  logger.info("Removing demo apparel catalog...")
  const { data: demoProducts } = await query.graph({
    entity: "product",
    fields: ["id", "handle"],
    filters: { handle: ["t-shirt", "sweatshirt", "sweatpants", "shorts"] },
  })
  if (demoProducts.length) {
    await deleteProductsWorkflow(container).run({
      input: { ids: demoProducts.map((p) => p.id) },
    })
  }

  const { data: demoCategories } = await query.graph({
    entity: "product_category",
    fields: ["id", "name"],
    filters: { name: ["Shirts", "Sweatshirts", "Pants", "Merch"] },
  })
  if (demoCategories.length) {
    await deleteProductCategoriesWorkflow(container).run({
      input: demoCategories.map((c) => c.id),
    })
  }

  logger.info("Seeding Nura categories...")
  const { result: categoryResult } = await createProductCategoriesWorkflow(
    container
  ).run({
    input: {
      product_categories: [
        { name: "Parfums", is_active: true },
        { name: "Bodycare", is_active: true },
        { name: "Coffrets", is_active: true },
      ],
    },
  })
  const parfumsCat = categoryResult.find((c) => c.name === "Parfums")!
  const bodycareCat = categoryResult.find((c) => c.name === "Bodycare")!
  const coffretsCat = categoryResult.find((c) => c.name === "Coffrets")!

  logger.info("Seeding shared product options...")
  const { result: optionsResult } = await createProductOptionsWorkflow(
    container
  ).run({
    input: {
      product_options: [
        {
          title: "Contenance",
          values: ["10 ml", "50 ml", "100 ml", "200 ml", "3 x 10 ml"],
        },
        {
          title: "Montant",
          values: ["30 €", "50 €", "100 €"],
        },
      ],
    },
  })
  const contenanceOption = optionsResult.find((o) => o.title === "Contenance")!
  const montantOption = optionsResult.find((o) => o.title === "Montant")!

  const { data: salesChannels } = await query.graph({
    entity: "sales_channel",
    fields: ["id", "name"],
  })
  const defaultSalesChannel = salesChannels[0]

  const { data: shippingProfiles } = await query.graph({
    entity: "shipping_profile",
    fields: ["id"],
  })
  const shippingProfile = shippingProfiles[0]

  // XOF prices use the fixed CFA franc peg (1 EUR = 655.957 XOF), rounded to
  // customer-friendly commercial amounts.
  logger.info("Seeding Nura products...")
  await createProductsWorkflow(container).run({
    input: {
      products: [
        {
          title: "Eau de Parfum — Aura Dorée",
          category_ids: [parfumsCat.id],
          description:
            "Un sillage ambré et boisé, porté par l'iris et le jasmin. Best-seller de la maison Nura, pour une aura chaleureuse et affirmée.",
          handle: "eau-de-parfum-aura-doree",
          ...productMedia("eau-de-parfum-aura-doree"),
          status: ProductStatus.PUBLISHED,
          shipping_profile_id: shippingProfile.id,
          options: [{ id: contenanceOption.id }],
          metadata: {
            type_produit: "Parfum",
            notes_tete: "Bergamote, Poivre rose",
            notes_coeur: "Iris, Jasmin",
            notes_fond: "Ambre, Bois de santal, Musc",
            badge: "Best-seller",
          },
          variants: [
            {
              title: "50 ml",
              sku: "EDP-AURA-50",
              options: { Contenance: "50 ml" },
              prices: [
                { amount: 58, currency_code: "eur" },
                { amount: 38000, currency_code: "xof" },
              ],
            },
            {
              title: "100 ml",
              sku: "EDP-AURA-100",
              options: { Contenance: "100 ml" },
              prices: [
                { amount: 89, currency_code: "eur" },
                { amount: 58500, currency_code: "xof" },
              ],
            },
          ],
          sales_channels: [{ id: defaultSalesChannel.id }],
        },
        {
          title: "Eau de Parfum — Nuit de Nude",
          category_ids: [parfumsCat.id],
          description:
            "Rose et fleur d'oranger sur un fond de vanille et fève tonka. Un parfum gourmand et sensuel, nouveauté de la collection Nura.",
          handle: "eau-de-parfum-nuit-de-nude",
          ...productMedia("eau-de-parfum-nuit-de-nude"),
          status: ProductStatus.PUBLISHED,
          shipping_profile_id: shippingProfile.id,
          options: [{ id: contenanceOption.id }],
          metadata: {
            type_produit: "Parfum",
            notes_tete: "Mandarine, Cardamome",
            notes_coeur: "Rose, Fleur d'oranger",
            notes_fond: "Vanille, Fève tonka, Patchouli",
            badge: "Nouveau",
          },
          variants: [
            {
              title: "50 ml",
              sku: "EDP-NUIT-50",
              options: { Contenance: "50 ml" },
              prices: [
                { amount: 62, currency_code: "eur" },
                { amount: 40500, currency_code: "xof" },
              ],
            },
            {
              title: "100 ml",
              sku: "EDP-NUIT-100",
              options: { Contenance: "100 ml" },
              prices: [
                { amount: 94, currency_code: "eur" },
                { amount: 61500, currency_code: "xof" },
              ],
            },
          ],
          sales_channels: [{ id: defaultSalesChannel.id }],
        },
        {
          title: "Eau de Parfum — Lumière Nue",
          category_ids: [parfumsCat.id],
          description:
            "Citron et freesia dans un sillage de cèdre et musc blanc. Frais, lumineux, pour une aura légère au quotidien.",
          handle: "eau-de-parfum-lumiere-nue",
          ...productMedia("eau-de-parfum-lumiere-nue"),
          status: ProductStatus.PUBLISHED,
          shipping_profile_id: shippingProfile.id,
          options: [{ id: contenanceOption.id }],
          metadata: {
            type_produit: "Parfum",
            notes_tete: "Citron, Poivre blanc",
            notes_coeur: "Freesia, Muguet",
            notes_fond: "Cèdre, Musc blanc",
          },
          variants: [
            {
              title: "50 ml",
              sku: "EDP-LUMIERE-50",
              options: { Contenance: "50 ml" },
              prices: [
                { amount: 55, currency_code: "eur" },
                { amount: 36000, currency_code: "xof" },
              ],
            },
            {
              title: "100 ml",
              sku: "EDP-LUMIERE-100",
              options: { Contenance: "100 ml" },
              prices: [
                { amount: 85, currency_code: "eur" },
                { amount: 55500, currency_code: "xof" },
              ],
            },
          ],
          sales_channels: [{ id: defaultSalesChannel.id }],
        },
        {
          title: "Huile Corps Nourrissante — Fleur d'Ambre",
          category_ids: [bodycareCat.id],
          description:
            "Une huile sèche à l'amande douce et au jojoba, parfumée à l'ambre. Nourrit et sublime la peau sans film gras.",
          handle: "huile-corps-fleur-dambre",
          ...productMedia("huile-corps-fleur-dambre"),
          status: ProductStatus.PUBLISHED,
          shipping_profile_id: shippingProfile.id,
          options: [{ id: contenanceOption.id }],
          metadata: {
            type_produit: "Bodycare",
            conseils_utilisation:
              "Appliquer sur peau humide après la douche, masser en mouvements circulaires jusqu'à absorption complète.",
            ingredients: "Huile d'amande douce, huile de jojoba, vitamine E, parfum.",
          },
          variants: [
            {
              title: "200 ml",
              sku: "HUILE-AMBRE-200",
              options: { Contenance: "200 ml" },
              prices: [
                { amount: 34, currency_code: "eur" },
                { amount: 22500, currency_code: "xof" },
              ],
            },
          ],
          sales_channels: [{ id: defaultSalesChannel.id }],
        },
        {
          title: "Baume Corps Fondant — Nude Velvet",
          category_ids: [bodycareCat.id],
          description:
            "Un baume onctueux au beurre de karité, à la texture fondante. Édition limitée, pour une peau veloutée et une aura enveloppante.",
          handle: "baume-corps-nude-velvet",
          ...productMedia("baume-corps-nude-velvet"),
          status: ProductStatus.PUBLISHED,
          shipping_profile_id: shippingProfile.id,
          options: [{ id: contenanceOption.id }],
          metadata: {
            type_produit: "Bodycare",
            conseils_utilisation:
              "Appliquer généreusement sur le corps, en particulier sur les zones sèches (coudes, genoux, talons).",
            ingredients: "Beurre de karité, huile de coco, cire d'abeille, parfum.",
            badge: "Édition limitée",
          },
          variants: [
            {
              title: "200 ml",
              sku: "BAUME-VELVET-200",
              options: { Contenance: "200 ml" },
              prices: [
                { amount: 36, currency_code: "eur" },
                { amount: 23500, currency_code: "xof" },
              ],
            },
          ],
          sales_channels: [{ id: defaultSalesChannel.id }],
        },
        {
          title: "Coffret Découverte Nura",
          category_ids: [coffretsCat.id],
          description:
            "Trois miniatures 10 ml pour découvrir l'univers olfactif Nura : Aura Dorée, Nuit de Nude et Lumière Nue.",
          handle: "coffret-decouverte-nura",
          ...productMedia("coffret-decouverte-nura"),
          status: ProductStatus.PUBLISHED,
          shipping_profile_id: shippingProfile.id,
          options: [{ id: contenanceOption.id }],
          metadata: {
            type_produit: "Coffret",
            badge: "Nouveau",
          },
          variants: [
            {
              title: "3 x 10 ml",
              sku: "COFFRET-DECOUVERTE",
              options: { Contenance: "3 x 10 ml" },
              prices: [
                { amount: 45, currency_code: "eur" },
                { amount: 29500, currency_code: "xof" },
              ],
            },
          ],
          sales_channels: [{ id: defaultSalesChannel.id }],
        },
        {
          title: "Carte Cadeau Nura",
          description:
            "Offrez le choix. Une carte cadeau Nura, valable sur l'ensemble de la boutique, envoyée par email sous forme de code à utiliser au paiement.",
          handle: "carte-cadeau-nura",
          ...productMedia("carte-cadeau-nura"),
          status: ProductStatus.PUBLISHED,
          shipping_profile_id: shippingProfile.id,
          options: [{ id: montantOption.id }],
          // Medusa's native gift-card flag — also what the
          // gift-card-issued subscriber watches for on order.placed to
          // auto-generate + email a redeemable promo code per unit
          // purchased, and what RelatedProducts already excludes via
          // `is_giftcard: false` so it never gets suggested as a "related"
          // perfume/bodycare item.
          is_giftcard: true,
          metadata: {
            type_produit: "Carte cadeau",
          },
          variants: [
            {
              title: "30 €",
              sku: "GIFTCARD-30",
              options: { Montant: "30 €" },
              manage_inventory: false,
              prices: [
                { amount: 30, currency_code: "eur" },
                { amount: 20000, currency_code: "xof" },
              ],
            },
            {
              title: "50 €",
              sku: "GIFTCARD-50",
              options: { Montant: "50 €" },
              manage_inventory: false,
              prices: [
                { amount: 50, currency_code: "eur" },
                { amount: 33000, currency_code: "xof" },
              ],
            },
            {
              title: "100 €",
              sku: "GIFTCARD-100",
              options: { Montant: "100 €" },
              manage_inventory: false,
              prices: [
                { amount: 100, currency_code: "eur" },
                { amount: 66000, currency_code: "xof" },
              ],
            },
          ],
          sales_channels: [{ id: defaultSalesChannel.id }],
        },
      ],
    },
  })
  logger.info("Finished seeding Nura products.")

  logger.info("Seeding inventory levels for Nura products...")
  const { data: stockLocations } = await query.graph({
    entity: "stock_location",
    fields: ["id"],
  })
  const stockLocation = stockLocations[0]

  const { data: inventoryItems } = await query.graph({
    entity: "inventory_item",
    fields: ["id"],
  })

  await createInventoryLevelsWorkflow(container).run({
    input: {
      inventory_levels: inventoryItems.map((item) => ({
        location_id: stockLocation.id,
        stocked_quantity: 1000,
        inventory_item_id: item.id,
      })),
    },
  })
  logger.info("Finished seeding inventory levels.")
}
