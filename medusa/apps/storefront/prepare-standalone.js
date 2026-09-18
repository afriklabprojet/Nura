const { cpSync, existsSync, mkdirSync } = require("node:fs")
const { join } = require("node:path")

const standaloneRoot = join(
  __dirname,
  ".next",
  "standalone",
  "apps",
  "storefront"
)

if (!existsSync(join(standaloneRoot, "server.js"))) {
  throw new Error("Standalone build not found. Run `npm run build` first.")
}

mkdirSync(join(standaloneRoot, ".next"), { recursive: true })
cpSync(join(__dirname, "public"), join(standaloneRoot, "public"), {
  recursive: true,
  force: true,
})
cpSync(
  join(__dirname, ".next", "static"),
  join(standaloneRoot, ".next", "static"),
  { recursive: true, force: true }
)
