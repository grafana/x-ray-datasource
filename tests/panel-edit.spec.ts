import { test, expect } from '@grafana/plugin-e2e';

const isCloudRun = !!process.env.GRAFANA_URL;
const DATA_SOURCE_UID = process.env.DS_E2E_UID || (isCloudRun ? 'xray-ds-m' : 'x-ray-e2e');

// plugin-e2e 3.10.0 crashed on the shared Cloud instance before reaching the plugin:
// DashboardPage.addPanel read window.grafanaBootData.settings.featureToggles without a
// guard and it was not populated yet. 3.12.0 waits for boot data, so this spec proves
// the panel editor path works on Cloud again.
test('panel editor loads the X-Ray query editor', { tag: '@aws' }, async ({ page, panelEditPage }) => {
  const response = await page.request.get(`/api/datasources/uid/${DATA_SOURCE_UID}`);
  expect(response.ok()).toBe(true);
  const { name } = await response.json();

  await panelEditPage.datasource.set(name);

  // New X-Ray queries default to Trace List, so the query-type button showing up
  // means the plugin's query editor rendered inside the panel editor.
  await expect(page.getByRole('button', { name: 'Trace List' })).toBeVisible({ timeout: 30_000 });
});
