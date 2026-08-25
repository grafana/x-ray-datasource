import { test, expect } from '@grafana/plugin-e2e';

const PLUGIN_TYPE = 'grafana-x-ray-datasource';
const isCloudRun = !!process.env.GRAFANA_URL;
const MANAGED_DATA_SOURCE_UID = process.env.DS_E2E_UID || 'xray-ds-m';

test('invalid credentials should return an error', async ({ createDataSourceConfigPage, page }) => {
  const configPage = await createDataSourceConfigPage({ type: PLUGIN_TYPE });

  await page.getByLabel('Assume Role ARN').fill('arn::role/error-role');

  await expect(configPage.saveAndTest()).not.toBeOK();
});

test(
  'valid injected credentials should pass the health check',
  { tag: '@aws' },
  async ({ createDataSourceConfigPage, page }) => {
    // This datasource's PDC network is not available on the shared Cloud instance, so an
    // ad-hoc datasource cannot reach X-Ray there. The provisioned one already has PDC wired
    // up and is covered by the health check below.
    test.skip(isCloudRun, 'PDC network for this datasource is not available on the shared Cloud instance');

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

    await expect(configPage.saveAndTest()).toBeOK();
  }
);

test('provisioned datasource passes the health check', { tag: '@aws' }, async ({ page }) => {
  test.skip(!isCloudRun, 'Exercises the managed Cloud datasource; local runs configure their own');

  const response = await page.request.get(`/api/datasources/uid/${MANAGED_DATA_SOURCE_UID}/health`);

  await expect(response).toBeOK();
  expect((await response.json()).status).toBe('OK');
});
