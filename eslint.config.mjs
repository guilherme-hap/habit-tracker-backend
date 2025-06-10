import { defineConfig } from 'eslint-define-config';
import js from '@eslint/js';
import globals from 'globals';

export default defineConfig([
  {
    files: ['**/*.{js,mjs,cjs}'],
    plugins: { js },
    extends: ['plugin:js/recommended'],
    env: {
      node: true,
      es2021: true,
    },
    languageOptions: {
      globals: globals.node,
      ecmaVersion: 12,
      sourceType: 'module',
    },
  },
  {
    files: ['**/*.{js,mjs,cjs}'],
    languageOptions: {
      globals: globals.browser,
    },
  },
]);
