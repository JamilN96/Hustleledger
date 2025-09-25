import { createRequire } from 'node:module';
const require = createRequire(import.meta.url);
const recommendedConfig = require('./config/eslint/eslint-recommended.cjs');
const baseRecommendedRules = recommendedConfig?.rules ?? {};

export default [
  {
    ignores: ['node_modules/**', 'android/**', 'vendor/**', '**/.eslintrc.js']
  },
  {
    files: ['**/*.{js,jsx,ts,tsx}'],
    languageOptions: {
      ecmaVersion: 2023,
      sourceType: 'module',
      parserOptions: {
        ecmaFeatures: {
          jsx: true
        }
      },
      globals: {
        __DEV__: 'readonly',
        JSX: 'readonly',
        console: 'readonly',
        fetch: 'readonly',
        globalThis: 'readonly',
        requestAnimationFrame: 'readonly',
        setTimeout: 'readonly',
        clearTimeout: 'readonly',
        require: 'readonly'
      }
    },
    rules: {
      ...baseRecommendedRules,
      'no-unused-vars': [
        'error',
        {
          argsIgnorePattern: '^_',
          varsIgnorePattern: '^(?:_|[A-Z])',
        },
      ]
    }
  },
  {
    files: ['babel.config.js'],
    languageOptions: {
      sourceType: 'script',
      globals: {
        module: 'writable',
        require: 'readonly',
        __dirname: 'readonly',
        process: 'readonly'
      }
    }
  },
  {
    files: ['testing/**/*.mjs'],
    languageOptions: {
      sourceType: 'module',
      globals: {
        URL: 'readonly'
      }
    }
  },
  {
    files: ['testing/**/*.cjs'],
    languageOptions: {
      sourceType: 'script',
      globals: {
        console: 'readonly',
        module: 'readonly',
        process: 'readonly',
        require: 'readonly',
        __dirname: 'readonly'
      }
    }
  },
  {
    files: ['scripts/**/*.js'],
    languageOptions: {
      sourceType: 'script',
      globals: {
        console: 'readonly',
        module: 'readonly',
        process: 'readonly',
        require: 'readonly',
        __dirname: 'readonly'
      }
    }
  }
];
