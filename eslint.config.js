const { fixupConfigRules } = require('@eslint/compat');
const grafanaConfig = require('@grafana/eslint-config/flat');
const path = require('path');

module.exports = [
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
