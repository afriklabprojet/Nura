import { defineConfig, globalIgnores } from "eslint/config"
import nextVitals from "eslint-config-next/core-web-vitals"
import nextTypeScript from "eslint-config-next/typescript"

const config = defineConfig([
  ...nextVitals,
  ...nextTypeScript,
  globalIgnores([
      ".next/**",
      "node_modules/**",
      "next-env.d.ts",
      "*.config.js",
      "next-sitemap.js",
      "prepare-standalone.js",
      "check-env-variables.js",
      "eslint.config.mjs",
  ]),
  {
    rules: {
      "react-hooks/refs": "off",
      "react-hooks/set-state-in-effect": "off",
      "@typescript-eslint/no-unused-vars": [
        "error",
        {
          argsIgnorePattern: "^_",
          varsIgnorePattern: "^_",
          caughtErrorsIgnorePattern: "^_",
        },
      ],
    },
  },
])

export default config
