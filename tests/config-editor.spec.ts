import { test, expect } from '@grafana/plugin-e2e';
import type { Page } from '@playwright/test';

const PLUGIN_TYPE = 'grafana-x-ray-datasource';
const isCloudRun = !!process.env.GRAFANA_URL;

async function configurePDC(page: Page, networkName: string) {
  await page.getByRole('combobox', { name: 'Private data source connect' }).click();
  await page.getByText(networkName, { exact: true }).click();
}

test('invalid credentials should return an error', async ({ createDataSourceConfigPage, page }) => {
  const configPage = await createDataSourceConfigPage({ type: PLUGIN_TYPE });

  await page.getByLabel('Assume Role ARN').fill('arn::role/error-role');

  await expect(configPage.saveAndTest()).not.toBeOK();
});

test(
  'valid injected credentials should pass the health check',
  { tag: '@aws' },
  async ({ createDataSourceConfigPage, page }) => {
    test.skip(
      isCloudRun,
      'Ad-hoc save and test hangs on the shared Cloud instance; managed datasource connectivity is covered by query tests'
    );

    const accessKey = process.env.AWS_ACCESS_KEY_ID;
    const secretKey = process.env.AWS_SECRET_ACCESS_KEY;
    const region = process.env.AWS_DEFAULT_REGION;
    const hasCredentials = !!accessKey && !!secretKey && !!region;

    // Trusted PR CI provisions Grafana from Docker's .env, but does not expose those
    // values to Playwright. The credential-entry flow runs in Bench or with local exports.
    test.skip(!process.env.GRAFANA_URL && !hasCredentials, 'Requires injected AWS credentials');
    expect(hasCredentials, 'Cloud E2E must inject AWS credentials into Playwright').toBe(true);

    const configPage = await createDataSourceConfigPage({ type: PLUGIN_TYPE });

    await page.getByRole('combobox', { name: 'Authentication Provider', exact: true }).click();
    await page.getByText('Access & secret key', { exact: true }).click();
    await page.getByLabel('Access Key ID').fill(accessKey ?? '');
    await page.getByLabel('Secret Access Key').fill(secretKey ?? '');
    await page.getByLabel('Default Region').click();
    await page.getByText(region ?? '', { exact: true }).click();

    if (process.env.DS_PDC_NETWORK_NAME) {
      await configurePDC(page, process.env.DS_PDC_NETWORK_NAME);
    }

    await expect(configPage.saveAndTest()).toBeOK();
  }
);
