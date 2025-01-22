const { resolve } = require("node:path")
const project = resolve(__dirname, "tsconfig.json")

module.exports = {
  root: true,
  extends: [
    require.resolve("@vercel/style-guide/eslint/browser"),
    require.resolve("@vercel/style-guide/eslint/react"),
    require.resolve("@vercel/style-guide/eslint/typescript"),
  ],
  parserOptions: {
    project,
  },
  settings: {
    "import/resolver": {
      typescript: {
        project,
      },
    },
  },
  rules: {
    "@typescript-eslint/consistent-type-definitions": 0,
    "@typescript-eslint/explicit-function-return-type": 0,
    "@typescript-eslint/no-misused-promises": 0,
    "@typescript-eslint/array-type": 0,
    "@typescript-eslint/naming-convention": 0,
    "jsx-a11y/click-events-have-key-events": 0,
    "jsx-a11y/no-static-element-interactions": 0,
  },
  ignorePatterns: [
    "**/assets/**",
    "node_modules/**",
    "dist/**",
    "build/**",
    "coverage/**",
    "*.config.js",
    "*.config.cjs",
    ".eslintrc.cjs",
    "src/routeTree.gen.ts",
  ],
}
