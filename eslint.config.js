import js from '@eslint/js';
import reactPlugin from 'eslint-plugin-react';
import reactHooksPlugin from 'eslint-plugin-react-hooks';
import reactNativePlugin from 'eslint-plugin-react-native';

export default [
  {
    ignores: ['node_modules/**', 'android/**']
  },
  js.configs.recommended,
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
        requestAnimationFrame: 'readonly',
        require: 'readonly'
      }
    },
    plugins: {
      react: reactPlugin,
      'react-hooks': reactHooksPlugin,
      'react-native': reactNativePlugin
    },
    settings: {
      react: {
        version: 'detect'
      }
    },
    rules: {
      'react/react-in-jsx-scope': 'off',
      'react/jsx-uses-react': 'off',
      'react/jsx-uses-vars': 'error',
      'react/prop-types': 'off',
      'react-hooks/rules-of-hooks': 'error',
      'react-hooks/exhaustive-deps': 'warn',
      'react-native/no-unused-styles': 'error',
      'react-native/no-inline-styles': 'off'
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
  }
];
