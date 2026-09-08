import { test, expect } from '@grafana/plugin-e2e';

const isCloudRun = !!process.env.GRAFANA_URL;
const DATA_SOURCE_UID = process.env.DS_E2E_UID || (isCloudRun ? 'xray-ds-m' : 'x-ray-e2e');

test.describe.configure({ timeout: 90_000 });

// The provisioned datasource name differs between the local Docker Grafana and the shared
// Cloud instance, so resolve it from the UID instead of hard-coding it.
test.beforeEach(async ({ page, panelEditPage }) => {
  const response = await page.request.get(`/api/datasources/uid/${DATA_SOURCE_UID}`);
  expect(response.ok(), `datasource ${DATA_SOURCE_UID} must be provisioned`).toBe(true);
  const { name } = await response.json();

  await panelEditPage.datasource.set(name);
  await panelEditPage.setVisualization('Table');
});

test(
  'data query is successful when `Trace List` query is valid',
  { tag: '@aws' },
  async ({ page, panelEditPage, selectors }) => {
    await panelEditPage.getByGrafanaSelector(selectors.components.QueryField.container).click();
    await page.keyboard.insertText('service("PetSite")');
    await page.waitForTimeout(500); // Waits for query to update because <QueryField /> debounces onChange

    await expect(page.getByRole('button', { name: 'Trace List' })).toBeVisible();
    await expect(panelEditPage.refreshPanel()).toBeOK();
    await expect(panelEditPage.panel.getErrorIcon()).not.toBeVisible();
    await expect(panelEditPage.panel.fieldNames).toHaveText(
      ['Id', 'Start Time', 'Method', 'Response', 'Response Time', 'URL', 'Client IP', 'Annotations'],
      { timeout: 30_000 }
    );
  }
);

test(
  'data query is successful when `Trace Statistics` query is valid',
  { tag: '@aws' },
  async ({ page, panelEditPage, selectors }) => {
    await panelEditPage.getByGrafanaSelector(selectors.components.QueryField.container).click();
    await page.keyboard.insertText('service("PetSite")');
    await page.waitForTimeout(500); // Waits for query to update because <QueryField /> debounces onChange
    await page.getByRole('button', { name: 'Trace List' }).click();
    await page.getByRole('menuitemcheckbox', { name: 'Trace Statistics' }).click();
    await panelEditPage.getByGrafanaSelector(selectors.components.QueryField.container).click(); // Make sure the dropdown is closed
    await page.getByRole('combobox', { name: 'Columns' }).click();
    await page.getByText('Total Count').click();
    await page.keyboard.press('Escape');

    await expect(panelEditPage.refreshPanel()).toBeOK();
    await expect(panelEditPage.panel.getErrorIcon()).not.toBeVisible();
    await expect(panelEditPage.panel.fieldNames).toHaveText(['Time', 'Total Count'], { timeout: 30_000 });
  }
);

test(
  'data query is successful when `Trace Analytics` query is valid',
  { tag: '@aws' },
  async ({ page, panelEditPage, selectors }) => {
    await panelEditPage.getByGrafanaSelector(selectors.components.QueryField.container).click();
    await page.keyboard.insertText('service("PetSite")');
    await page.waitForTimeout(500); // Waits for query to update because <QueryField /> debounces onChange
    await page.getByRole('button', { name: 'Trace List' }).click();
    await page.getByRole('menuitemcheckbox', { name: 'Trace Analytics' }).click();
    await page.getByRole('menuitemcheckbox', { name: 'HTTP status code' }).click();

    await expect(panelEditPage.refreshPanel()).toBeOK();
    await expect(panelEditPage.panel.getErrorIcon()).not.toBeVisible();
    await expect(panelEditPage.panel.fieldNames).toHaveText(['Status Code', 'Count', 'Percent'], { timeout: 30_000 });
  }
);

test(
  'data query is successful when `Service Map` query is valid',
  { tag: '@aws' },
  async ({ page, panelEditPage, selectors }) => {
    await panelEditPage.getByGrafanaSelector(selectors.components.QueryField.container).click();
    await page.keyboard.insertText('service("PetSite")');
    await page.waitForTimeout(500); // Waits for query to update because <QueryField /> debounces onChange
    await page.getByRole('button', { name: 'Trace List' }).click();
    await page.getByRole('menuitemcheckbox', { name: 'Service Map' }).click();

    await expect(panelEditPage.refreshPanel()).toBeOK();
    await expect(panelEditPage.panel.getErrorIcon()).not.toBeVisible();
    await expect(panelEditPage.panel.fieldNames).toHaveText(
      [
        /^(nodes )?id$/i,
        'Name',
        'Type',
        'Average response time',
        'Transactions per minute',
        'Success',
        'Fault',
        'Error',
        'Throttled',
      ],
      { timeout: 30_000 }
    );
  }
);

test('data query fails when query is invalid', { tag: '@aws' }, async ({ page, panelEditPage, selectors }) => {
  await panelEditPage.getByGrafanaSelector(selectors.components.QueryField.container).click();
  await page.keyboard.insertText('PetSite');
  await page.waitForTimeout(500); // Waits for query to update because <QueryField /> debounces onChange

  await expect(panelEditPage.refreshPanel()).not.toBeOK();
  await expect(panelEditPage.panel.getErrorIcon()).toBeVisible();
});
