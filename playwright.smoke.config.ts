import { defineConfig } from '@playwright/test';

import baseConfig from './playwright.config';

// Fork PRs cannot read Vault secrets, so exclude tests that require the live AWS backend.
export default defineConfig(baseConfig, {
  grepInvert: /@aws/,
});
