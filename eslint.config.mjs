import eslint from '@eslint/js'
import tseslint from 'typescript-eslint'
import eslintConfigPrettier from 'eslint-config-prettier'
import importPlugin from 'eslint-plugin-import'

export default [
  eslint.configs.recommended,
  ...tseslint.configs.recommended,
  {
    files: ['src/**/*.ts', 'src/**/*.tsx'],
    plugins: {
      import: importPlugin,
    },
    languageOptions: {
      parser: tseslint.parser,
      parserOptions: {
        project: './tsconfig.json',
        tsconfigRootDir: import.meta.dirname,
      },
    },
    settings: {
      // This solves the "Resolve error: typescript with invalid interface"
      'import/resolver': {
        typescript: {
          alwaysTryTypes: true,
          project: './tsconfig.json',
        },
        node: true,
      },
    },
    rules: {
      'no-console': 'off',
      'no-unused-vars': 'off',
      '@typescript-eslint/no-unused-vars': [
        'error',
        {
          argsIgnorePattern: '^_',
          varsIgnorePattern: '^_',
          caughtErrorsIgnorePattern: '^_',
        },
      ],

      // Import Sorting Logic
      'import/order': [
        'error',
        {
          groups: [
            'builtin', // node:fs, node:path
            'external', // zod, fastify
            'internal', // @/* imports
            ['parent', 'sibling', 'index'],
          ],
          pathGroups: [
            {
              // Forces @/core to the top of internal imports
              pattern: '@/core/**',
              group: 'internal',
              position: 'before',
            },
            {
              // Forces @/modules to the bottom of internal imports
              pattern: '@/modules/**',
              group: 'internal',
              position: 'after',
            },
          ],
          pathGroupsExcludedImportTypes: ['builtin'],
          'newlines-between': 'always',
          alphabetize: {
            order: 'asc',
            caseInsensitive: true,
          },
        },
      ],

      '@typescript-eslint/no-floating-promises': 'off',
      '@typescript-eslint/await-thenable': 'off',
      '@typescript-eslint/no-misused-promises': 'off',
      '@typescript-eslint/no-explicit-any': 'warn',
      quotes: ['error', 'single'],
      semi: ['error', 'never'],
    },
  },
  {
    ignores: [
      '**/node_modules/**',
      '**/dist/**',
      'eslint.config.mjs',
      'package.json',
      '/*',
      '!/src',
    ],
  },
  eslintConfigPrettier,
]
