// ============================================
// ESLint Flat Config for paraMOT Website
// Next.js 15 + React 19 + TypeScript + Prettier
// ============================================
// Working around circular ref bug in eslint-plugin-react with FlatCompat
// See: https://github.com/jsx-eslint/eslint-plugin-react/issues/3699

import tseslint from "typescript-eslint";
import prettierConfig from "eslint-config-prettier";
import react from "eslint-plugin-react";
import reactHooks from "eslint-plugin-react-hooks";

export default [
  // ============================================
  // 1. GLOBAL IGNORES
  // ============================================
  {
    ignores: [
      "**/node_modules/**",
      "**/.next/**",
      "**/out/**",
      "**/build/**",
      "**/*.config.{js,mjs,ts}",
      "**/next-env.d.ts",
      "**/.env*",
      "**/public/**",
      "**/.vscode/**",
      "**/tsconfig*.json",
    ],
  },

  // ============================================
  // 2. TYPESCRIPT BASE CONFIG
  // ============================================
  ...tseslint.configs.recommended,

  // ============================================
  // 3. CUSTOM RULES + PLUGINS
  // ============================================
    {
        files: ["src/**/*.{js,jsx,ts,tsx}"],

        plugins: {
            react,
            "react-hooks": reactHooks,
        },

        settings: {
            react: {
                version: "detect", // Auto-detect React version
            },
        },

        languageOptions: {
            ecmaVersion: 2022,
            sourceType: "module",
            parserOptions: {
                ecmaFeatures: {
                    jsx: true,
                },
            },
        },

        rules: {
            // ----------------------------------------
            // TypeScript Rules
            // ----------------------------------------
            "@typescript-eslint/no-unused-vars": [
                "warn",
                {
                    argsIgnorePattern: "^_",  // Allow _unused
                    varsIgnorePattern: "^_",  // Allow _unused
                },
            ],
            "@typescript-eslint/no-explicit-any": "warn",
            "no-unused-vars": "off", // Use TS version

            // ----------------------------------------
            // Code Quality Rules
            // ----------------------------------------
            "no-console": ["warn", { allow: ["warn", "error"] }],
            "no-debugger": "error",
            "prefer-const": "error",
            "no-var": "error",
            "eqeqeq": ["error", "always", { null: "ignore" }],
            "no-duplicate-imports": "error",
            "no-template-curly-in-string": "warn",
            "require-await": "warn",

            // ----------------------------------------
            // React Rules
            // ----------------------------------------
            "react/react-in-jsx-scope": "off", // Not needed in React 19
            "react/prop-types": "off", // Using TypeScript instead
            "react/jsx-uses-react": "error",
            "react/jsx-uses-vars": "error",
            "react/jsx-key": "error", // Require keys in lists
            "react/no-array-index-key": "warn", // Warn about index as key
            "react/no-deprecated": "error",
            "react/no-unknown-property": "error",
            "react/self-closing-comp": "error", // Enforce <Component /> style

            // ----------------------------------------
            // React Hooks Rules
            // ----------------------------------------
            "react-hooks/rules-of-hooks": "error", // Enforce hook rules
            "react-hooks/exhaustive-deps": "warn", // Check effect dependencies
        },
    },

    // ============================================
    // 4. PRETTIER (must be last)
    // ============================================
    // Disables ESLint formatting rules that conflict with Prettier
    prettierConfig,
];
