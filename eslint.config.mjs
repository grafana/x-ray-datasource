import { fixupConfigRules } from '@eslint/compat';
import grafanaConfig from '@grafana/eslint-config/flat.js';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default [
  {
    ignores: ['dist/', '.config/'],
  },
  ...fixupConfigRules(grafanaConfig),
  {
    rules: {
      'react/prop-types': 'off',
      'react-hooks/immutability': 'off',
    },
  },
  {
    files: ['src/**/*.{ts,tsx}'],
    rules: {
      '@typescript-eslint/no-deprecated': 'warn',
    },
    languageOptions: {
      parserOptions: {
        project: path.join(__dirname, 'tsconfig.json'),
      },
    },
  },
  {
    files: ['tests/**/*'],
    rules: {
      'react-hooks/rules-of-hooks': 'off',
    },
  },
];
