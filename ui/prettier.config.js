/** @type {import('prettier').Config & import('prettier-plugin-tailwindcss').PluginOptions} */
export default {
  // your settings
  singleQuote: false,
  tabWidth: 2,
  semi: true,
  trailingComma: "all",
  importOrder: ["<THIRD_PARTY_MODULES>", "", "^@/(.*)$", "", "^[./]"],
  tailwindStylesheet: "./src/index.css",
  tailwindFunctions: ["clsx", "cn", "twMerge", "cva"],
  plugins: [
    "@ianvs/prettier-plugin-sort-imports",
    "prettier-plugin-tailwindcss",
  ],
  overrides: [
    {
      files: "*.{js,cjs,mjs,ts,cts,mts,tsx,vue}",
      excludeFiles: "src/utils/shims.ts",
    },
  ],
};
