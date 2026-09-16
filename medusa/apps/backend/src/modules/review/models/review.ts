import { model } from "@medusajs/framework/utils"

const Review = model
  .define("review", {
    id: model.id().primaryKey(),
    customer_id: model.text(),
    customer_name: model.text(),
    product_id: model.text(),
    rating: model.number(),
    title: model.text().nullable(),
    content: model.text(),
    verified_purchase: model.boolean().default(false),
    status: model.enum(["pending", "approved", "rejected"]).default("pending"),
  })
  .indexes([
    {
      name: "IDX_review_customer_product",
      on: ["customer_id", "product_id"],
      unique: true,
      where: "deleted_at IS NULL",
    },
    {
      name: "IDX_review_product_status",
      on: ["product_id", "status"],
      where: "deleted_at IS NULL",
    },
  ])

export default Review
