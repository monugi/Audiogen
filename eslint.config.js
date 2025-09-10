import js from '@eslint/js';
import globals from 'globals';
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';

export default [
  { ignores: ['dist'] },
  {
    files: ['**/*.{js,jsx}'],
    languageOptions: {
      ecmaVersion: 2020,
      globals: {
        ...globals.browser,
        ...globals.es2020,
      },
      parserOptions: {
        ecmaVersion: 'latest',
        ecmaFeatures: { jsx: true },
        sourceType: 'module',
      },
    },
    settings: {
      react: {
        version: 'detect',
      },
    },
    rules: {
      ...js.configs.recommended.rules,
      ...reactHooks.configs.recommended.rules,
      // Spacing & formatting handoff to Prettier
      'no-mixed-spaces-and-tabs': 'error',
      'no-trailing-spaces': ['error', { ignoreComments: false }],
      'eol-last': ['error', 'always'],
      'key-spacing': ['error', { beforeColon: false, afterColon: true, mode: 'strict' }],
      'comma-spacing': ['error', { before: false, after: true }],
      'array-bracket-spacing': ['error', 'never'],
      'object-curly-spacing': ['error', 'always'],
      'space-in-parens': ['error', 'never'],
      'no-multiple-empty-lines': ['error', { max: 1, maxEOF: 1 }],
      'space-before-blocks': ['error', 'always'],
      'no-unused-vars': [
        'error',
        {
          varsIgnorePattern: '^[A-Z_]|^motion$',
          argsIgnorePattern: '^_',
          destructuredArrayIgnorePattern: '^_',
        },
      ],
      'react-refresh/only-export-components': ['warn', { allowConstantExport: true }],
    },
    plugins: {
      'react-hooks': reactHooks,
      'react-refresh': reactRefresh,
    },
  },
];
