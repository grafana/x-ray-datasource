import { test, expect } from '@grafana/plugin-e2e';
import type { Page } from '@playwright/test';
import { QueryMode, XrayQueryType } from '../src/types';

const PLUGIN_TYPE = 'grafana-x-ray-datasource';
const isCloudRun = !!process.env.GRAFANA_URL;
const DATA_SOURCE_UID = process.env.DS_E2E_UID || (isCloudRun ? 'xray-ds-m' : 'x-ray-e2e');

test.describe.configure({ mode: 'serial', timeout: 60_000 });

function exploreUrl(query: Record<string, unknown>) {
  const panes = JSON.stringify({
    xray: {
      datasource: DATA_SOURCE_UID,
      queries: [
        {
          refId: 'A',
          datasource: { type: PLUGIN_TYPE, uid: DATA_SOURCE_UID },
          queryMode: QueryMode.xray,
          region: 'default',
          group: { GroupARN: 'default', GroupName: 'Default' },
          ...query,
        },
      ],
      range: { from: 'now-6h', to: 'now' },
    },
  });
  return `/explore?orgId=1&schemaVersion=1&panes=${encodeURIComponent(panes)}`;
}

async function openExploreQuery(page: Page, query: Record<string, unknown>) {
  await page.goto(exploreUrl(query));
}

test('data query is successful when `Trace List` query is valid', { tag: '@aws' }, async ({ page, explorePage }) => {
  const query = 'service("PetSite")';
  await openExploreQuery(page, { queryType: XrayQueryType.getTraceSummaries, query });

  const queryParam = new URLSearchParams({ filter: query }).toString();
  await expect(page.getByRole('button', { name: 'Trace List' })).toBeVisible({ timeout: 30_000 });
  await expect(page.getByRole('link', { name: 'Open in X-Ray Traces console' })).toHaveAttribute(
    'href',
    new RegExp(`[?&]${queryParam}(?:&|$)`)
  );
  await expect(explorePage.tablePanel.getErrorIcon()).not.toBeVisible();
  await expect(explorePage.tablePanel.fieldNames).toContainText(
    ['Id', 'Start Time', 'Method', 'Response', 'Response Time', 'URL', 'Client IP'],
    { timeout: 30_000 }
  );
});

test(
  'data query is successful when `Trace Statistics` query is valid',
  { tag: '@aws' },
  async ({ page, explorePage }) => {
    await openExploreQuery(page, {
      queryType: XrayQueryType.getTimeSeriesServiceStatistics,
      query: 'service("PetSite")',
      columns: ['TotalCount'],
    });

    await expect(page.getByRole('button', { name: 'Trace Statistics' })).toBeVisible({ timeout: 30_000 });
    await expect(explorePage.tablePanel.getErrorIcon()).not.toBeVisible();
    await expect(explorePage.tablePanel.fieldNames).toHaveText(['Time', 'Total Count'], { timeout: 30_000 });
  }
);

test(
  'data query is successful when `Trace Analytics` query is valid',
  { tag: '@aws' },
  async ({ page, explorePage }) => {
    await openExploreQuery(page, {
      queryType: XrayQueryType.getAnalyticsStatusCode,
      query: 'service("PetSite")',
    });

    await expect(page.getByRole('button', { name: 'HTTP status code' })).toBeVisible({ timeout: 30_000 });
    await expect(explorePage.tablePanel.getErrorIcon()).not.toBeVisible();
    await expect(explorePage.tablePanel.fieldNames).toHaveText(['Status Code', 'Count', 'Percent'], {
      timeout: 30_000,
    });
  }
);

test('data query is successful when `Service Map` query is valid', { tag: '@aws' }, async ({ page }) => {
  await openExploreQuery(page, {
    queryType: XrayQueryType.getServiceMap,
    query: 'service("PetSite")',
  });

  await expect(page.getByRole('button', { name: 'Service Map' })).toBeVisible({ timeout: 30_000 });
  await expect(page.getByRole('region', { name: 'Node graph' })).toBeVisible({ timeout: 30_000 });
});

test('data query fails when query is invalid', { tag: '@aws' }, async ({ page }) => {
  await openExploreQuery(page, { queryType: XrayQueryType.getTraceSummaries, query: 'PetSite' });

  await expect(page.getByText(/InvalidRequestException/)).toBeVisible({ timeout: 30_000 });
});
