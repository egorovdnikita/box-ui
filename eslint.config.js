import js from '@eslint/js';
import globals from 'globals';
import reactHooks from 'eslint-plugin-react-hooks';
import tseslint from 'typescript-eslint';

export default tseslint.config(
  {
    ignores: [
      'packages/tokens/dist/**',
      'packages/icons/src/data/**',
      'packages/icons/src/names.ts',
      'apps/storybook/storybook-static/**',
      'node_modules/**',
    ],
  },

  js.configs.recommended,
  ...tseslint.configs.recommended,

  {
    languageOptions: {
      globals: { ...globals.browser, ...globals.node },
    },
    rules: {
      // The generated payloads are trusted input; `dangerouslySetInnerHTML` is
      // how icon geometry gets on the page at all.
      '@typescript-eslint/no-explicit-any': 'error',
      '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_', varsIgnorePattern: '^_' }],
      'no-console': ['warn', { allow: ['warn', 'error'] }],
      eqeqeq: ['error', 'smart'],
      'prefer-const': 'error',
    },
  },

  {
    files: ['**/*.tsx'],
    plugins: { 'react-hooks': reactHooks },
    rules: reactHooks.configs.recommended.rules,
  },

  {
    // Build scripts are CLIs: printing is the point.
    files: ['**/scripts/**', 'scripts/**'],
    rules: { 'no-console': 'off' },
  },

  {
    // Storybook renders `render` and decorators as components, so hooks are
    // legitimate there — the rule only objects to the lowercase names, which
    // are Storybook's API and not ours to change.
    files: ['**/*.stories.tsx', '**/.storybook/**'],
    rules: { 'react-hooks/rules-of-hooks': 'off' },
  },
);
