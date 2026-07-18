// @ts-check
const eslint = require('@eslint/js');
const { defineConfig } = require('eslint/config');
const tseslint = require('typescript-eslint');
const angular = require('angular-eslint');
const eslintConfigPrettier = require('eslint-config-prettier');

module.exports = defineConfig([
  // Global ignores
  {
    ignores: ['dist/**', '.angular/**', 'coverage/**', 'node_modules/**'],
  },

  // TypeScript files
  {
    files: ['**/*.ts'],
    extends: [
      eslint.configs.recommended,
      tseslint.configs.recommended,
      tseslint.configs.stylistic,
      angular.configs.tsRecommended,
    ],
    processor: angular.processInlineTemplates,
    rules: {
      '@angular-eslint/component-selector': [
        'error',
        {
          type: 'element',
          prefix: 'app',
          style: 'kebab-case',
        },
      ],
      '@angular-eslint/prefer-inject': 'error',
      '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
      '@typescript-eslint/member-ordering': 'warn',
      '@typescript-eslint/consistent-type-definitions': ['error', 'interface'],
      'no-console': ['warn', { allow: ['warn', 'error'] }],
      'prefer-const': 'error',
      'no-var': 'error',
      '@typescript-eslint/no-explicit-any': 'warn',
    },
  },

  // HTML template files
  {
    files: ['**/*.html'],
    extends: [angular.configs.templateRecommended, angular.configs.templateAccessibility],
    rules: {
      '@angular-eslint/template/prefer-control-flow': 'warn',
      '@angular-eslint/template/no-call-expression': 'warn',
      '@angular-eslint/template/conditional-complexity': 'warn',
    },
  },

  // Prettier must be last to disable conflicting formatting rules
  {
    files: ['**/*.ts', '**/*.html'],
    extends: [eslintConfigPrettier],
  },
]);
