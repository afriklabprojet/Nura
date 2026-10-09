const { cpSync, existsSync, mkdirSync, rmSync } = require("node:fs")
const { join } = require("node:path")

const standaloneSource = join(
  __dirname,
  ".next",
  "standalone",
  "apps",
  "storefront"
)
const runtimeRoot = join(__dirname, ".next", "runtime")

if (!existsSync(join(standaloneSource, "server.js"))) {
  throw new Error("Standalone build not found. Run `npm run build` first.")
}

rmSync(runtimeRoot, { recursive: true, force: true })
cpSync(standaloneSource, runtimeRoot, { recursive: true })
mkdirSync(join(runtimeRoot, ".next"), { recursive: true })
cpSync(join(__dirname, "public"), join(runtimeRoot, "public"), {
  recursive: true,
  force: true,
})
cpSync(
  join(__dirname, ".next", "static"),
  join(runtimeRoot, ".next", "static"),
  { recursive: true, force: true }
)
