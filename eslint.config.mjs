import js from "@eslint/js";
import eslintPluginPrettier from "eslint-plugin-prettier/recommended";
import reactPlugin from "eslint-plugin-react";
import reactHooks from "eslint-plugin-react-hooks";
import { defineConfig, globalIgnores } from "eslint/config";
import globals from "globals";
import tseslint from "typescript-eslint";

export default defineConfig([
  {
    files: ["**/*.{js,mjs,cjs,ts,jsx,tsx}"],
    plugins: { js, react: reactPlugin, "react-hooks": reactHooks },
    extends: ["js/recommended"],
    settings: {
      react: {
        version: "detect", // Detecta a versão do React automaticamente
      },
    },
  },
  {
    files: ["**/*.{js,mjs,cjs,ts,jsx,tsx}"],
    languageOptions: { globals: { ...globals.node, ...globals.browser } },
  },
  tseslint.configs.strict, // recommended config for typescript
  tseslint.configs.stylistic,
  eslintPluginPrettier,
  {
    rules: {
      // Regras recomendadas do React (manualmente aplicadas para Flat Config)
      ...reactPlugin.configs.recommended.rules,
      ...reactHooks.configs.recommended.rules,
      "react/react-in-jsx-scope": "off",

      "no-new": "off",
      "@typescript-eslint/no-extraneous-class": "off",
      "@typescript-eslint/no-unused-vars": "off",
      // "@typescript-eslint/no-unused-vars": [
      //   "error",
      //   { argsIgnorePattern: "^_", varsIgnorePattern: "^_" },
      // ],
      "prettier/prettier": [
        "error",
        {
          endOfLine: "auto",
        },
      ],
      "@typescript-eslint/naming-convention": [
        "error",
        {
          selector: "class",
          format: ["PascalCase"],
        },
        {
          selector: "variable",
          format: ["camelCase", "PascalCase", "UPPER_CASE"],
          leadingUnderscore: "allow", // allow "_" in variable names
        },
        {
          selector: "variable",
          format: ["PascalCase"],
          modifiers: ["exported"],
          types: ["function"], // allow PascalCase for exported functions (decorators)
        },
        // {
        //   selector: "property",
        //   format: ["camelCase"],
        //   leadingUnderscore: "allow",
        // },
        // {
        //   selector: "parameter",
        //   format: ["camelCase"],
        //   leadingUnderscore: "allow",
        // },
        // {
        //   selector: "objectLiteralProperty",
        //   format: ["camelCase"],
        //   leadingUnderscore: "allow",
        // },
      ],
    },
  },

  globalIgnores([
    "dist/**", // ignore dist folder
    "node_modules/**", // ignore node_modules folder
  ]),
]);
