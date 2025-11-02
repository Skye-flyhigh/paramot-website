import { defineConfig, globalIgnores } from 'eslint/config'
import nextPlugin from '@next/eslint-plugin-next'
import js from "@next/eslint-plugin-next"
 
const eslintConfig = defineConfig([
  nextPlugin.configs['core-web-vitals'],
  // List of ignore patterns.
    globalIgnores([
          '.next/**',
    'out/**',
    'build/**',
        'next-env.d.ts',
        ".env.*",
        "node_modules/**",
      '*.config.js',
      '*.config.ts',
        "postcss.config.mjs",
        "public/**",
          '.vscode/**',
      'tsconfig*.json',
    ]),


    {
        plugins: {
            js,
            "@next/next": nextPlugin,
            "@typescript-eslint": tsPlugin,
            tailwindcss: tailwindcssPlugin
        },
        "extends": [
    "next/core-web-vitals",
    "plugin:@typescript-eslint/recommended",
    "plugin:prettier/recommended"
  ],
        parser: "@typescript-eslint/parser",
        files: ["**/*.{js,mjs,cjs,jsx,ts,tsx}"],
        rules: {
            ...js.configs.recommended.rules,
            ...pluginNext.configs.recommended.rules,
            ...pluginNext.configs["core-web-vitals"].rules,
            ...tsPlugin.configs.recommended.rules,
            ...tailwind.configs["flat/recommended"].rules,

            "quotes": ["warn", "double", { avoidEscape: true }],
            "semi": ["warn", "always"],
            "indent": ["warn", 2],
            "no-multiple-empty-lines": ["error", { max: 1 }],
            "eol-last": ["warn", "always"],

            "no-unused-vars": "off",
            "@typescript-eslint/no-unused-vars": ["warn"],
            "no-undef": "off"
        }
    }
])
 
export default eslintConfig