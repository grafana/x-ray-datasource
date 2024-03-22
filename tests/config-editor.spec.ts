import { test, expect } from '@grafana/plugin-e2e';

test('valid credentials should return a 200 status code', async ({ createDataSourceConfigPage, page }) => {
  const configPage = await createDataSourceConfigPage({ type: 'grafana-x-ray-datasource' });

  await page.getByLabel(/^Authentication Provider/).fill('Access & secret key');
  await page.keyboard.press('Enter');
  await page.getByLabel('Access Key ID').fill(process.env.AWS_ACCESS_KEY_ID || '');
  await page.getByLabel('Secret Access Key').fill(process.env.AWS_SECRET_ACCESS_KEY || '');
  await page.getByLabel('Default Region').fill('us-east-2');
  await page.keyboard.press('Enter');

  await expect(configPage.saveAndTest()).toBeOK();
});

test('invalid credentials should return an error', async ({ createDataSourceConfigPage, page }) => {
  const configPage = await createDataSourceConfigPage({ type: 'grafana-x-ray-datasource' });

  await page.getByLabel('Assume Role ARN').fill('arn::role/error-role');

  await expect(configPage.saveAndTest()).not.toBeOK();
});

test('healthcheck should fail if `default region` is left empty', async ({
  createDataSourceConfigPage,
  page,
  selectors,
}) => {
  const configPage = await createDataSourceConfigPage({ type: 'grafana-x-ray-datasource' });

  await page.getByLabel(/^Authentication Provider/).fill('Access & secret key');
  await page.keyboard.press('Enter');
  await page.getByLabel('Access Key ID').fill(process.env.AWS_ACCESS_KEY_ID || '');
  await page.getByLabel('Secret Access Key').fill(process.env.AWS_SECRET_ACCESS_KEY || '');

  await expect(configPage.saveAndTest()).not.toBeOK();
  await expect(configPage.getByTestIdOrAriaLabel(selectors.components.Alert.alertV2('error'))).toHaveText(
    'Plugin health check failed'
  );
});
