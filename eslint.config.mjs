import path from 'node:path';
import { fileURLToPath } from 'node:url';
import js from '@eslint/js';
import { FlatCompat } from '@eslint/eslintrc';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const compat = new FlatCompat({
  baseDirectory: __dirname,
  recommendedConfig: js.configs.recommended,
  allConfig: js.configs.all,
});
export default [
  {
    ignores: ['**/node_modules', '**/build', '**/dist', '**/playwright-report', '**/test-results'],
  },
  ...compat.extends('./.config/.eslintrc'),
  {
    rules: {
      'deprecation/deprecation': 'off',
    },
  },
  {
    files: ['src/**/*.{ts,tsx,js,jsx}'],
    rules: {
      '@typescript-eslint/no-deprecated': 'warn',
    },
  },
];
