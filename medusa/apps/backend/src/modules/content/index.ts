import ContentModuleService from "./service"
import { Module } from "@medusajs/framework/utils"

export const CONTENT_MODULE = "content"

export default Module(CONTENT_MODULE, {
  service: ContentModuleService,
})
