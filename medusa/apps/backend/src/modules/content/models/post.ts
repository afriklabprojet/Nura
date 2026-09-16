import { model } from "@medusajs/framework/utils"

const Post = model
  .define("post", {
    id: model.id().primaryKey(),
    title: model.text(),
    handle: model.text(),
    excerpt: model.text().nullable(),
    content: model.text(),
    cover_image: model.text().nullable(),
    author: model.text().nullable(),
    seo_title: model.text().nullable(),
    seo_description: model.text().nullable(),
    status: model.enum(["draft", "published"]).default("draft"),
    published_at: model.dateTime().nullable(),
  })
  .indexes([
    {
      name: "IDX_post_handle",
      on: ["handle"],
      unique: true,
      where: "deleted_at IS NULL",
    },
    {
      name: "IDX_post_status_published_at",
      on: ["status", "published_at"],
      where: "deleted_at IS NULL",
    },
  ])

export default Post
