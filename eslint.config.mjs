import js from '@eslint/js';
import globals from 'globals';

const browserScriptGlobals = {
  ...globals.browser,
  ...globals.es2024,
  createFallbackI18n: 'readonly',
  createOverviewFallbackI18n: 'readonly'
};

export default [
  {
    ignores: ['dist/**', 'node_modules/**', 'coverage/**']
  },
  {
    files: ['**/*.js'],
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'script',
      globals: browserScriptGlobals
    },
    rules: {
      ...js.configs.recommended.rules,
      'no-unused-vars': 'off',
      'no-empty': ['error', { allowEmptyCatch: true }]
    }
  },
  {
    files: ['sw.js'],
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'script',
      globals: {
        ...globals.serviceworker,
        ...globals.es2024,
        self: 'readonly'
      }
    }
  },
  {
    files: ['eslint.config.mjs', 'scripts/**/*.mjs'],
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      globals: {
        ...globals.node,
        ...globals.es2024
      }
    }
  }
];

