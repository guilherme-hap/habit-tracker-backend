import { defineConfig } from 'eslint-define-config';
import js from '@eslint/js';
import globals from 'globals';

export default defineConfig([
    {
        files: ['**/*.{js,mjs,cjs}'],
        plugins: { js },
        rules: js.configs.recommended.rules,
        languageOptions: {
            ecmaVersion: 12,
            sourceType: 'module',
            globals: {
                ...globals.node,
                ...globals.es2021,
            },
        },
        ignores: ['node_modules', 'dist', 'build', 'coverage', 'public', 'database.sqlite', '.env'],
    },
    {
        files: ['**/*.{js,mjs,cjs}'],
        languageOptions: {
            globals: {
                ...globals.browser,
                ...globals.es2021,
            },
        },
    },
]);
