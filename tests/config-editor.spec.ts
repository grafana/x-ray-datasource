import { test, expect } from '@grafana/plugin-e2e';

test('invalid credentials should return an error', async ({ createDataSourceConfigPage, page }) => {
  const configPage = await createDataSourceConfigPage({ type: 'grafana-x-ray-datasource' });

  await page.getByLabel('Assume Role ARN').fill('arn::role/error-role');

  await expect(configPage.saveAndTest()).not.toBeOK();
});
