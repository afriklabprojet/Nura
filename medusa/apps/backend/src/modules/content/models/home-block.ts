import { model } from "@medusajs/framework/utils"

/**
 * One editable section of the storefront home page. `key` identifies the
 * section (hero, campaign, essentials…), `data` holds its fields, and the
 * schedule lets a campaign publish and expire on its own.
 */
const HomeBlock = model
  .define("home_block", {
    id: model.id().primaryKey(),
    key: model.text(),
    data: model.json(),
    active: model.boolean().default(true),
    rank: model.number().default(0),
    starts_at: model.dateTime().nullable(),
    ends_at: model.dateTime().nullable(),
  })
  .indexes([
    {
      name: "IDX_home_block_key",
      on: ["key"],
      unique: true,
      where: "deleted_at IS NULL",
    },
  ])

export default HomeBlock
