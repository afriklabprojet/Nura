import { MedusaService } from "@medusajs/framework/utils"
import HomeBlock from "./models/home-block"
import Post from "./models/post"

class ContentModuleService extends MedusaService({
  Post,
  HomeBlock,
}) {}

export default ContentModuleService
