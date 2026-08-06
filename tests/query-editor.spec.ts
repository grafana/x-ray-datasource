import { test, expect } from '@grafana/plugin-e2e';

// Disable the new dashboard layouts so plugin-e2e's addPanel() helper uses the
// stable "Add panel" flow instead of the sidebar/edit-pane path.
//
// Grafana 13.2.0 (the nightly build in CI's e2e matrix) renamed the sidebar
// test ids, e.g. "edit pane configure panel button" -> "sidebar configure panel
// button". @grafana/plugin-e2e@3.10.0 pins @grafana/e2e-selectors@13.1.0, which
// only knows the old name, so addPanel() waits for a test id that no longer
// exists and panelEditPage setup times out. No stable e2e-selectors release
// carries the new name yet (only Grafana's nightly prerelease does).
//
// Remove this override once we upgrade to a @grafana/plugin-e2e release whose
// bundled @grafana/e2e-selectors includes the Grafana 13.2.0 sidebar selectors.
test.use({ featureToggles: { dashboardNewLayouts: false } });

test('data query is successful when `Trace List` query is valid', async ({ page, panelEditPage, selectors }) => {
  await panelEditPage.datasource.set('AWS X-Ray E2E');
  await panelEditPage.setVisualization('Table');

  await panelEditPage.getByGrafanaSelector(selectors.components.QueryField.container).click();
  await page.keyboard.insertText('service("PetSite")');
  await page.waitForTimeout(500); // Waits for query to update because <QueryField /> debounces onChange

  await expect(page.getByRole('button', { name: 'Trace List' })).toBeVisible();
  await expect(panelEditPage.refreshPanel()).toBeOK();
  await expect(panelEditPage.panel.getErrorIcon()).not.toBeVisible();
  await expect(panelEditPage.panel.fieldNames).toHaveText([
    'Id',
    'Start Time',
    'Method',
    'Response',
    'Response Time',
    'URL',
    'Client IP',
    'Annotations',
  ]);
});

test('data query is successful when `Trace Statistics` query is valid', async ({ page, panelEditPage, selectors }) => {
  await panelEditPage.datasource.set('AWS X-Ray E2E');
  await panelEditPage.setVisualization('Table');

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
  await expect(panelEditPage.panel.fieldNames).toHaveText(['Time', 'Total Count']);
});

test('data query is successful when `Trace Analytics` query is valid', async ({ page, panelEditPage, selectors }) => {
  await panelEditPage.datasource.set('AWS X-Ray E2E');
  await panelEditPage.setVisualization('Table');

  await panelEditPage.getByGrafanaSelector(selectors.components.QueryField.container).click();
  await page.keyboard.insertText('service("PetSite")');
  await page.waitForTimeout(500); // Waits for query to update because <QueryField /> debounces onChange
  await page.getByRole('button', { name: 'Trace List' }).click();
  await page.getByRole('menuitemcheckbox', { name: 'Trace Analytics' }).click();
  await page.getByRole('menuitemcheckbox', { name: 'HTTP status code' }).click();

  await expect(panelEditPage.refreshPanel()).toBeOK();
  await expect(panelEditPage.panel.getErrorIcon()).not.toBeVisible();
  await expect(panelEditPage.panel.fieldNames).toHaveText(['Status Code', 'Count', 'Percent']);
});

test('data query is successful when `Service Map` query is valid', async ({ page, panelEditPage, selectors }) => {
  await panelEditPage.datasource.set('AWS X-Ray E2E');
  await panelEditPage.setVisualization('Table');

  await panelEditPage.getByGrafanaSelector(selectors.components.QueryField.container).click();
  await page.keyboard.insertText('service("PetSite")');
  await page.waitForTimeout(500); // Waits for query to update because <QueryField /> debounces onChange
  await page.getByRole('button', { name: 'Trace List' }).click();
  await page.getByRole('menuitemcheckbox', { name: 'Service Map' }).click();

  await expect(panelEditPage.refreshPanel()).toBeOK();
  await expect(panelEditPage.panel.getErrorIcon()).not.toBeVisible();
  await expect(panelEditPage.panel.fieldNames).toHaveText([
    /^(nodes )?id$/i,
    'Name',
    'Type',
    'Average response time',
    'Transactions per minute',
    'Success',
    'Fault',
    'Error',
    'Throttled',
  ]);
});

test('data query fails when query is invalid', async ({ page, panelEditPage, selectors }) => {
  await panelEditPage.datasource.set('AWS X-Ray E2E');
  await panelEditPage.setVisualization('Table');

  await panelEditPage.getByGrafanaSelector(selectors.components.QueryField.container).click();
  await page.keyboard.insertText('PetSite');
  await page.waitForTimeout(500); // Waits for query to update because <QueryField /> debounces onChange

  await expect(panelEditPage.refreshPanel()).not.toBeOK();
  await expect(panelEditPage.panel.getErrorIcon()).toBeVisible();
});
