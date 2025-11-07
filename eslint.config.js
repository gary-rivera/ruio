// eslint.config.js
import js from '@eslint/js'
import typescriptParser from '@typescript-eslint/parser'
import typescriptPlugin from '@typescript-eslint/eslint-plugin'
import reactPlugin from 'eslint-plugin-react'
import prettierPlugin from 'eslint-plugin-prettier'
import prettierConfig from 'eslint-config-prettier'
import globals from 'globals'

export default [
  // Ignore patterns (consolidated from .eslintignore)
  {
    ignores: ['node_modules', 'dist', 'build'],
  },
  // Base ESLint recommended rules
  js.configs.recommended,
  // TypeScript config files (without type checking)
  {
    files: ['*.config.ts', '*.config.js'],
    languageOptions: {
      parser: typescriptParser,
      parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
      },
      globals: {
        ...globals.node,
      },
    },
    plugins: {
      '@typescript-eslint': typescriptPlugin,
      prettier: prettierPlugin,
    },
    rules: {
      ...typescriptPlugin.configs.recommended.rules,
      'prettier/prettier': 'error',
    },
  },
  // Regular TypeScript files (with type checking)
  {
    files: ['*.ts', '*.tsx'],
    ignores: ['*.config.ts'],
    languageOptions: {
      parser: typescriptParser,
      parserOptions: {
        project: './tsconfig.json',
        ecmaVersion: 'latest',
        sourceType: 'module',
        ecmaFeatures: {
          jsx: true,
        },
      },
      globals: {
        ...globals.browser,
        ...globals.node,
      },
    },
    plugins: {
      '@typescript-eslint': typescriptPlugin,
      react: reactPlugin,
      prettier: prettierPlugin,
    },
    rules: {
      ...typescriptPlugin.configs.recommended.rules,
      ...reactPlugin.configs.recommended.rules,
      'prettier/prettier': 'error',
      // Custom rules here
    },
    settings: {
      react: {
        version: 'detect', // Automatically detect the version of React
      },
    },
  },
  prettierConfig,
]

/*
RULES TO ADD
- no semicolons
-
*/
