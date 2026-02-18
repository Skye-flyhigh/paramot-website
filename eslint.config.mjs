// ============================================
// ESLint Flat Config for paraMOT Website
// Next.js 15 + React 19 + TypeScript + Prettier
// ============================================
// Working around circular ref bug in eslint-plugin-react with FlatCompat
// See: https://github.com/jsx-eslint/eslint-plugin-react/issues/3699

import nextPlugin from '@next/eslint-plugin-next';
import stylistic from '@stylistic/eslint-plugin';
import prettierConfig from 'eslint-config-prettier';
import perfectionist from 'eslint-plugin-perfectionist';
import react from 'eslint-plugin-react';
import reactHooks from 'eslint-plugin-react-hooks';
import tseslint from 'typescript-eslint';

export default [
  // ============================================
  // 1. GLOBAL IGNORES
  // ============================================
  {
    ignores: [
      '**/node_modules/**',
      '**/.next/**',
      '**/out/**',
      '**/build/**',
      '**/*.config.{js,mjs,ts}',
      '**/next-env.d.ts',
      '**/.env*',
      '**/public/**',
      '**/.vscode/**',
      '**/tsconfig*.json',
      'src/generated/**',
      'react-email-starter/**',
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
    files: ['src/**/*.{js,jsx,ts,tsx}'],

    plugins: {
      react,
      'react-hooks': reactHooks,
      '@next/next': nextPlugin,
      '@stylistic': stylistic,
      perfectionist: perfectionist,
    },

    settings: {
      react: {
        version: 'detect', // Auto-detect React version
      },
    },

    languageOptions: {
      ecmaVersion: 2022,
      sourceType: 'module',
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
      '@typescript-eslint/no-unused-vars': [
        'warn',
        {
          argsIgnorePattern: '^_', // Allow _unused
          varsIgnorePattern: '^_', // Allow _unused
        },
      ],
      '@typescript-eslint/no-explicit-any': 'warn',
      '@typescript-eslint/consistent-type-imports': 'off',
      '@typescript-eslint/explicit-module-boundary-types': 'off',
      '@typescript-eslint/no-non-null-assertion': 'warn',
      // ----------------------------------------
      // Stylistic Rules
      // ----------------------------------------
      '@stylistic/quotes': ['error', 'single', { avoidEscape: true }],
      '@stylistic/member-delimiter-style': [
        'error',
        {
          multiline: {
            delimiter: 'none',
            requireLast: false,
          },
          singleline: {
            delimiter: 'comma',
            requireLast: false,
          },
        },
      ],
      '@stylistic/brace-style': ['error', 'stroustrup'],
      '@stylistic/comma-spacing': ['error', { before: false, after: true }],
      '@stylistic/keyword-spacing': ['error', { before: true, after: true }],
      '@stylistic/object-curly-spacing': ['error', 'always'],
      '@stylistic/array-bracket-spacing': ['error', 'never'],
      '@stylistic/space-before-function-paren': [
        'error',
        {
          anonymous: 'always',
          named: 'never',
          asyncArrow: 'always',
        },
      ],
      '@stylistic/space-in-parens': ['error', 'never'],
      '@stylistic/space-infix-ops': 'error',
      '@stylistic/no-multi-spaces': 'error',
      '@stylistic/eol-last': ['error', 'always'],
      '@stylistic/no-trailing-spaces': 'error',
      '@stylistic/no-multiple-empty-lines': ['error', { max: 1, maxEOF: 0 }],
      '@stylistic/padding-line-between-statements': [
        'error',
        { blankLine: 'always', prev: '*', next: 'return' },
        { blankLine: 'always', prev: ['const', 'let', 'var'], next: '*' },
        {
          blankLine: 'any',
          prev: ['const', 'let', 'var'],
          next: ['const', 'let', 'var'],
        },
      ],
      '@stylistic/semi': 'warn',
      // ----------------------------------------
      // Code Quality Rules
      // ----------------------------------------
      'no-console': ['warn', { allow: ['warn', 'error'] }],
      'no-debugger': 'error',
      'prefer-const': 'error',
      'no-var': 'error',
      eqeqeq: ['error', 'always', { null: 'ignore' }],
      'no-duplicate-imports': 'error',
      'no-template-curly-in-string': 'warn',
      'require-await': 'warn',
      curly: ['error', 'multi'],
      semi: ['error', 'never'],
      // ----------------------------------------
      // React Rules
      // ----------------------------------------
      'react/react-in-jsx-scope': 'off', // Not needed in React 19
      'react/prop-types': 'off', // Using TypeScript instead
      'react/jsx-uses-react': 'error',
      'react/jsx-uses-vars': 'error',
      'react/jsx-key': 'error', // Require keys in lists
      'react/no-array-index-key': 'warn', // Warn about index as key
      'react/no-deprecated': 'error',
      'react/no-unknown-property': 'error',
      'react/self-closing-comp': 'error', // Enforce <Component /> style
      // ----------------------------------------
      // React Hooks Rules
      // ----------------------------------------
      'react-hooks/rules-of-hooks': 'error', // Enforce hook rules
      'react-hooks/exhaustive-deps': 'warn', // Check effect dependencies
      // ----------------------------------------
      // Next Rules
      // ----------------------------------------
      '@next/next/no-html-link-for-pages': 'error',
      '@next/next/no-img-element': 'error',
      '@next/next/inline-script-id': 'error',
      '@next/next/no-async-client-component': 'error',
      '@next/next/no-typos': 'error',
    },
  },

  // ============================================
  // 4. SCRIPTS OVERRIDE (allow console.log in test scripts)
  // ============================================
  {
    files: ['src/scripts/**/*.{js,ts}'],
    rules: {
      'no-console': 'off', // Allow all console methods in scripts
    },
  },

  // ============================================
  // 5. PRETTIER (must be last)
  // ============================================
  // Disables ESLint formatting rules that conflict with Prettier
  prettierConfig,
];
