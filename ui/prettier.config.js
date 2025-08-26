export default {
  // your settings
  singleQuote: false,
  tabWidth: 2,
  semi: true,
  trailingComma: "all",
  importOrder: ["<THIRD_PARTY_MODULES>", "", "^@/(.*)$", "", "^[./]"],
  overrides: [
    {
      files: "*.{js,cjs,mjs,ts,cts,mts,tsx,vue}",
      excludeFiles: "src/utils/shims.ts",
      plugins: [
        "@ianvs/prettier-plugin-sort-imports",
        "prettier-plugin-tailwindcss",
      ],
      options: {
        tailwindStylesheet: "./src/index.css",
        tailwindFunctions: ["clsx", "cn", "twMerge", "cva"],
      },
    },
  ],
};
